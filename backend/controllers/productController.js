
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// add product function



const addProduct = async (req, res) => {

    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item != undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url

            })
        )



        // console.log(name, description, price, category, subCategory, sizes, bestseller)
        // console.log(imagesUrl);

        const productData = {
            name, description, category, price: Number(price), subCategory, bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);
        const product = new productModel(productData);
        await product.save()


        res.json({ success: true, message: "Product Added" })




    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }




}


const editProduct = async (req, res) => {
    try {
        const {
            id,
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
        } = req.body;

        // Sizes sent as JSON string - parse it
        const parsedSizes = sizes ? JSON.parse(sizes) : [];

        // bestseller string to boolean
        const isBestseller = bestseller === "true";

        // images array to be constructed slot by slot
        const newImagesArray = [];

        // There are up to 4 image slots: image1, image2, image3, image4
        // For each slot:
        // - If uploaded a new file in req.files.imageN, upload it to Cloudinary & add URL
        // - Else, check if req.body.imageN is a string (existing URL) and add that

        for (let i = 1; i <= 4; i++) {
            const fileField = `image${i}`;
            if (req.files && req.files[fileField] && req.files[fileField][0]) {
                // New file uploaded -> upload to Cloudinary
                const filePath = req.files[fileField][0].path;
                const uploadResult = await cloudinary.uploader.upload(filePath, {
                    resource_type: "image",
                });
                newImagesArray.push(uploadResult.secure_url);
            } else if (req.body[fileField]) {
                // Existing image URL string sent -> keep as is
                newImagesArray.push(req.body[fileField]);
            }
            // else: no file and no URL; skip this slot (this means fewer images)
        }

        // Construct updated product data
        const updatedProductData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: isBestseller,
            sizes: parsedSizes,
            image: newImagesArray,
            date: Date.now(),
        };

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            { $set: updatedProductData },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Optionally return updated product data to update frontend UI
        return res.json({
            success: true,
            message: "Product updated",
            product: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// function for list products

const listProducts = async (req, res) => {

    try {

        const products = await productModel.find({});
        res.json({ success: true, products })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }



}


// remove product function

const removeProduct = async (req, res) => {

    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }



}


// single proudct info

const singleProduct = async (req, res) => {


    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)


        res.json({ success: true, message: product })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }




}

export { addProduct, editProduct, listProducts, removeProduct, singleProduct };

