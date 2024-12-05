import React from "react";

const Footer = () => {
  return (
    <footer className="py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-bold">Naturub Accessories BD</span>. All rights
          reserved.
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="/about" className="hover:underline">
            About Us
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
