import { TableDefinition, ErdRelation, PrebuiltQuery } from '../types/database';

export const TARGET_WEBSITE = {
  url: 'https://www-projectku.github.io/Tugas-CP/',
  repoUrl: 'https://github.com/www-projectku/Tugas-CP',
  type: 'Static Web Application (GitHub Pages)',
  topic: 'Company Profile & Layanan Digital (Tugas-CP)',
  lastAudited: 'November 2026',
  auditStatus: 'Identified: Static Hosting Without Database Backend',
};

export const TABLES: TableDefinition[] = [
  {
    id: 'companies',
    name: 'companies',
    displayName: 'Profil Perusahaan (Company Info)',
    description: 'Menyimpan identitas utama perusahaan: visi, misi, deskripsi profil, alamat kantor, kontak resmi, dan tautan media sosial.',
    category: 'core',
    badgeColor: 'blue',
    sampleRowsCount: 1,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: '1', description: 'Kunci primer identifikasi unik perusahaan', normalizationRole: '1NF: Atomic primary key' },
      { name: 'name', type: 'VARCHAR(150)', keyType: 'NONE', nullable: false, description: 'Nama resmi perusahaan / organisasi' },
      { name: 'tagline', type: 'VARCHAR(255)', keyType: 'NONE', nullable: true, description: 'Slogan atau motto utama perusahaan' },
      { name: 'about_text', type: 'TEXT', keyType: 'NONE', nullable: false, description: 'Deskripsi lengkap profil "Tentang Kami"' },
      { name: 'vision', type: 'TEXT', keyType: 'NONE', nullable: true, description: 'Pernyataan visi jangka panjang' },
      { name: 'mission', type: 'TEXT', keyType: 'NONE', nullable: true, description: 'Butir-butir misi pencapaian target' },
      { name: 'logo_url', type: 'VARCHAR(255)', keyType: 'NONE', nullable: true, description: 'URL / path aset logo perusahaan' },
      { name: 'email', type: 'VARCHAR(100)', keyType: 'NONE', nullable: false, description: 'Alamat email publik resmi' },
      { name: 'phone', type: 'VARCHAR(30)', keyType: 'NONE', nullable: false, description: 'Nomor telepon kantor / seluler' },
      { name: 'whatsapp', type: 'VARCHAR(30)', keyType: 'NONE', nullable: true, description: 'Nomor WhatsApp untuk CTA / konsultasi cepat' },
      { name: 'address', type: 'TEXT', keyType: 'NONE', nullable: false, description: 'Alamat fisik kantor operasional' },
      { name: 'updated_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu pembaruan informasi profil' },
    ],
  },
  {
    id: 'categories',
    name: 'categories',
    displayName: 'Kategori Layanan (Categories)',
    description: 'Klasifikasi layanan atau portofolio untuk menghindari redundansi teks nama kategori (Menerapkan Normalisasi 2NF & 3NF).',
    category: 'catalog',
    badgeColor: 'emerald',
    sampleRowsCount: 4,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer unik kategori', normalizationRole: '1NF: Primary key atomik' },
      { name: 'name', type: 'VARCHAR(80)', keyType: 'UNIQUE', nullable: false, description: 'Nama kategori layanan (cth: Web Dev, Mobile App, UI/UX)', normalizationRole: '2NF: Menghilangkan redundansi kategori' },
      { name: 'slug', type: 'VARCHAR(100)', keyType: 'UNIQUE', nullable: false, description: 'Slug URL-friendly untuk navigasi & SEO' },
      { name: 'icon_name', type: 'VARCHAR(50)', keyType: 'NONE', nullable: true, defaultValue: "'layers'", description: 'Nama ikon Lucide / FontAwesome' },
      { name: 'created_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Tanggal pembuatan record kategori' },
    ],
  },
  {
    id: 'services',
    name: 'services',
    displayName: 'Layanan & Portofolio (Services & Portfolio)',
    description: 'Menyimpan daftar layanan atau portofolio karya yang ditawarkan perusahaan, terkait langsung ke tabel kategori melalui relasi Foreign Key.',
    category: 'catalog',
    badgeColor: 'emerald',
    sampleRowsCount: 6,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer unik layanan' },
      { name: 'category_id', type: 'INT', keyType: 'FK', nullable: false, references: { table: 'categories', column: 'id' }, description: 'Relasi ke tabel categories (Foreign Key)', normalizationRole: '3NF: Menjamin integritas referensial dan tanpa dependensi transitif' },
      { name: 'title', type: 'VARCHAR(150)', keyType: 'NONE', nullable: false, description: 'Judul layanan atau nama proyek' },
      { name: 'slug', type: 'VARCHAR(180)', keyType: 'UNIQUE', nullable: false, description: 'URL permalink ramah mesin pencari' },
      { name: 'short_desc', type: 'VARCHAR(255)', keyType: 'NONE', nullable: false, description: 'Ringkasan singkat untuk card di landing page' },
      { name: 'full_desc', type: 'TEXT', keyType: 'NONE', nullable: true, description: 'Penjelasan mendalam spesifikasi & fitur' },
      { name: 'price_estimate', type: 'DECIMAL(12,2)', keyType: 'NONE', nullable: true, description: 'Estimasi harga mulai dari (dalam Rupiah)' },
      { name: 'thumbnail_url', type: 'VARCHAR(255)', keyType: 'NONE', nullable: true, description: 'Path gambar showcase / cover' },
      { name: 'is_featured', type: 'BOOLEAN', keyType: 'INDEX', nullable: false, defaultValue: 'FALSE', description: 'Tampilkan di section layanan unggulan beranda' },
      { name: 'is_active', type: 'BOOLEAN', keyType: 'INDEX', nullable: false, defaultValue: 'TRUE', description: 'Status visibilitas publik' },
      { name: 'created_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu penambahan entri' },
    ],
  },
  {
    id: 'testimonials',
    name: 'testimonials',
    displayName: 'Ulasan & Klien (Testimonials & Clients)',
    description: 'Bukti sosial (social proof) dari klien, rating kepuasan bintang 1-5, nama institusi, dan testimoni untuk meningkatkan kredibilitas.',
    category: 'interaction',
    badgeColor: 'amber',
    sampleRowsCount: 3,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer unik ulasan' },
      { name: 'service_id', type: 'INT', keyType: 'FK', nullable: true, references: { table: 'services', column: 'id' }, description: 'Layanan spesifik yang diulas (Opsional/Null)', normalizationRole: 'Relasi opsional ke services' },
      { name: 'client_name', type: 'VARCHAR(100)', keyType: 'NONE', nullable: false, description: 'Nama lengkap perwakilan klien' },
      { name: 'client_company', type: 'VARCHAR(120)', keyType: 'NONE', nullable: true, description: 'Nama organisasi/perusahaan klien' },
      { name: 'client_role', type: 'VARCHAR(80)', keyType: 'NONE', nullable: true, description: 'Jabatan (cth: CEO, Marketing Manager)' },
      { name: 'rating', type: 'TINYINT', keyType: 'NONE', nullable: false, defaultValue: '5', description: 'Skor kepuasan (1 sampai 5 bintang)' },
      { name: 'testimonial_text', type: 'TEXT', keyType: 'NONE', nullable: false, description: 'Isi teks testimonial atau kutipan ulasan' },
      { name: 'avatar_url', type: 'VARCHAR(255)', keyType: 'NONE', nullable: true, description: 'Foto profil klien' },
      { name: 'is_approved', type: 'BOOLEAN', keyType: 'INDEX', nullable: false, defaultValue: 'TRUE', description: 'Status moderasi publikasi oleh admin' },
      { name: 'created_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu ulasan dibuat' },
    ],
  },
  {
    id: 'contact_messages',
    name: 'contact_messages',
    displayName: 'Pesan Masuk / Form Kontak (Contact Inquiries)',
    description: 'Pusat penyimpanan interaksi formulir kontak "Hubungi Kami" dari pengunjung website Tugas-CP, menggantikan form statis tanpa database.',
    category: 'interaction',
    badgeColor: 'violet',
    sampleRowsCount: 5,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer unik tiket pesan' },
      { name: 'sender_name', type: 'VARCHAR(100)', keyType: 'NONE', nullable: false, description: 'Nama lengkap pengirim pesan' },
      { name: 'sender_email', type: 'VARCHAR(120)', keyType: 'INDEX', nullable: false, description: 'Email pengirim untuk balasan respon' },
      { name: 'sender_phone', type: 'VARCHAR(30)', keyType: 'NONE', nullable: true, description: 'Nomor telepon / WhatsApp pengirim' },
      { name: 'subject', type: 'VARCHAR(200)', keyType: 'NONE', nullable: false, description: 'Subjek / perihal pesan atau penawaran' },
      { name: 'message', type: 'TEXT', keyType: 'NONE', nullable: false, description: 'Isi pesan lengkap dari formulir kontak' },
      { name: 'status', type: "ENUM('unread', 'read', 'replied', 'archived')", keyType: 'INDEX', nullable: false, defaultValue: "'unread'", description: 'Status tindak lanjut oleh tim perusahaan' },
      { name: 'ip_address', type: 'VARCHAR(45)', keyType: 'NONE', nullable: true, description: 'Alamat IP untuk pencegahan spam / rate-limiting' },
      { name: 'created_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu pengiriman pesan' },
    ],
  },
  {
    id: 'admin_users',
    name: 'admin_users',
    displayName: 'Pengguna & Hak Akses (Admin & RBAC)',
    description: 'Mengamankan hak akses back-office untuk mengelola konten company profile, memperbarui layanan, dan membalas pesan kontak masuk.',
    category: 'auth',
    badgeColor: 'rose',
    sampleRowsCount: 2,
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT)', keyType: 'PK', nullable: false, defaultValue: 'Generated', description: 'Kunci primer akun administrator' },
      { name: 'username', type: 'VARCHAR(50)', keyType: 'UNIQUE', nullable: false, description: 'Username login unik' },
      { name: 'email', type: 'VARCHAR(100)', keyType: 'UNIQUE', nullable: false, description: 'Email terdaftar untuk verifikasi akun' },
      { name: 'password_hash', type: 'VARCHAR(255)', keyType: 'NONE', nullable: false, description: 'Hash kata sandi terenkripsi (Bcrypt / Argon2)' },
      { name: 'role', type: "ENUM('superadmin', 'editor', 'staff')", keyType: 'NONE', nullable: false, defaultValue: "'editor'", description: 'Level otorisasi peran (RBAC)' },
      { name: 'full_name', type: 'VARCHAR(100)', keyType: 'NONE', nullable: false, description: 'Nama lengkap pengelola sistem' },
      { name: 'is_active', type: 'BOOLEAN', keyType: 'NONE', nullable: false, defaultValue: 'TRUE', description: 'Status keaktifan akun admin' },
      { name: 'last_login_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: true, description: 'Catatan waktu autentikasi terakhir' },
      { name: 'created_at', type: 'TIMESTAMP', keyType: 'NONE', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu registrasi akun' },
    ],
  },
];

export const RELATIONS: ErdRelation[] = [
  {
    id: 'rel_cat_serv',
    fromTable: 'categories',
    fromColumn: 'id',
    toTable: 'services',
    toColumn: 'category_id',
    cardinality: '1:N',
    label: '1 Kategori memiliki banyak Layanan (1 : N)',
  },
  {
    id: 'rel_serv_testi',
    fromTable: 'services',
    fromColumn: 'id',
    toTable: 'testimonials',
    toColumn: 'service_id',
    cardinality: '1:N',
    label: '1 Layanan dapat memiliki ulasan (1 : N, Opsional)',
  },
];

export const MYSQL_DDL = `-- ==========================================================
-- SKEMA DATABASE TUGAS-CP (COMPANY PROFILE)
-- Dialek: MySQL / MariaDB (Cocok untuk XAMPP & phpMyAdmin)
-- Karakteristik: Normalisasi 3NF, Foreign Key Constraints, UTF8MB4
-- ==========================================================

CREATE DATABASE IF NOT EXISTS tugas_cp_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tugas_cp_db;

-- 1. TABEL PROFIL PERUSAHAAN
CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  tagline VARCHAR(255) NULL,
  about_text TEXT NOT NULL,
  vision TEXT NULL,
  mission TEXT NULL,
  logo_url VARCHAR(255) NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  whatsapp VARCHAR(30) NULL,
  address TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABEL KATEGORI LAYANAN (Normalisasi 2NF/3NF)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon_name VARCHAR(50) DEFAULT 'layers',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. TABEL LAYANAN & PORTOFOLIO (Relasi Foreign Key ke categories)
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  short_desc VARCHAR(255) NOT NULL,
  full_desc TEXT NULL,
  price_estimate DECIMAL(12,2) NULL,
  thumbnail_url VARCHAR(255) NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_services_category 
    FOREIGN KEY (category_id) REFERENCES categories (id) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_services_featured (is_featured),
  INDEX idx_services_active (is_active)
) ENGINE=InnoDB;

-- 4. TABEL TESTIMONI & ULASAN KLIEN
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NULL,
  client_name VARCHAR(100) NOT NULL,
  client_company VARCHAR(120) NULL,
  client_role VARCHAR(80) NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  testimonial_text TEXT NOT NULL,
  avatar_url VARCHAR(255) NULL,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_testimonials_service 
    FOREIGN KEY (service_id) REFERENCES services (id) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_testimonials_approved (is_approved)
) ENGINE=InnoDB;

-- 5. TABEL FORMULIR KONTAK MASUK (Inbox Feedback)
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_name VARCHAR(100) NOT NULL,
  sender_email VARCHAR(120) NOT NULL,
  sender_phone VARCHAR(30) NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied', 'archived') NOT NULL DEFAULT 'unread',
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_status (status),
  INDEX idx_contact_email (sender_email)
) ENGINE=InnoDB;

-- 6. TABEL ADMINISTRATOR & RBAC
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'editor', 'staff') NOT NULL DEFAULT 'editor',
  full_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
`;

export const POSTGRES_DDL = `-- ==========================================================
-- SKEMA DATABASE TUGAS-CP (COMPANY PROFILE)
-- Dialek: PostgreSQL (Cocok untuk Supabase, Neon, Cloud SQL)
-- Karakteristik: UUID/Serial, Timestamptz, Check Constraints
-- ==========================================================

-- ENUM TYPES
CREATE TYPE message_status_enum AS ENUM ('unread', 'read', 'replied', 'archived');
CREATE TYPE user_role_enum AS ENUM ('superadmin', 'editor', 'staff');

-- 1. COMPANIES
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  tagline VARCHAR(255),
  about_text TEXT NOT NULL,
  vision TEXT,
  mission TEXT,
  logo_url VARCHAR(255),
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  whatsapp VARCHAR(30),
  address TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon_name VARCHAR(50) DEFAULT 'layers',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  short_desc VARCHAR(255) NOT NULL,
  full_desc TEXT,
  price_estimate NUMERIC(12,2),
  thumbnail_url VARCHAR(255),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_featured ON services(is_featured) WHERE is_featured = TRUE;

-- 4. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  service_id INT REFERENCES services(id) ON DELETE SET NULL ON UPDATE CASCADE,
  client_name VARCHAR(100) NOT NULL,
  client_company VARCHAR(120),
  client_role VARCHAR(80),
  rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  testimonial_text TEXT NOT NULL,
  avatar_url VARCHAR(255),
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  sender_name VARCHAR(100) NOT NULL,
  sender_email VARCHAR(120) NOT NULL,
  sender_phone VARCHAR(30),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status message_status_enum NOT NULL DEFAULT 'unread',
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);

-- 6. ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'editor',
  full_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

export const PRISMA_SCHEMA = `// ==========================================================
// PRISMA ORM SCHEMA (schema.prisma) - TUGAS-CP
// Digunakan pada Next.js / Express / Fastify
// ==========================================================

datasource db {
  provider = "postgresql" // atau "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Company {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(150)
  tagline     String?  @db.VarChar(255)
  aboutText   String   @map("about_text") @db.Text
  vision      String?  @db.Text
  mission     String?  @db.Text
  logoUrl     String?  @map("logo_url")
  email       String   @db.VarChar(100)
  phone       String   @db.VarChar(30)
  whatsapp    String?  @db.VarChar(30)
  address     String   @db.Text
  updatedAt   DateTime @default(now()) @updatedAt @map("updated_at")

  @@map("companies")
}

model Category {
  id        Int       @id @default(autoincrement())
  name      String    @unique @db.VarChar(80)
  slug      String    @unique @db.VarChar(100)
  iconName  String?   @default("layers") @map("icon_name")
  createdAt DateTime  @default(now()) @map("created_at")
  services  Service[]

  @@map("categories")
}

model Service {
  id            Int           @id @default(autoincrement())
  categoryId    Int           @map("category_id")
  category      Category      @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  title         String        @db.VarChar(150)
  slug          String        @unique @db.VarChar(180)
  shortDesc     String        @map("short_desc") @db.VarChar(255)
  fullDesc      String?       @map("full_desc") @db.Text
  priceEstimate Decimal?      @map("price_estimate") @db.Decimal(12, 2)
  thumbnailUrl  String?       @map("thumbnail_url")
  isFeatured    Boolean       @default(false) @map("is_featured")
  isActive      Boolean       @default(true) @map("is_active")
  createdAt     DateTime      @default(now()) @map("created_at")
  testimonials  Testimonial[]

  @@map("services")
}

model Testimonial {
  id              Int      @id @default(autoincrement())
  serviceId       Int?     @map("service_id")
  service         Service? @relation(fields: [serviceId], references: [id], onDelete: SetNull)
  clientName      String   @map("client_name") @db.VarChar(100)
  clientCompany   String?  @map("client_company") @db.VarChar(120)
  clientRole      String?  @map("client_role") @db.VarChar(80)
  rating          Int      @default(5)
  testimonialText String   @map("testimonial_text") @db.Text
  avatarUrl       String?  @map("avatar_url")
  isApproved      Boolean  @default(true) @map("is_approved")
  createdAt       DateTime @default(now()) @map("created_at")

  @@map("testimonials")
}

enum MessageStatus {
  unread
  read
  replied
  archived
}

model ContactMessage {
  id          Int           @id @default(autoincrement())
  senderName  String        @map("sender_name") @db.VarChar(100)
  senderEmail String        @map("sender_email") @db.VarChar(120)
  senderPhone String?       @map("sender_phone") @db.VarChar(30)
  subject     String        @db.VarChar(200)
  message     String        @db.Text
  status      MessageStatus @default(unread)
  ipAddress   String?       @map("ip_address")
  createdAt   DateTime      @default(now()) @map("created_at")

  @@map("contact_messages")
}

enum Role {
  superadmin
  editor
  staff
}

model AdminUser {
  id           Int       @id @default(autoincrement())
  username     String    @unique @db.VarChar(50)
  email        String    @unique @db.VarChar(100)
  passwordHash String    @map("password_hash")
  role         Role      @default(editor)
  fullName     String    @map("full_name") @db.VarChar(100)
  isActive     Boolean   @default(true) @map("is_active")
  lastLoginAt  DateTime? @map("last_login_at")
  createdAt    DateTime  @default(now()) @map("created_at")

  @@map("admin_users")
}
`;

export const FIREBASE_SCHEMA = `// ==========================================================
// FIREBASE FIRESTORE NoSQL STRUCTURE & RULES (TUGAS-CP)
// Solusi paling ideal untuk website di GitHub Pages karena
// bisa langsung diakses dari browser dengan Firebase JS SDK!
// ==========================================================

/*
STRUKTUR KOLEKSI FIRESTORE (JSON Hierarchy):

1. /company/profile (Document tunggal)
   {
     "name": "Nusantara Digital Solution",
     "tagline": "Solusi Transformasi Digital & Kreatif Terpercaya",
     "aboutText": "Kami adalah agensi teknologi...",
     "vision": "Menjadi mitra terdepan industri kreatif nasional",
     "mission": ["Menghadirkan produk berkualitas", "Memberdayakan talenta digital"],
     "email": "kontak@nusantaradigital.id",
     "phone": "+62 812-3456-7890",
     "whatsapp": "+6281234567890",
     "address": "Jl. Sudirman Kav. 24, Jakarta Selatan",
     "updatedAt": timestamp
   }

2. /categories/{categoryId}
   {
     "name": "Web Development",
     "slug": "web-development",
     "icon": "globe",
     "createdAt": timestamp
   }

3. /services/{serviceId}
   {
     "categoryId": "cat_web_01",
     "categoryName": "Web Development",
     "title": "Pembuatan Website Company Profile",
     "slug": "website-company-profile",
     "shortDesc": "Website elegan, SEO friendly, dan mobile responsive",
     "priceEstimate": 2500000,
     "isFeatured": true,
     "isActive": true
   }

4. /testimonials/{testimonialId}
   {
     "clientName": "Budi Santoso",
     "clientCompany": "PT Cahaya Abadi",
     "clientRole": "Marketing Director",
     "rating": 5,
     "quote": "Pengerjaan website sangat rapi dan tepat waktu!",
     "isApproved": true,
     "createdAt": timestamp
   }

5. /contact_messages/{messageId} (Pengunjung bisa menulis tanpa login)
   {
     "senderName": "Rina Marlina",
     "senderEmail": "rina@gmail.com",
     "senderPhone": "081298765432",
     "subject": "Permintaan Penawaran Website Kantor",
     "message": "Halo tim, saya ingin berkonsultasi mengenai paket company profile...",
     "status": "unread",
     "createdAt": timestamp
   }
*/

// FIRESTORE SECURITY RULES (firestore.rules)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Publik bisa membaca profil perusahaan, admin bisa mengubah
    match /company/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Layanan dan Kategori bisa dibaca publik
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    match /services/{serviceId} {
      allow read: if resource.data.isActive == true || (request.auth != null && request.auth.token.role == 'admin');
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Testimonial yang disetujui bisa dibaca publik
    match /testimonials/{testiId} {
      allow read: if resource.data.isApproved == true || (request.auth != null && request.auth.token.role == 'admin');
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Siapa saja bisa mengirim pesan formulir kontak!
    // Hanya admin yang bisa membaca dan mengupdate status pesan
    match /contact_messages/{messageId} {
      allow create: if request.resource.data.senderName is string
                    && request.resource.data.senderEmail is string
                    && request.resource.data.message.size() >= 10;
      allow read, update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
`;

export const SEED_DATA_SQL = `-- ==========================================================
-- DUMMY SEED DATA UNTUK TUGAS-CP (COMPANY PROFILE)
-- Data realistis berbahasa Indonesia untuk pengujian langsung
-- ==========================================================

-- 1. Data Profil Perusahaan
INSERT INTO companies (name, tagline, about_text, vision, mission, logo_url, email, phone, whatsapp, address) 
VALUES (
  'Nusantara Creative Studio',
  'Mewujudkan Identitas Digital Perusahaan Modern & Inovatif',
  'Nusantara Creative Studio adalah agensi kreatif dan pengembangan web yang berfokus membantu UMKM, startup, dan korporasi membangun kehadiran digital yang profesional dan berdampak tinggi.',
  'Menjadi agensi solusi digital terdepan di Indonesia yang menginspirasi pertumbuhan bisnis berbasis teknologi.',
  '1. Menyajikan solusi pembuatan website yang cepat, aman, dan memikat.\\n2. Memberikan layanan konsultasi desain dan identitas merek kelas dunia.\\n3. Mendukung digitalisasi bisnis lokal Indonesia.',
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300',
  'halo@nusantaracreative.id',
  '+62 21 8976 5432',
  '6281234567890',
  'Gedung Cyber Tower Lt. 5, Jl. Rasuna Said, Jakarta Selatan 12950'
);

-- 2. Data Kategori Layanan
INSERT INTO categories (id, name, slug, icon_name) VALUES
(1, 'Web Development', 'web-development', 'globe'),
(2, 'UI/UX Design', 'ui-ux-design', 'layout'),
(3, 'Branding & Identitas', 'branding-identitas', 'sparkles'),
(4, 'SEO & Digital Marketing', 'seo-digital-marketing', 'trending-up');

-- 3. Data Layanan & Portofolio
INSERT INTO services (category_id, title, slug, short_desc, full_desc, price_estimate, thumbnail_url, is_featured, is_active) VALUES
(1, 'Website Company Profile Eksklusif', 'website-company-profile', 'Website profil perusahaan responsif lengkap dengan katalog layanan, galeri, formulir kontak, dan integrasi WhatsApp.', 'Paket lengkap pembuatan website profil perusahaan modern menggunakan HTML5/React, desain ramah mobile, SEO on-page optimal, dan panel admin konten mandiri.', 2500000.00, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', TRUE, TRUE),
(1, 'Landing Page Produk & Promosi', 'landing-page-produk', 'Landing page berkecepatan tinggi dengan konversi tinggi untuk peluncuran produk atau campaign iklan.', 'Halaman arahan satu halaman terfokus dengan Call-to-Action (CTA) jelas, copywriting persuasif, dan analitik konversi.', 1200000.00, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', TRUE, TRUE),
(2, 'Desain Antarmuka Mobile & Web', 'desain-antarmuka-ui-ux', 'Riset pengguna, wireframe, prototipe interaktif Figma hingga design system siap koding.', 'Mendesain pengalaman pengguna yang intuitif dengan panduan desain Figma, uji usability, dan dokumentasi aset komponen.', 3000000.00, 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600', FALSE, TRUE),
(3, 'Brand Guideline & Logo Identity', 'brand-guideline-logo', 'Pembuatan logo profesional, palet warna, tipografi, dan buku panduan identitas merek.', 'Membangun karakter visual merek Anda agar mudah dikenali di semua platform cetak maupun digital.', 1800000.00, 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600', FALSE, TRUE),
(4, 'Optimasi SEO & Peringkat Google', 'optimasi-seo-peringkat-google', 'Tingkatkan peringkat pencarian lokal dan nasional di Google dengan audit SEO berkala.', 'Layanan optimasi kata kunci, perbaikan struktur tautan, kecepatan loading, dan Google Search Console setup.', 1500000.00, 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=600', TRUE, TRUE);

-- 4. Data Testimoni Klien
INSERT INTO testimonials (service_id, client_name, client_company, client_role, rating, testimonial_text, avatar_url, is_approved) VALUES
(1, 'Bambang Sudibyo', 'PT Sinar Logistik Mandiri', 'Direktur Operasional', 5, 'Website baru kami sangat responsif dan meningkatkan kepercayaan calon klien korporat kami hingga 40%. Sangat direkomendasikan!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', TRUE),
(1, 'Siti Nurhaliza', 'Kopi Senja Nusantara', 'Pemilik Usaha', 5, 'Tampilan website company profile kami jadi sangat estetik dan interaktif. Banyak pelanggan yang langsung menghubungi via tombol WhatsApp!', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', TRUE),
(2, 'Hendrawan Pratama', 'Fintech Nusantara Tech', 'Product Lead', 4, 'Hasil desain prototipe Figma sangat rapi dan siap implementasi ke frontend developer. Komunikasi tim sangat lancar.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', TRUE);

-- 5. Data Pesan Kontak Formulir
INSERT INTO contact_messages (sender_name, sender_email, sender_phone, subject, message, status) VALUES
('Rendra Kusuma', 'rendra.kusuma@gmail.com', '081234891122', 'Tanya Paket Website Company Profile', 'Selamat siang, kami tertarik untuk membuat website profil kantor baru untuk firma hukum kami. Berapa lama estimasi pengerjaannya?', 'unread'),
('Maya Anggraini', 'maya.anggraini@mitraabadi.co.id', '085712349000', 'Kerjasama Redesign Portofolio', 'Halo tim Nusantara, apakah bisa membantu migrasi website statis kami ke Next.js dan integrasi database katalog?', 'read'),
('Dimas Saputra', 'dimas.saputra@student.ac.id', '089678123456', 'Konsultasi Tugas Kuliah Pemrograman Web', 'Halo kak, mau tanya best practice menghubungkan website di GitHub Pages ke database gratis seperti Supabase/Firebase.', 'replied');

-- 6. Data Admin User (Password hash contoh untuk: Admin123!)
INSERT INTO admin_users (username, email, password_hash, role, full_name, is_active) VALUES
('admin_super', 'superadmin@nusantaracreative.id', '$2b$12$e8YkZ7Xn9vKqfH6jK4R8.eq2g4QJ5P4zVw9f3HqL2J5Y9n6b1w5Ke', 'superadmin', 'Super Administrator', TRUE),
('editor_web', 'editor@nusantaracreative.id', '$2b$12$f9ZlA8Yo0wLrGI7kL5S9.fr3h5RK6Q5aWx0g4IrM3K6Z0o7c2x6Lf', 'editor', 'Content Editor', TRUE);
`;

export const PREBUILT_QUERIES: PrebuiltQuery[] = [
  {
    id: 'q1',
    title: '1. Ambil Semua Layanan Beserta Kategori (JOIN)',
    description: 'Menampilkan katalog layanan lengkap dengan nama kategori untuk dirender di halaman utama company profile.',
    targetTable: 'services',
    sql: `SELECT 
  s.id, 
  s.title AS nama_layanan, 
  c.name AS kategori, 
  s.price_estimate AS estimasi_harga,
  s.is_featured AS unggulan
FROM services s
INNER JOIN categories c ON s.category_id = c.id
WHERE s.is_active = TRUE
ORDER BY s.is_featured DESC, s.created_at DESC;`,
    explanation: 'Menggunakan INNER JOIN antara tabel services dan categories berdasarkan category_id. Menjamin hanya layanan aktif yang dimuat, serta menaruh layanan unggulan di urutan teratas.',
  },
  {
    id: 'q2',
    title: '2. Simpan Pesan Baru dari Formulir Kontak (INSERT)',
    description: 'Query yang dieksekusi ketika pengunjung menekan tombol "Kirim Pesan" pada halaman kontak Tugas-CP.',
    targetTable: 'contact_messages',
    sql: `INSERT INTO contact_messages 
  (sender_name, sender_email, sender_phone, subject, message, status) 
VALUES 
  ('Anisa Rahmawati', 'anisa.rahma@perusahaan.com', '081299887766', 'Permintaan Demo Web', 'Mohon informasi jadwal presentasi portofolio.', 'unread');`,
    explanation: 'Menyimpan input formulir ke tabel contact_messages dengan nilai default status "unread", sehingga langsung muncul sebagai notifikasi pesan baru di dashboard admin.',
  },
  {
    id: 'q3',
    title: '3. Ambil Testimoni Klien Bintang 5 yang Sudah Disetujui',
    description: 'Menampilkan ulasan klien dengan rating tertinggi untuk dipasang di carousel testimoni beranda.',
    targetTable: 'testimonials',
    sql: `SELECT 
  client_name, 
  client_company, 
  client_role, 
  rating, 
  testimonial_text 
FROM testimonials
WHERE is_approved = TRUE AND rating = 5
ORDER BY created_at DESC 
LIMIT 3;`,
    explanation: 'Filter is_approved = TRUE mencegah komentar spam atau belum dimoderasi tampil di website publik. Menggunakan LIMIT 3 agar tampilan beranda rapi dan cepat dimuat.',
  },
  {
    id: 'q4',
    title: '4. Agregasi: Hitung Jumlah Layanan per Kategori (GROUP BY)',
    description: 'Menghitung statistik jumlah layanan yang tersedia di masing-masing kategori untuk widget dashboard admin.',
    targetTable: 'categories',
    sql: `SELECT 
  c.name AS nama_kategori,
  COUNT(s.id) AS total_layanan,
  COALESCE(AVG(s.price_estimate), 0) AS rata_rata_harga
FROM categories c
LEFT JOIN services s ON c.id = s.category_id
GROUP BY c.id, c.name
ORDER BY total_layanan DESC;`,
    explanation: 'Menggunakan LEFT JOIN sehingga kategori yang belum memiliki layanan tetap muncul dengan jumlah total 0. Fungsi agregasi COUNT() dan AVG() membantu pelaporan bisnis.',
  },
  {
    id: 'q5',
    title: '5. Update Status Pesan Kontak Setelah Dibaca Admin (UPDATE)',
    description: 'Mengubah status pesan dari unread menjadi read atau replied saat dibuka di admin panel.',
    targetTable: 'contact_messages',
    sql: `UPDATE contact_messages 
SET status = 'replied' 
WHERE id = 1 AND status = 'unread';`,
    explanation: 'Melakukan pembaruan kondisional berbasis primary key (id = 1) untuk memastikan hanya baris target yang statusnya diperbarui secara aman.',
  },
];

export const MOCK_DATABASE_ROWS: Record<string, any[]> = {
  companies: [
    {
      id: 1,
      name: 'Nusantara Creative Studio',
      tagline: 'Mewujudkan Identitas Digital Perusahaan Modern',
      email: 'halo@nusantaracreative.id',
      phone: '+62 21 8976 5432',
      address: 'Gedung Cyber Tower Lt. 5, Jakarta Selatan',
      updated_at: '2026-11-01 10:00:00',
    },
  ],
  categories: [
    { id: 1, name: 'Web Development', slug: 'web-development', icon_name: 'globe', services_count: 2 },
    { id: 2, name: 'UI/UX Design', slug: 'ui-ux-design', icon_name: 'layout', services_count: 1 },
    { id: 3, name: 'Branding & Identitas', slug: 'branding-identitas', icon_name: 'sparkles', services_count: 1 },
    { id: 4, name: 'SEO & Marketing', slug: 'seo-marketing', icon_name: 'trending-up', services_count: 1 },
  ],
  services: [
    { id: 1, category_id: 1, category_name: 'Web Development', title: 'Website Company Profile Eksklusif', price_estimate: 2500000, is_featured: true, is_active: true },
    { id: 2, category_id: 1, category_name: 'Web Development', title: 'Landing Page Produk & Promosi', price_estimate: 1200000, is_featured: true, is_active: true },
    { id: 3, category_id: 2, category_name: 'UI/UX Design', title: 'Desain Antarmuka Mobile & Web', price_estimate: 3000000, is_featured: false, is_active: true },
    { id: 4, category_id: 3, category_name: 'Branding & Identitas', title: 'Brand Guideline & Logo Identity', price_estimate: 1800000, is_featured: false, is_active: true },
    { id: 5, category_id: 4, category_name: 'SEO & Marketing', title: 'Optimasi SEO & Peringkat Google', price_estimate: 1500000, is_featured: true, is_active: true },
  ],
  testimonials: [
    { id: 1, client_name: 'Bambang Sudibyo', client_company: 'PT Sinar Logistik', rating: 5, quote: 'Website baru kami sangat responsif dan meningkatkan kepercayaan calon klien korporat kami.', is_approved: true },
    { id: 2, client_name: 'Siti Nurhaliza', client_company: 'Kopi Senja Nusantara', rating: 5, quote: 'Tampilan website company profile kami jadi sangat estetik dan interaktif.', is_approved: true },
    { id: 3, client_name: 'Hendrawan Pratama', client_company: 'Fintech Nusantara Tech', rating: 4, quote: 'Hasil desain prototipe Figma sangat rapi dan siap implementasi ke frontend developer.', is_approved: true },
  ],
  contact_messages: [
    { id: 1, sender_name: 'Rendra Kusuma', sender_email: 'rendra.kusuma@gmail.com', subject: 'Tanya Paket Website Company Profile', status: 'unread', created_at: '2026-11-05 14:20:00' },
    { id: 2, sender_name: 'Maya Anggraini', sender_email: 'maya.anggraini@mitraabadi.co.id', subject: 'Kerjasama Redesign Portofolio', status: 'read', created_at: '2026-11-04 09:15:00' },
    { id: 3, sender_name: 'Dimas Saputra', sender_email: 'dimas.saputra@student.ac.id', subject: 'Konsultasi Tugas Kuliah Pemrograman Web', status: 'replied', created_at: '2026-11-02 18:40:00' },
  ],
  admin_users: [
    { id: 1, username: 'admin_super', email: 'superadmin@nusantaracreative.id', role: 'superadmin', full_name: 'Super Administrator', is_active: true },
    { id: 2, username: 'editor_web', email: 'editor@nusantaracreative.id', role: 'editor', full_name: 'Content Editor', is_active: true },
  ],
};
