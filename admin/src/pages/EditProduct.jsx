import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const EditProduct = ({ adminCredentials }) => {
    const { productId } = useParams();

    // Store original product to compare changes
    const [originalProduct, setOriginalProduct] = useState(null);

    // Loading state while fetching product
    const [loading, setLoading] = useState(true);

    // Form fields (except images)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);

    // Images state: array of 4 slots, each is { file, preview } or { url }
    const [images, setImages] = useState([
        { url: null },
        { url: null },
        { url: null },
        { url: null },
    ]);

    // Fetch product and initialize form
    useEffect(() => {
        axios
            .post(backendUrl + "/api/product/single", { productId })
            .then((res) => {
                if (res.data.success) {
                    const p = res.data.message;
                    setOriginalProduct(p);

                    // Initialize non-image fields
                    setName(p.name || "");
                    setDescription(p.description || "");
                    setPrice(p.price || "");
                    setCategory(p.category || "Men");
                    setSubCategory(p.subCategory || "Topwear");
                    setBestseller(p.bestseller || false);
                    setSizes(p.sizes || []);

                    // Initialize image slots from URLs
                    const imgs = p.image || [];
                    setImages(
                        [0, 1, 2, 3].map((i) => ({
                            url: imgs[i] || null,
                        }))
                    );
                } else {
                    toast.error(res.data.message || "Failed to load product");
                }
                setLoading(false);
            })
            .catch(() => {
                toast.error("Failed to load product data.");
                setLoading(false);
            });
    }, [productId]);

    // Handle image file change for an image slot
    const onImageChange = (index, file) => {
        const preview = URL.createObjectURL(file);
        setImages((prev) => {
            const newImages = [...prev];
            newImages[index] = { file, preview };
            return newImages;
        });
    };

    // Get preview URL for an image slot
    const getPreviewSrc = (slot) => {
        if (slot.file && slot.preview) return slot.preview;
        if (slot.url) return slot.url;
        return assets.upload_area; // your placeholder image path
    };

    // Toggle sizes selection
    const toggleSize = (size) => {
        setSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    // Check if the form data is changed compared to original product
    const isFormChanged = () => {
        if (!originalProduct) return true; // no original product, considered changed

        if (
            name !== originalProduct.name ||
            description !== originalProduct.description ||
            Number(price) !== originalProduct.price ||
            category !== originalProduct.category ||
            subCategory !== originalProduct.subCategory ||
            bestseller !== originalProduct.bestseller ||
            JSON.stringify(sizes.sort()) !==
            JSON.stringify((originalProduct.sizes || []).sort())
        )
            return true;

        // Check images: if any slot has a new file, it is changed
        for (let i = 0; i < images.length; i++) {
            const slot = images[i];
            if (slot.file) return true; // new file selected
            // Also check if URLs changed or removed (number of images)
            const originalUrl = originalProduct.image?.[i] || null;
            if (slot.url !== originalUrl) return true;
        }
        return false;
    };

    // Handle form submit for updating product
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!adminCredentials) {
            toast.error("Admin credentials are required!");
            return;
        }

        if (!isFormChanged()) {
            toast.info("No changes detected.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("id", productId);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("sizes", JSON.stringify(sizes));

            // Append images as files or URLs
            images.forEach((slot, idx) => {
                if (slot.file) {
                    formData.append(`image${idx + 1}`, slot.file);
                } else if (slot.url) {
                    formData.append(`image${idx + 1}`, slot.url);
                }
            });

            const response = await axios.post(
                backendUrl + "/api/product/edit",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        email: adminCredentials.email,
                        password: adminCredentials.password,
                    },
                }
            );

            if (response.data.success) {
                toast.success("Product updated successfully.");

                // Clear all fields just like Add form
                setName("");
                setDescription("");
                setPrice("");
                setCategory("Men");
                setSubCategory("Topwear");
                setBestseller(false);
                setSizes([]);
                setImages([
                    { url: null },
                    { url: null },
                    { url: null },
                    { url: null },
                ]);
                setOriginalProduct(null);
            } else {
                toast.error(response.data.message || "Update failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during updating the product");
        }
    };

    if (loading) return <p>Loading product data...</p>;

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
            <div>
                <p className="mb-2">Upload Image</p>
                <div className="flex gap-2">
                    {images.map((slot, idx) => (
                        <label key={idx} htmlFor={`image${idx + 1}`}>
                            <img
                                className="w-20 border cursor-pointer"
                                src={getPreviewSrc(slot)}
                                alt={`image${idx + 1}`}
                            />
                            <input
                                type="file"
                                id={`image${idx + 1}`}
                                hidden
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        onImageChange(idx, e.target.files[0]);
                                    }
                                }}
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <p className="mb-2">Product name</p>
                <input
                    type="text"
                    required
                    className="w-full max-w-[500px] px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="w-full">
                <p className="mb-2">Product description</p>
                <textarea
                    placeholder="Write content here"
                    required
                    className="w-full max-w-[500px] px-3 py-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                <div>
                    <p className="mb-2">Product category</p>
                    <select
                        className="w-full px-3 py-2"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>
                <div>
                    <p className="mb-2">Sub category</p>
                    <select
                        className="w-full px-3 py-2"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                    >
                        <option value="Topwear">Topwear</option>
                        <option value="Bottomwear">Bottomwear</option>
                        <option value="Winterwear">Winterwear</option>
                    </select>
                </div>
                <div>
                    <p className="mb-2">Product Price</p>
                    <input
                        type="number"
                        placeholder="25"
                        className="w-full px-3 py-2 sm:w-[120px]"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <p className="mb-2">Product Sizes</p>
                <div className="flex gap-3">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                        <div
                            key={size}
                            onClick={() =>
                                setSizes((prev) =>
                                    prev.includes(size)
                                        ? prev.filter((s) => s !== size)
                                        : [...prev, size]
                                )
                            }
                        >
                            <p
                                className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                                    } px-3 py-1 cursor-pointer`}
                            >
                                {size}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    type="checkbox"
                    id="bestseller"
                    checked={bestseller}
                    onChange={() => setBestseller((prev) => !prev)}
                />
                <label className="cursor-pointer" htmlFor="bestseller">
                    Add to bestseller
                </label>
            </div>

            <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
                UPDATE
            </button>
        </form>
    );
};

export default EditProduct;
