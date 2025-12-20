import React from "react";

const Header = ({ onHomeClick }) => {
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (onHomeClick) onHomeClick();
  };

  return (
    <header className="bg-gray-900 text-white py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Guided Breathing</div>
        <nav className="space-x-6">
          <a
            href="#home"
            onClick={handleHomeClick}
            className="hover:text-blue-400 transition duration-300 cursor-pointer"
          >
            Home
          </a>
          <a
            href="#about"
            className="hover:text-blue-400 transition duration-300"
          >
            About
          </a>
          <a
            href="#contact"
            className="hover:text-blue-400 transition duration-300"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
