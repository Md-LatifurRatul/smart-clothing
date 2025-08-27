import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import EditProduct from "./pages/EditProduct";
import List from "./pages/List";
import Orders from "./pages/Orders";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const App = () => {
  const [adminCredentials, setAdminCredentials] = useState(
    localStorage.getItem("adminEmail") && localStorage.getItem("adminPassword")
      ? {
        email: localStorage.getItem("adminEmail"),
        password: localStorage.getItem("adminPassword"),
      }
      : null
  );

  useEffect(() => {
    if (adminCredentials) {
      localStorage.setItem("adminEmail", adminCredentials.email);
      localStorage.setItem("adminPassword", adminCredentials.password);
    } else {
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminPassword");
    }
  }, [adminCredentials]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {!adminCredentials ? (
        <Login setAdminCredentials={setAdminCredentials} />
      ) : (
        <>
          <Navbar setAdminCredentials={setAdminCredentials} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,12%)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add adminCredentials={adminCredentials} />} />
                <Route path="/edit-product/:productId" element={<EditProduct adminCredentials={adminCredentials} />} />
                <Route path="/list" element={<List adminCredentials={adminCredentials} />} />
                <Route path="/orders" element={<Orders adminCredentials={adminCredentials} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
