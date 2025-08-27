import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-3 mt-4 text-base">
        <div className="flex justify-between text-gray-700">
          <p>Subtotal</p>
          <p>
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between text-gray-700">
          <p>Shipping Fee</p>
          <p>
            {currency} {subtotal > 0 ? delivery_fee.toFixed(2) : (0).toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between font-bold">
          <p>Total</p>
          <p>
            {currency}{" "}
            {subtotal > 0 ? (subtotal + delivery_fee).toFixed(2) : (0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;