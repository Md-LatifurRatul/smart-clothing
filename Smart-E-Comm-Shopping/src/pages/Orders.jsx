import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const Orders = () => {
  const { backendUrl, userId, currency, products } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      console.log("Loading orders for userId:", userId);

      if (!userId) {
        console.log("No userId found");
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { userId } }
      );

      console.log("Orders API response:", response.data);

      if (response.data.success) {
        const orders = response.data.orders;
        console.log("Raw orders from API:", orders);

        if (orders.length === 0) {
          console.log("No orders found for this user");
          setOrderData([]);
          return;
        }

        let allOrdersItem = [];

        orders.forEach((order) => {
          console.log("Processing order:", order);

          order.items.forEach((item) => {
            // Find the full product details from products context
            const productDetails = products.find(product => product._id === item._id);

            if (productDetails) {
              // Combine order info with product details
              const orderItem = {
                ...productDetails, // Full product details (name, image, price, etc.)
                quantity: item.quantity,
                size: item.size,
                status: order.status,
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                date: order.date,
                orderId: order._id
              };
              allOrdersItem.push(orderItem);
            } else {
              console.log("Product not found for item:", item);
              // Fallback if product details not found
              const orderItem = {
                _id: item._id,
                name: item.name || "Product Not Found",
                image: item.image || ["/placeholder.jpg"],
                price: item.price || 0,
                quantity: item.quantity,
                size: item.size,
                status: order.status,
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                date: order.date,
                orderId: order._id
              };
              allOrdersItem.push(orderItem);
            }
          });
        });

        console.log("Final processed order items:", allOrdersItem);
        setOrderData(allOrdersItem.reverse());
      } else {
        console.log("API failed:", response.data.message);
      }
    } catch (error) {
      console.log("Orders API error:", error);
    }
  };

  useEffect(() => {

    if (userId && products.length > 0) {
      loadOrderData();
    }
  }, [userId, products]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  src={item.image && item.image[0] ? item.image[0] : "/placeholder.jpg"}
                  alt="product"
                  className="w-16 sm:w-20"
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    Payment: {" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className={`min-w-2 h-2 rounded-full ${item.payment ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
