import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2023 Breathing Patterns App. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a
              href="mailto:harshitc153@gmail.com"
              className="hover:text-blue-400 transition duration-300"
            >
              <FaEnvelope size={24} />
            </a>
            <a
              href="https://instagram.com/youraccount"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition duration-300"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://wa.me/yournumber"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition duration-300"
            >
              <FaWhatsapp size={24} />
            </a>
            <a
              href="https://twitter.com/youraccount"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition duration-300"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/harshit-chaudhary-992971286/?original_referer=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2F&originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition duration-300"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
