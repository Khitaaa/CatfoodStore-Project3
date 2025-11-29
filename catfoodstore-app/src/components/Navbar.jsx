import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const STATIC_PAGES = [
  { label: "หน้าแรก", path: "/" },
  { label: "สินค้าทั้งหมด", path: "/products" },
  { label: "เกี่ยวกับเรา", path: "/about" },
  { label: "ติดต่อ", path: "/contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  /* ======================================================
       CART COUNT (นับจำนวน "รายการ" ไม่ใช่จำนวนชิ้น)
  ====================================================== */
  useEffect(() => {
    const loadCart = () => {
      const stored = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(stored.length);  // ⭐ นับจำนวน unique items
    };

    loadCart();
    window.addEventListener("cart-updated", loadCart);

    return () => window.removeEventListener("cart-updated", loadCart);
  }, []);

  /* ======================================================
       SMART SEARCH SUGGESTION
  ====================================================== */
  useEffect(() => {
    if (searchText.trim() === "") {
      setSuggestions([]);
      return;
    }

    let results = [];

    // MATCH STATIC PAGES
    STATIC_PAGES.forEach((page) => {
      if (page.label.toLowerCase().includes(searchText.toLowerCase())) {
        results.push({ type: "page", label: page.label, path: page.path });
      }
    });

    // MATCH PRODUCTS
    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.forEach((p) => {
      if (p.name.toLowerCase().includes(searchText.toLowerCase())) {
        results.push({ type: "product", label: p.name, path: `/products/${p.id}` });
      }
    });

    // MATCH COMMON KEYWORDS
    const dynamic = [
      { keyword: "kitten", label: "ลูกแมว (Kitten)", path: "/products?age=kitten" },
      { keyword: "adult", label: "แมวโต (Adult)", path: "/products?age=adult" },
      { keyword: "wet", label: "อาหารเปียก", path: "/products?type=wet" },
      { keyword: "dry", label: "อาหารเม็ด", path: "/products?type=dry" },
      { keyword: "urinary", label: "ปัญหาปัสสาวะ", path: "/products?health=urinary" },
    ];

    dynamic.forEach((item) => {
      if (item.keyword.includes(searchText.toLowerCase())) results.push(item);
    });

    setSuggestions(results.slice(0, 7));
  }, [searchText]);

  /* SUBMIT SEARCH */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    navigate(`/products?search=${searchText}`);
    setSuggestions([]);
    setSearchText("");
  };

  /* ACTIVE MENU STYLE */
  const navClass = ({ isActive }) =>
    `relative px-4 py-1 font-medium transition ${
      isActive
        ? "text-white after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-white"
        : "text-white/80 hover:text-white"
    }`;

  /* ======================================================
       RENDER
  ====================================================== */
  return (
    <nav className="bg-red-600/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-white tracking-wide">
            Srivilize
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10 mx-auto">
            <NavLink to="/" className={navClass}>หน้าแรก</NavLink>
            <NavLink to="/products" className={navClass}>สินค้าทั้งหมด</NavLink>
            <NavLink to="/about" className={navClass}>เกี่ยวกับเรา</NavLink>
            <NavLink to="/contact" className={navClass}>ติดต่อ</NavLink>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex items-center gap-6 relative">

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="relative w-64 hidden md:block">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="ค้นหาสินค้า / เมนู..."
                className="w-full h-10 bg-white/20 text-white placeholder-white/70 
                  pl-4 pr-10 rounded-full text-sm border border-white/30 
                  backdrop-blur-xl focus:border-white/80 transition"
              />

              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              >
                🔍
              </button>

              {/* SEARCH SUGGESTIONS */}
              {suggestions.length > 0 && (
                <div className="
                  absolute left-0 right-0 top-12 
                  bg-white/80 backdrop-blur-xl border border-gray-200/30
                  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                  rounded-2xl z-50 p-2
                ">
                  {suggestions.map((item, i) => (
                    <Link
                      key={i}
                      to={item.path}
                      onClick={() => setSuggestions([])}
                      className="block px-4 py-2 text-gray-800 
                        hover:bg-gray-100/70 rounded-lg transition"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {/* CART ICON */}
            <Link to="/cart" className="relative text-white text-xl">
              🛒
              {cartCount > 0 && (
                <span className="
                  absolute -top-2 -right-2 
                  bg-white text-red-600 text-xs font-bold 
                  rounded-full w-5 h-5 flex items-center justify-center
                ">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER ICON */}
            <Link to="/login" className="text-white text-xl hover:text-white/80">
              👤
            </Link>

            {/* MOBILE MENU */}
            <button
              className="md:hidden text-white text-3xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
