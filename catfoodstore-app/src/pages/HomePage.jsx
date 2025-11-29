import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const breedImages = {
  "เปอร์เซีย": "/catfood/images/per.png",
  "บริติชช็อตแฮร์": "/catfood/images/bri.png",
  "เมนคูน": "/catfood/images/men.png",
};

  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [breedGroups, setBreedGroups] = useState({});

  /* ⭐ โหลดสินค้าจาก API */
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      const items = res.data;

      // ⭐ เรียงสินค้าใหม่สุด → เก่าสุด
      const sorted = [...items].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // ⭐ 7 สินค้าใหม่ล่าสุด (ฐานเริ่มต้น)
      const baseNewArrivals = sorted.slice(0, 7);

      // ⭐ created_at ตัวล่าสุดใน base
      const lastBaseCreatedAt =
        baseNewArrivals.length > 0
          ? new Date(baseNewArrivals[0].created_at)
          : null;

      // ⭐ สินค้าที่ใหม่กว่า base
      const additional =
        lastBaseCreatedAt
          ? sorted.filter((p) => new Date(p.created_at) > lastBaseCreatedAt)
          : [];

      // ⭐ New Arrivals Final
      const finalNewArrivals = [...additional, ...baseNewArrivals];

      // ⭐ ใส่ badge new
      const enhanced = sorted.map((p) => ({
        ...p,
        badge: finalNewArrivals.find((x) => x.id === p.id) ? "new" : null,
      }));

      setProducts(enhanced);

      /* ⭐ GROUP BY BREED */
      const breedsMap = {};
      enhanced.forEach((p) => {
        (p.breed_type || []).forEach((breed) => {
          if (breed === "all") return;
          if (!breedsMap[breed]) breedsMap[breed] = [];
          breedsMap[breed].push(p);
        });
      });

      setBreedGroups(breedsMap);

    } catch (e) {
      console.error("โหลดสินค้าไม่สำเร็จ:", e);
    }
  };

  fetchProducts();
}, []);



  /* 🛒 เพิ่มลงตะกร้า */
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((i) => i.id === product.id);

    if (index >= 0) cart[index].quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    setToast(`เพิ่ม ${product.name} ลงในตะกร้าแล้ว 🛒`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="w-full bg-white">

      {/* HERO */}
      <section
        className="pt-20 pb-28 px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/catfood/images/canin2.jpg')" }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center p-6 rounded-2xl">

          <div>
            <h1 className="text-5xl font-bold text-red-600 leading-tight">
              โภชนาการที่ใช่ สำหรับแมวของคุณ
            </h1>

            <p className="mt-4 text-gray-700 text-lg">
              คัดสรร Royal Canin คุณภาพสูง เพื่อสุขภาพดีในทุกช่วงวัยและทุกสายพันธุ์
            </p>

            <Link
              to="/products"
              className="inline-block mt-6 px-8 py-3 border border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition"
            >
              ดูสินค้าทั้งหมด →
            </Link>
          </div>
        </div>
      </section>

      {/* ⭐ สินค้าใหม่ */}
      <HomeSection
        title="สินค้าใหม่ (New Arrivals)"
        subtitle="เลือกสินค้าที่เพิ่งเข้ามาสำหรับแมวของคุณ"
        link="/products?new=true"
      >
        <HorizontalScroll products={products.slice(0, 5)} addToCart={addToCart} />
      </HomeSection>

      {/* ⭐ สินค้าแนะนำตามสายพันธุ์ */}
      <HomeSection
        title="สินค้าแนะนำตามสายพันธุ์"
        subtitle="โภชนาการเฉพาะสำหรับแต่ละสายพันธุ์เพื่อสุขภาพที่ตรงจุด"
        link="/products"
      >
        {Object.keys(breedGroups).length === 0 ? (
          <p className="text-gray-500">ยังไม่มีสินค้าแยกตามสายพันธุ์</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.keys(breedGroups).map((breed) => (
              <Link
                key={breed}
                to={`/products?breed=${breed}`}   // ⭐ ส่งค่า breed ไปให้หน้า Products
                className="
                  relative h-60 rounded-3xl overflow-hidden shadow-lg
                  hover:shadow-2xl hover:scale-[1.03] transition-transform
                  bg-gray-200
                "
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
backgroundImage: `url('${breedImages[breed] || "/catfood/images/default.png"}')`,
                  }}

                />

<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 text-white drop-shadow-xl">
<h3 className="text-xl font-semibold capitalize tracking-wide drop-shadow">{breed}</h3>
                  <p className="text-sm opacity-90">ดูสินค้า →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </HomeSection>

      {/* Toast */}
      {toast && (
        <div className="
          fixed bottom-6 left-1/2 -translate-x-1/2 
          bg-black/80 text-white px-5 py-3 rounded-xl shadow-lg z-50
        ">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   PREMIUM SECTION HEADER
---------------------------------------- */
function HomeSection({ title, subtitle, link, children }) {
  return (
    <section className="max-w-7xl mx-auto py-20 px-6">

      {/* HEADER */}
      <div className="mb-10">
        <div className="flex justify-between items-end">
          <div> 
<h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>

            {subtitle && (
<p className="text-gray-500 text-base mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {link && (
            <Link
              to={link}
className="text-red-600 text-base font-medium hover:text-red-700 transition"
            >
              ดูทั้งหมด →
            </Link>
          )}
        </div>

<div className="mt-3 h-[2px] w-16 bg-red-500 rounded-full"></div>
      </div>

      {children}
    </section>
  );
}

/* ----------------------------------------
   Horizontal Scroll + Arrows
---------------------------------------- */
function HorizontalScroll({ products, addToCart }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative group">

      {/* ⭐ Minimal Arrow Left */}
      <button
        onClick={() => scroll("left")}
        className="
          absolute left-3 top-1/2 -translate-y-1/2
          bg-white/80 backdrop-blur-md text-gray-700
          p-2 rounded-full shadow
          opacity-0 group-hover:opacity-100
          hover:bg-red-50 transition
          z-20
        "
      >
        ←
      </button>

      {/* ⭐ Minimal Arrow Right */}
      <button
        onClick={() => scroll("right")}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          bg-white/90 backdrop-blur-sm text-gray-700
          p-2 rounded-full shadow
          opacity-0 group-hover:opacity-100
          hover:bg-red-50 transition
          z-20
        "
      >
        →
      </button>

      {/* ⭐ Scrollable product list */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-3 scroll-smooth no-scrollbar"
      >
        {products.map((p) => (
          <div key={p.id} className="w-[240px] flex-shrink-0">
            <PremiumProductCard product={p} addToCart={addToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}


/* ----------------------------------------
   PRODUCT CARD
---------------------------------------- */
function PremiumProductCard({ product, addToCart }) {
  return (
    <div
      className="
        bg-white border rounded-2xl shadow-sm 
        hover:shadow-xl transition overflow-hidden
        h-full flex flex-col
      "
    >
      <Link to={`/products/${product.id}`}>
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={product.image_url}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            alt={product.name}
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">

        {/* ⭐ ชื่อ + น้ำหนัก ระยะห่างกำลังดี อ่านง่าย */}
<h3 className="font-semibold text-base text-gray-900 leading-snug mt-3 mb-2">
          {product.name}{" "}
          <span className="font-semibold text-gray-900">
            {product.weight}
          </span>
        </h3>

        {/* ราคา */}
<p className="text-red-600 font-bold text-lg mb-4">
          {product.price} ฿
        </p>

        {/* ปุ่ม */}
        <button
          onClick={() => addToCart(product)}
          className="
            mt-auto w-full py-2 bg-red-600 text-white 
            rounded-lg font-semibold shadow 
            hover:bg-red-700 hover:shadow-lg transition
          "
        >
          🛒 เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  );
}
