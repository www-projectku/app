# Prototipe Pengelolaan Stok Barang Toko Sembako Berbasis Web

Proyek ini merupakan prototipe untuk penelitian berjudul **“Perancangan dan Pengembangan Pengelolaan Stok Barang pada Toko Sembako Berbasis Web.”**

## Ruang lingkup fitur
- Dashboard ringkasan persediaan
- Data barang
- Pencatatan barang masuk
- Pencatatan barang keluar/penjualan
- Stok opname dan penyesuaian stok
- Riwayat/kartu stok
- Data pemasok
- Laporan stok dan rancangan struktur data

## Menjalankan secara lokal

Prasyarat: Node.js versi yang kompatibel dengan Vite.

```bash
npm install
npm run dev
```

Untuk membuat hasil build:

```bash
npm run build
```

## Catatan status prototipe
Data awal pada aplikasi merupakan data simulasi. Pengelolaan state saat ini berlangsung di sisi frontend dan belum menggunakan database permanen atau backend produksi. Karena itu, perubahan data tidak dijamin tetap tersedia setelah halaman dimuat ulang atau dibuka dari perangkat/peramban lain. Fitur login dan pergantian peran juga merupakan simulasi antarmuka, bukan autentikasi aman untuk penggunaan produksi.

## Teknologi
React, TypeScript, dan Vite.
