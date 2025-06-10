import React from "react";
import { Heading } from "../common/Typography";
import Background from "../common/Background";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import { XIcon } from "../icons/Icons"; // You'll need these icons
import { Menu } from "lucide-react";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <Background
      variant="white"
      className="sticky top-0 z-50 shadow-[-6px_-2px_12px_0px_rgba(0,0,0,0.04),6px_12px_12px_0px_rgba(0,0,0,0.02)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="DriveShpere Logo"
              className="h-9 w-auto"
            />
            <Heading className="text-[30px] text-[#000000] font-extrabold font-nunito ">
              DriveShpere
            </Heading>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-[#000000] font-regular font-nunito text-base hover:text-[#9370DB] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/"
              className="text-[#9370DB] border-b-2 border-[#9370DB] font-bold font-nunito pb-1"
            >
              Car Library
            </Link>
            <Link
              to="/services"
              className="text-[#000000] font-regular font-nunito text-base hover:text-[#9370DB] transition-colors"
            >
              Services
            </Link>
            <Link
              to="/offers"
              className="text-[#000000] font-regular font-nunito text-base hover:text-[#9370DB] transition-colors"
            >
              Special Offers
            </Link>
            <Link
              to="/recycle-bin"
              className="text-[#000000] font-regular font-nunito text-base hover:text-[#9370DB] transition-colors"
            >
              Recycle Bin
            </Link>
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#000000] font-regular font-nunito text-base hover:text-[#9370DB] focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Contact Us Button - Hidden on mobile */}
          <div className="hidden lg:block">
            <Button
              variant="primary"
              className="rounded-full  font-regular font-nunito text-base"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Shows when mobileMenuOpen is true */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-4">
            <Link
              to="/"
              className="block px-3 py-2 text-[#000000] font-regular font-nunito text-base hover:text-[#9370DB] hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/"
              className="block px-3 py-2 text-[#9370DB] bg-purple-50 rounded-md font-bold font-nunito"
              onClick={() => setMobileMenuOpen(false)}
            >
              Car Library
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 text-[#000000] font-regular font-nunito text-base hover:text-[#9370DB] hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/offers"
              className="block px-3 py-2 text-[#000000] font-regular font-nunito text-base hover:text-[#9370DB] hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Special Offers
            </Link>
            <Link
              to="/recycle-bin"
              className="block px-3 py-2 text-[#000000] font-regular font-nunito text-base hover:text-[#9370DB] hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recycle Bin
            </Link>
            <Button
              variant="primary"
              className="w-full mt-2 rounded-full  font-regular font-nunito text-base"
              onClick={() => {
                window.location.href = "/contact";
                setMobileMenuOpen(false);
              }}
            >
              Contact Us
            </Button>
          </div>
        )}
      </div>
    </Background>
  );
};

export default Header;
