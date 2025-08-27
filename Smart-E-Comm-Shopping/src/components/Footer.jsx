import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="logo" />

          <p className="w-full md:w-2/3 text-gray-600 ">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis
            minus, praesentium eum autem nisi illo voluptas in cum placeat
            explicabo nemo nobis nulla sit perferendis fugiat, vitae amet
            suscipit magni.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>

          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>

          <ul
            className="flex flex-col gap-1 text-gray-600
    "
          >
            <li>+88-01723-121212</li>
            <li>abcontact@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025@ clothingforall.com - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
