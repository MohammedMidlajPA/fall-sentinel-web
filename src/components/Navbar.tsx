import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-semibold text-lg">
            Railway Safety
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`transition-colors duration-200 hover:text-black/70 ${
                  location.pathname === link.href
                    ? "text-black"
                    : "text-black/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="sm:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="sm:hidden py-4 space-y-2 fade-in">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-2 rounded-md transition-colors duration-200 hover:bg-black/5 ${
                  location.pathname === link.href
                    ? "text-black"
                    : "text-black/60"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;