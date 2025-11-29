import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [breedGroups, setBreedGroups] = useState({});

  /* ⭐ โหลดสินค้าจาก API */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        const items = res.data;

        // ⭐ mark badge ว่าสินค้าใหม่
        const enhanced = items.map((p, index) => ({
          ...p,
          badge: index < 5 ? "new" : null,
        }));

        setProducts(enhanced);

        /* ⭐ GROUP BY BREED */
        const breedsMap = {};
        enhanced.forEach((p) => {
          (p.breed_type || []).forEach((breed) => {
            if (breed === "all") return; // ตัด ‘all’
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
                    backgroundImage: `url('/catfood/breeds/${breed}.jpg')`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 text-white drop-shadow-xl">
                  <h3 className="text-2xl font-bold capitalize">{breed}</h3>
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
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h2>

            {subtitle && (
              <p className="text-gray-500 text-lg mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {link && (
            <Link
              to={link}
              className="text-red-600 font-semibold hover:underline text-lg"
            >
              ดูทั้งหมด →
            </Link>
          )}
        </div>

        <div className="mt-4 h-[3px] w-20 bg-red-600 rounded-full"></div>
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

      <button
        onClick={() => scroll("left")}
        className="
          absolute left-2 top-1/2 -translate-y-1/2 
          bg-white shadow-lg 
          p-3 rounded-full z-10 hover:bg-red-100 transition
          opacity-0 group-hover:opacity-100
        "
      >
        ◀
      </button>

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

      <button
        onClick={() => scroll("right")}
        className="
          absolute right-2 top-1/2 -translate-y-1/2 
          bg-white shadow-lg 
          p-3 rounded-full z-10 hover:bg-red-100 transition
          opacity-0 group-hover:opacity-100
        "
      >
        ▶
      </button>
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
        {/* ชื่อสินค้า สูงเท่ากันทุกใบ */}
        <h3 className="font-semibold text-lg leading-snug min-h-[60px]">
          {product.name}
        </h3>

        <p className="text-red-600 font-bold mb-3">{product.price} ฿</p>

        {/* ดันปุ่มลงล่าง */}
        <button
          onClick={() => addToCart(product)}
          className="mt-auto w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          🛒 เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  );
}

