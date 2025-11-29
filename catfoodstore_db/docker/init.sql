-- ===============================
-- ตารางอาหารแมว (ใช้ special_care + age_group ใหม่)
-- ===============================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    weight VARCHAR(50),

    age_group VARCHAR(20)
        CHECK (age_group IN ('newborn', 'kitten', 'adult', 'senior')),

    breed_type VARCHAR[] DEFAULT ARRAY['all'],

    special_care VARCHAR[] DEFAULT ARRAY['all'],   -- ✅ เปลี่ยนกลับมาเป็น special_care

    category VARCHAR(20) 
        CHECK (category IN ('dry', 'wet', 'snack')),

    stock INT DEFAULT 0,
    image_url TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ===============================
-- trigger update updated_at
-- ===============================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();


-- ===============================
-- INSERT DATA (ใช้ special_care)
-- ===============================

INSERT INTO products 
(name, description, price, weight, age_group, breed_type, special_care, category, stock, image_url)
VALUES
('อาหารเม็ดลูกแมวสูตรเสริมภูมิคุ้มกันและการเจริญเติบโต',
 'สูตรเฉพาะสำหรับลูกแมววัยกำลังโต เสริมภูมิคุ้มกัน โปรตีนย่อยง่าย ช่วยระบบย่อยและการเจริญเติบโต',
 289, '400g', 'kitten', ARRAY['all'], ARRAY['all'], 'dry', 60,
 'https://tailybuddy.com/products/344/KITTEN_newpack_01.jpg'),

('อาหารเม็ดลูกแมวพลังงานสูงสำหรับการเติบโตไว',
 'พลังงานสูงเหมาะกับลูกแมวโตไว เสริม DHA และโปรตีนคุณภาพสูง',
 349, '1kg', 'kitten', ARRAY['all'], ARRAY['all'], 'dry', 70,
 'https://kingkongpetshop.com/wp-content/uploads/2024/01/SAVOUR-EXIGENT.jpg'),

('อาหารเม็ดลูกแมวสูตรผิวหนังแข็งแรงและขนเงางาม',
 'โอเมก้า 3 & 6 เสริมผิวหนังสุขภาพดีและขนเงางาม',
 329, '1kg', 'kitten', ARRAY['all'], ARRAY['ผิวหนังและขน'], 'dry', 55,
 'https://tailybuddy.com/products/378/Hair___Skin_Care.jpg'),

('อาหารเม็ดลูกแมวดูแลระบบทางเดินอาหาร',
 'โปรตีนย่อยง่าย พรีไบโอติก ลดปัญหาท้องเสียและระบบย่อยอาหารบอบบาง',
 345, '1kg', 'kitten', ARRAY['all'], ARRAY['ระบบทางเดินอาหาร'], 'dry', 40,
 'https://www.brekz.dk/34089/large_default.jpg'),

('อาหารเปียกลูกแมวเนื้อบดเนื้อนุ่มย่อยง่าย',
 'เนื้อบดละเอียด ย่อยง่าย เหมาะกับลูกแมวกำลังหัดกินอาหาร',
 45, '85g', 'kitten', ARRAY['all'], ARRAY['all'], 'wet', 100,
 'https://www.petz.world/wp-content/uploads/2022/12/Screenshot-from-2025-11-14-11-32-17.png');


INSERT INTO products 
(name, description, price, weight, age_group, breed_type, special_care, category, stock, image_url)
VALUES
('อาหารเม็ดแมวโตลดก้อนขน Hairball',
 'ไฟเบอร์คอมเพล็กซ์ช่วยลดการเกิดก้อนขน เหมาะกับแมวขนยาวหรือเลียขนบ่อย',
 349, '1kg', 'adult', ARRAY['all'], ARRAY['ก้อนขน'], 'dry', 85,
 'https://kingkongpetshop.com/wp-content/uploads/2024/01/HAIRBALL.jpg'),

('อาหารเม็ดแมวโตควบคุมน้ำหนักแคลอรีต่ำ',
 'แคลอรีต่ำแต่โปรตีนสูง รักษามวลกล้ามเนื้อ เหมาะกับแมวควบคุมน้ำหนัก',
 359, '1kg', 'adult', ARRAY['all'], ARRAY['ควบคุมน้ำหนัก'], 'dry', 100,
 'https://thonglorpetshop.com/wp-content/uploads/2020/02/Untitled-design-12-2-1.png'),

('อาหารเปียกแมวโตผสมซอสเกรวี่เนื้อนุ่ม',
 'เนื้อเกรวี่ฉ่ำช่วยเพิ่มความอยากอาหาร เหมาะกับแมวเลือกกิน',
 45, '85g', 'adult', ARRAY['all'], ARRAY['all'], 'wet', 140,
 'https://littlespider.co.th/upload-img/RC_PET/9003579308738.jpg'),

('อาหารเม็ดแมวโตย่อยง่ายสำหรับแมวทำหมัน',
 'โปรตีนย่อยง่าย พรีไบโอติก ลดกลิ่นมูล เหมาะกับแมวทำหมัน',
 359, '1kg', 'adult', ARRAY['all'], ARRAY['ทำหมัน'], 'dry', 75,
 'https://tailybuddy.com/products/365/Sterilised_37.jpg');


INSERT INTO products 
(name, description, price, weight, age_group, breed_type, special_care, category, stock, image_url)
VALUES
('อาหารเม็ดสูตรเฉพาะสำหรับแมวเปอร์เซีย',
 'เม็ดอาหารออกแบบให้เคี้ยวง่ายสำหรับแมวหน้าแบน ลดก้อนขนและเสริมขนเงางาม',
 429, '1.5kg', 'adult', ARRAY['เปอร์เซีย'], ARRAY['ปัญหาก้อนขน'], 'dry', 40,
 'https://img.lazcdn.com/g/p/8c3a23589625fc4be2c2d15e007dac78.jpg_720x720q80.jpg'),

('อาหารเม็ดสูตรสำหรับแมวบริติชช็อตแฮร์',
 'โปรตีนสูงสำหรับแมวโครงสร้างใหญ่ ช่วยเสริมสร้างกล้ามเนื้อ',
 439, '1.5kg', 'adult', ARRAY['บริติชช็อตแฮร์'], ARRAY['all'], 'dry', 50,
 'https://tailybuddy.com/products/9205/BRITISH_SHORTHAIR_KITTEN_02.jpg'),

('อาหารเม็ดแมวสายพันธุ์เมนคูน',
 'พลังงานสูง เสริมข้อต่อและหัวใจ เหมาะกับแมวตัวใหญ่',
 499, '2kg', 'adult', ARRAY['เมนคูน'], ARRAY['all'], 'dry', 30,
 'https://th-test-11.slatic.net/p/1879e104d61655504eba3d343d8003e4.jpg');


-- ===============================
-- ตารางผู้ใช้ (Users)
-- ===============================

CREATE TYPE user_role AS ENUM ('admin', 'customer');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ===============================
-- ตัวอย่างข้อมูลผู้ใช้เริ่มต้น
-- ===============================

INSERT INTO users (email, password, role)
VALUES
('admin@example.com', 'admin123', 'admin'),
('user@example.com', 'user123', 'customer');

