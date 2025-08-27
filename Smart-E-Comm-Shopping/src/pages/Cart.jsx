import { useContext } from "react";
import { assets } from "../assets/assets"; // Assuming you have an assets file
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, getCartAmount } =
    useContext(ShopContext);

  const cartData = [];
  for (const itemId in cartItems) {
    for (const size in cartItems[itemId]) {
      if (cartItems[itemId][size] > 0) {
        const productData = products.find((product) => product._id === itemId);
        if (productData) {
          cartData.push({
            ...productData,
            size: size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }
  }

  if (cartData.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Title text1={"YOUR CART IS"} text2={"EMPTY"} />
        <p className="mt-4 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-black text-white px-8 py-3 text-sm font-semibold rounded-md hover:bg-gray-800 transition-all"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    )
  }

  return (
    <div className="border-t pt-14 px-4 sm:px-0">
      <div className="text-2xl pb-6">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {/* Cart Grid */}
      <div className="w-full">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 py-3 border-b font-semibold text-gray-700">
          <p>Product</p>
          <p className="text-center">Price</p>
          <p className="text-center">Quantity</p>
          <p className="text-right">Subtotal</p>
          <p></p> {/* For remove icon */}
        </div>

        {/* Cart Items */}
        {cartData.map((item) => (
          <div
            key={`${item._id}-${item.size}`}
            className="grid grid-cols-[3fr_1fr] sm:grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 py-4 border-b text-gray-800"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4">
              <img
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                src={item.image[0]}
                alt={item.name}
              />
              <div>
                <p className="text-sm sm:text-base font-medium">{item.name}</p>
                <p className="px-2 py-0.5 border bg-slate-50 w-fit mt-2 text-xs rounded-sm">
                  Size: {item.size}
                </p>
              </div>
            </div>

            {/* Price (hidden on mobile) */}
            <p className="hidden sm:block text-center">{currency}{item.price.toFixed(2)}</p>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center sm:justify-center gap-2">
              <input
                onChange={(e) => {
                  const newQuantity = Number(e.target.value);
                  if (newQuantity > 0) {
                    updateQuantity(item._id, item.size, newQuantity);
                  }
                }}
                className="border w-16 px-2 py-1 rounded-md text-center"
                type="number"
                min="1"
                value={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-5 h-5 cursor-pointer sm:hidden"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>

            {/* Subtotal */}
            <p className="text-right font-semibold">
              {currency}{(item.price * item.quantity).toFixed(2)}
            </p>


            <div className="hidden sm:flex justify-center">
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-5 h-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Cart Totals and Checkout */}
      <div className="flex flex-col md:flex-row justify-between gap-10 my-20">

        <div className="flex-1 flex justify-end">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <button
              onClick={() => navigate("/place-order")}
              className="w-full bg-orange-500 text-white text-base font-semibold my-6 py-4 rounded-md hover:bg-orange-600 transition-all"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;