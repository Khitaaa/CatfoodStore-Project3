import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ProductListPage() {
  const [filters, setFilters] = useState({
    type: "",
    age: [],
    health: [],
    breed: [],
  });

  const [sortBy, setSortBy] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [toast, setToast] = useState(null);

  /* COLLAPSE STATES */
  const [openAge, setOpenAge] = useState(true);
  const [openHealth, setOpenHealth] = useState(true);
  const [openBreed, setOpenBreed] = useState(true);

  /* ===================== LOAD PRODUCTS ===================== */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/products");
        const items = res.data.map((p) => ({
          ...p,
          health: p.health || [],
        }));
        setAllProducts(items);
        setFiltered(items);
      } catch (e) {
        console.error("Load failed", e);
      }
    };
    load();
  }, []);

  /* ===================== ADD TO CART ===================== */
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = cart.findIndex((i) => i.id === product.id);

    if (idx >= 0) cart[idx].quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    setToast(`${product.name} ถูกเพิ่มลงตะกร้าแล้ว 🛒`);
    setTimeout(() => setToast(null), 2000);
  };

  /* ===================== CHECKBOX TOGGLE ===================== */
  const toggleCheckbox = (group, value) => {
    setFilters((prev) => {
      const set = new Set(prev[group]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [group]: [...set] };
    });
  };

  /* ===================== FILTER LOGIC ===================== */
  useEffect(() => {
    let result = allProducts;

    if (filters.type) result = result.filter((p) => p.category === filters.type);

    if (filters.age.length)
      result = result.filter((p) => filters.age.includes(p.age_group));

    if (filters.health.length)
      result = result.filter((p) =>
        p.health.some((h) => filters.health.includes(h.toLowerCase()))
      );

    if (filters.breed.length)
      result = result.filter((p) =>
        p.breed_type.some((b) => filters.breed.includes(b))
      );

    if (sortBy === "price_asc")
      result = [...result].sort((a, b) => a.price - b.price);

    if (sortBy === "price_desc")
      result = [...result].sort((a, b) => b.price - a.price);

    if (sortBy === "newest")
      result = [...result].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

    setFiltered(result);
  }, [filters, allProducts, sortBy]);

  const resetFilters = () =>
    setFilters({ type: "", age: [], health: [], breed: [] });

  /* ===================== UI ===================== */

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* TOP BAR — CATEGORY + COUNT + SORT (same row) */}
{/* PAGE TITLE */}
<h1 className="text-3xl font-bold text-gray-900 mb-6">
  {filters.type === "" && "สินค้าทั้งหมด"}
  {filters.type === "dry" && "อาหารเม็ดสำหรับแมว"}
  {filters.type === "wet" && "อาหารเปียกสำหรับแมว"}
  {filters.type === "snack" && "ขนมสำหรับแมว"}
</h1>

{/* SUBTITLE ABOVE CATEGORY */}
<p className="text-lg font-medium text-gray-700 mb-3">
  เลือกหมวดหมู่สินค้า
</p>

{/* CATEGORY + COUNT + SORT */}
<div className="flex flex-wrap justify-between items-center gap-4 mb-8">

        {/* LEFT — CATEGORY */}
        <div className="flex gap-4 flex-wrap">
          {[
            { label: "ทั้งหมด", value: "" },
            { label: "อาหารเม็ด", value: "dry" },
            { label: "อาหารเปียก", value: "wet" },
            { label: "ขนมแมว", value: "snack" },
          ].map((c) => (
            <button
              key={c.value}
              onClick={() => setFilters((prev) => ({ ...prev, type: c.value }))}
              className={`
                px-8 py-3 rounded-full text-lg font-semibold transition
                ${
                  filters.type === c.value
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* RIGHT — COUNT + SORT */}
        <div className="flex items-center gap-4">
          <p className="text-gray-600 font-medium whitespace-nowrap">
            พบ {filtered.length} รายการ
          </p>
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LEFT SIDEBAR — FILTERS */}
        <aside className="md:col-span-1 bg-white border rounded-xl shadow-sm p-6 h-fit">

          {/* FILTER HEADER */}
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">ตัวกรองสินค้า</h2>
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 hover:underline"
            >
              ล้างทั้งหมด
            </button>
          </div>

          <div className="border-b my-4"></div>

          {/* AGE */}
          <Collapse title="ช่วงวัยแมว" open={openAge} setOpen={setOpenAge}>
            <FilterGroup
              items={[
                { label: "ลูกแมว", value: "kitten" },
                { label: "แมวโต", value: "adult" },
                { label: "สูตรดูแลพิเศษ", value: "special_care" },
              ]}
              selected={filters.age}
              toggle={(v) => toggleCheckbox("age", v)}
            />
          </Collapse>

          <div className="border-b my-4"></div>

          {/* HEALTH */}
          <Collapse title="สุขภาพเฉพาะทาง" open={openHealth} setOpen={setOpenHealth}>
            <FilterGroup
              items={[
                { label: "Urinary", value: "urinary" },
                { label: "Hairball", value: "hairball" },
                { label: "ควบคุมน้ำหนัก", value: "weight" },
              ]}
              selected={filters.health}
              toggle={(v) => toggleCheckbox("health", v)}
            />
          </Collapse>

          <div className="border-b my-4"></div>

          {/* BREED */}
          <Collapse title="สายพันธุ์แมว" open={openBreed} setOpen={setOpenBreed}>
            <FilterGroup
              items={[
                { label: "เปอร์เซีย", value: "เปอร์เซีย" },
                { label: "บริติชช็อตแฮร์", value: "บริติชช็อตแฮร์" },
              ]}
              selected={filters.breed}
              toggle={(v) => toggleCheckbox("breed", v)}
            />
          </Collapse>

        </aside>

        {/* RIGHT — PRODUCT LIST */}
        <main className="md:col-span-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <ProductCard key={item.id} product={item} addToCart={addToCart} />
            ))}
          </div>
        </main>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-5 py-3 rounded-xl shadow z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ===================== COLLAPSE ===================== */
function Collapse({ title, open, setOpen, children }) {
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full pb-2"
      >
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <span className="text-gray-500 text-xl mx-auto">
          {open ? "﹀" : "〉"}
        </span>
      </button>
      {open && <div className="pl-1 pt-2">{children}</div>}
    </div>
  );
}

/* ===================== SORT DROPDOWN ===================== */
function SortDropdown({ sortBy, setSortBy }) {
  return (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-2 pr-8 rounded-lg border shadow-sm bg-white appearance-none text-gray-700 font-medium"
      >
        <option value="">จัดเรียงสินค้า</option>
        <option value="price_asc">ราคาน้อย → มาก</option>
        <option value="price_desc">ราคามาก → น้อย</option>
        <option value="newest">ใหม่ล่าสุด</option>
      </select>
      <span className="absolute right-2 top-2.5 text-gray-500">▼</span>
    </div>
  );
}

/* ===================== FILTER GROUP ===================== */
function FilterGroup({ items, selected, toggle }) {
  return (
    <div className="space-y-2">
      {items.map((o) => (
        <label key={o.value} className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selected.includes(o.value)}
            onChange={() => toggle(o.value)}
            className="w-5 h-5 text-red-600"
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

/* ===================== PRODUCT CARD ===================== */
function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white border rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-52 object-cover rounded-xl"
        />
      </Link>

      <h3 className="font-semibold text-lg mt-3 min-h-[50px]">
        {product.name}
      </h3>

      <p className="text-red-600 font-bold mb-4">{product.price} ฿</p>

      <button
        onClick={() => addToCart(product)}
        className="mt-auto w-full py-2.5 bg-red-600 text-white rounded-xl font-semibold shadow hover:shadow-lg active:scale-[0.97]"
      >
        🛒 เพิ่มลงตะกร้า
      </button>
    </div>
  );
}
