# 📍 StoryApp - Progressive Web App (PWA) Berbagi Cerita Lokasi

**StoryApp** adalah aplikasi web modern berbasis **Progressive Web App (PWA)** yang memungkinkan pengguna untuk membaca, menyimpan, dan membagikan cerita berbasis lokasi secara interaktif. Aplikasi ini dibangun sebagai submission **Proyek Kedua** pada kelas *Belajar Pengembangan Web Intermediate* di Dicoding.

---

## ✨ Fitur Utama & Keunggulan

### 1. 🌐 Single Page Application (SPA) & Arsitektur MVP
- **SPA & Hash Routing**: Navigasi antar halaman berjalan cepat tanpa reload halaman.
- **View Transitions API**: Efek animasi perpindahan halaman yang halus.
- **Arsitektur Model-View-Presenter (MVP)**: Pemisahan logika bisnis (*Presenter*) dan antarmuka (*View*) secara murni pada seluruh halaman (`Home`, `Login`, `Register`, `Add`, `Favorites`, `About`).

### 2. 🗺️ Peta Digital Interaktif & Multiple Tile Layers
- Menggunakan library **Leaflet.js** untuk menyajikan lokasi setiap cerita di peta digital.
- **Multiple Tile Layers Control**: Pengguna dapat mengubah tampilan peta secara bebas antara:
  - *OpenStreetMap*
  - *Satellite (Esri)*
  - *Topographic (OpenTopoMap)*
  - *Carto Light*
- Synchronized Marker: Mengklik kartu cerita akan memfokuskan lokasi di peta dan membuka popup.

### 3. 📸 Tambah Story Baru & Media Stream Kamera
- Opsi upload file gambar dari galeri atau **mengambil foto langsung melalui Kamera (Media Stream API)**.
- Fitur auto-compress gambar untuk memastikan ukuran file aman di bawah 1MB.
- Pemilihan titik lokasi (Latitude & Longitude) langsung dengan mengklik posisi di peta.

### 4. 🔔 Web Push Notification (Advanced)
- Terintegrasi dengan **REST API Push Notification Dicoding** menggunakan VAPID Public Key.
- Service Worker menangani event `push` dan menyajikan notifikasi dinamis lengkap dengan ikon, badge, dan tombol *action* (*"Lihat Story"*).
- Menangani `notificationclick` untuk mengarahkan pengguna ke halaman story terkait.
- **Toggle Button Notification**: Tombol langganan real-time (*Notifikasi: On / Off*) pada baris navigasi utama.

### 5. 📱 PWA & Dukungan Akses Offline (Advanced)
- **Web App Manifest (`manifest.json`)**: Memuat konfigurasi PWA lengkap (nama, ikon maskable 192px & 512px, screenshot desktop & mobile, theme color, dan shortcuts).
- **Dynamic Service Worker Caching (`sw.js`)**: Strategi *Stale-While-Revalidate* / *Network-First* yang menyimpan data cerita dan gambar dari API ke cache, sehingga aplikasi **tetap dapat diakses dan dibaca dalam keadaan offline**.

### 6. 💾 IndexedDB & Offline Synchronization (Advanced)
- Menggunakan library **`idb`** dengan 2 Object Stores:
  - **Story Favorit**: Pengguna dapat menyukai, menyimpan, memfilter/mencari, dan menghapus cerita favorit secara lokal.
  - **Offline Story Sync**: Saat perangkat **offline**, pengguna tetap dapat membuat cerita baru. Cerita disimpan di IndexedDB dan **secara otomatis di-sync ke server API** begitu koneksi internet pulih.

### 7. ♿ Aksesibilitas & Tampilan Responsif (WCAG Standards)
- Menerapkan HTML5 Semantik (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<fieldset>`, `<label>`).
- Fitur **Skip to content** dan dukungan **Keyboard Navigation** (tabindex, focus-visible outline).
- Layout responsif yang teruji pada layar Mobile (375px), Tablet (768px), dan Desktop (1024px+).

---

## 🛠️ Teknologi & Library

- **Core**: JavaScript (ES6+), HTML5, CSS3 Custom Tokens
- **Build Tool**: Vite v6
- **Routing & PWA**: Hash Router, Custom Service Worker, Web App Manifest
- **Map Service**: Leaflet.js
- **Database Lokal**: IndexedDB (`idb` v8)
- **Design & Layout**: Modern Glassmorphism, Google Fonts (Plus Jakarta Sans), Toast Notifications

---

## 📂 Struktur Proyek

```
submission_proyek_pertama/
├── public/
│   ├── _redirects            # Konfigurasi SPA Routing Netlify
│   ├── manifest.json          # Web App Manifest PWA
│   ├── sw.js                  # Service Worker (Caching, Push, Sync)
│   └── images/                # Icon PWA & Screenshot Manifest
├── src/
│   ├── index.html             # Main HTML App Shell
│   ├── styles/                # Styling CSS System & Toast
│   └── scripts/
│       ├── config.js          # API Config
│       ├── index.js           # App Entry point & SW Registration
│       ├── data/
│       │   ├── api.js         # Fetch REST API Dicoding
│       │   └── idb-helper.js  # Manager IndexedDB (Favorites & Offline)
│       ├── utils/
│       │   ├── toast.js       # Toast Notification Utility
│       │   ├── offline-sync.js# Auto Sync Listener Offline to Online
│       │   └── sw-register.js # Web Push & Service Worker Helper
│       ├── routes/            # SPA URL Parser & Routes Registry
│       └── pages/             # Pages (MVP Architecture)
│           ├── home/          # Home Page, Presenter, HTML Template
│           ├── add/           # Add Story Page, Presenter, HTML Template
│           ├── favorites/     # Favorites Page, Presenter, HTML Template
│           ├── login/         # Login Page, Presenter, HTML Template
│           ├── register/      # Register Page, Presenter, HTML Template
│           └── about/         # About Page & HTML Template
├── netlify.toml               # Konfigurasi Auto Deployment Netlify
├── STUDENT.txt                # Berkas URL Deployment Submission
└── package.json
```

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/username/story-app.git
   cd story-app
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173`.

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

5. **Preview Hasil Build**:
   ```bash
   npm run preview
   ```

---

## 🌐 Distribusi & Deployment

Aplikasi ini telah didistribusikan secara publik dan dapat diakses pada:
- **Deployment URL**: [https://storyapp-dicoding-pwa.netlify.app](https://storyapp-dicoding-pwa.netlify.app)

---

## 👤 Pengembang

Dibuat oleh **Zayadi**  
- **LinkedIn**: [linkedin.com/in/a-zayadi/](https://www.linkedin.com/in/a-zayadi/)
