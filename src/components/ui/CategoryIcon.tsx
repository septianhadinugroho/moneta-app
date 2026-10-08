'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name?: string;
  className?: string;
}

export default function CategoryIcon({ name, className = 'w-5 h-5' }: CategoryIconProps) {
  if (!name) return <Icons.Tag className={className} />;

  // Dynamic Icon Component Loader (Fallback ke Tag jika ikon tidak ditemukan)
  const IconComponent = (Icons as any)[name] || Icons.Tag;

  return <IconComponent className={className} />;
}

// KAMUS ALIAS/KEYWORDS UNTUK PENCARIAN BAHASA INDONESIA & SINONIM
export const ICON_TAGS: Record<string, string[]> = {
  // Makanan & Kuliner
  Utensils: ['makan', 'sendok', 'garpu', 'restoran', 'kuliner', 'food', 'warung', 'feasting'],
  Coffee: ['kopi', 'minum', 'cafe', 'kafe', 'kopi kenangan', 'fore', 'americano', 'espresso'],
  Pizza: ['pizza', 'makanan', 'fastfood', 'junkfood', 'pijat'],
  ShoppingBag: ['belanja', 'tas', 'kantong', 'mall', 'jajan', 'shopee', 'tokopedia'],
  Apple: ['buah', 'sehat', 'apel', 'fruit', 'snack'],
  Beer: ['alkohol', 'bir', 'minuman', 'nongkrong'],
  Soup: ['makanan', 'sup', 'soto', 'bakso', 'ramen', 'mie'],
  Cake: ['kue', 'roti', 'ulang tahun', 'dessert', 'sweet'],
  Cookie: ['kue', 'biskuit', 'snack', 'jajan', 'cemilan'],
  CupSoda: ['minuman', 'soda', 'boba', 'es', 'softdrink'],
  Sandwich: ['roti', 'sarapan', 'makanan', 'breakfast'],
  IceCream2: ['es krim', 'eskrim', 'sweet', 'gelato', 'dessert'],
  Popcorn: ['bioskop', 'nonton', 'snack', 'jajan'],
  Donut: ['donat', 'kue', 'jajan', 'makanan'],
  Wine: ['anggur', 'alkohol', 'minuman'],
  Milk: ['susu', 'minuman', 'sehat', 'sehat'],

  // Hiburan, Film & Game
  Gamepad2: ['game', 'gaming', 'playstation', 'ps', 'stik', 'hobi', 'clash of clans', 'coc'],
  Tv: ['televisi', 'tv', 'nonton', 'netflix', 'youtube'],
  Film: ['bioskop', 'film', 'movie', 'cinema', 'nonton'],
  Music: ['musik', 'lagu', 'spotify', 'konser', 'lany', 'sza'],
  Dumbbell: ['gym', 'olahraga', 'fitness', 'workout', 'otot'],
  Palmtree: ['liburan', 'pantai', 'wisata', 'tour', 'travel', 'jogja'],
  Ticket: ['tiket', 'bioskop', 'konser', 'event', 'ka progo'],
  Camera: ['foto', 'fotografi', 'kamera', 'snaps'],
  Headphones: ['headset', 'musik', 'earphone', 'soundcore', 'audio'],
  Guitar: ['musik', 'gitar', 'alat musik', 'hobi'],
  Smile: ['hiburan', 'senang', 'hobi', 'fun'],
  PartyPopper: ['pesta', 'celebration', 'event', 'ulang tahun'],
  Plane: ['pesawat', 'travel', 'liburan', 'wisata', 'tiket'],
  Tent: ['camping', 'kemah', 'outdoor', 'bundaran'],
  Trophy: ['juara', 'prestasi', 'lomba', 'piala'],
  Sparkles: ['special', 'magic', 'fitur', 'ai'],
  Clapperboard: ['film', 'bioskop', 'nonton', 'cinema', 'movie'],
  Swords: ['game', 'pedang', 'war', 'moba'],
  Radio: ['radio', 'musik', 'siaran'],
  Drama: ['teater', 'nonton', 'drama', 'drakor'],

  // Gadget, Teknologi & Kerja
  Laptop: ['komputer', 'laptop', 'asus', 'tuf', 'kerja', 'coding', 'programming'],
  Smartphone: ['hp', 'handphone', 'samsung', 'gadget', 'pulsa', 'kuota', 'android'],
  Monitor: ['layar', 'pc', 'komputer', 'asus 180hz', 'display'],
  Cpu: ['prosesor', 'pc', 'hardware', 'ssd', 'computer'],
  Printer: ['cetak', 'print', 'hp laserjet', 'kertas', 'dokumen'],
  HardDrive: ['storage', 'ssd', 'nvme', 'msi', 'penyimpanan'],
  Keyboard: ['ketik', 'pc', 'hardware', 'aksesoris'],
  Mouse: ['mouse', 'pc', 'aksesoris'],
  Server: ['backend', 'server', 'pm2', 'nginx', 'vps', 'database'],
  Code: ['coding', 'developer', 'program', 'react', 'nextjs', 'laravel'],
  Terminal: ['linux', 'bash', 'cmd', 'admin'],
  Database: ['postgresql', 'mysql', 'mongodb', 'supabase', 'redis', 'db'],
  Bot: ['bot', 'ai', 'gemini', 'automation'],
  Microscope: ['research', 'skripsi', 'penelitian', 'lab'],
  Briefcase: ['kerja', 'kantor', 'karir', 'pekerjaan', 'bisnis'],
  Folder: ['file', 'berkas', 'dokumen', 'folder'],

  // Belanja, Fashion & Skincare
  Shirt: ['baju', 'pakaian', 'kaos', 'outfit', 'fashion', 'sweater'],
  ShoppingBasket: ['belanja', 'supermarket', 'trans retail', 'shopee', 'pasar'],
  Watch: ['jam', 'jam tangan', 'aksesoris', 'fashion'],
  Glasses: ['kacamata', 'mata', 'aksesoris'],
  Gem: ['perhiasan', 'emas', 'berlian', 'mewah'],
  Gift: ['hadiah', 'kado', 'souvenir', 'kado'],
  Footprints: ['sepatu', 'asics', 'mills', 'olahraga', 'lari', 'lari'],
  Scissors: ['cukur', 'barber', 'potong rambut', 'salon'],
  Store: ['toko', 'warung', 'merchant', 'snack iseng'],
  Package: ['paket', 'kurir', 'ekspedisi', 'pos', 'paket'],
  Sparkle: ['glowing', 'skincare', 'perawatan'],
  Crown: ['premium', 'vip', 'langganan', 'plus'],
  SmilePlus: ['skincare', 'wajah', 'salicylic acid', 'retinol'],
  SprayCan: ['parfum', 'skincare', 'body mist', 'semprot'],

  // Transportasi & Otomotif
  Car: ['mobil', 'kendaraan', 'taksi', 'gocar', 'grabcar'],
  Bike: ['motor', 'sepeda', 'soul gt', 'ojek', 'goride', 'yamaha', 'oli'],
  Bus: ['bis', 'bus', 'transjakarta', 'angkot', 'damri'],
  Train: ['kereta', 'ka progo', 'krl', 'mrt', 'lrt', 'kai'],
  Fuel: ['bensin', 'pertamax', 'pertalite', 'spbu', 'shell', 'bbm'],
  Wrench: ['bengkel', 'servis', 'oli', 'motul', 'perbaikan', 'maintenance'],
  Navigation: ['maps', 'gps', 'peta', 'lokasi', 'navigasi'],
  PlaneTakeoff: ['bandara', 'penerbangan', 'traveloka', 'tiket'],
  ParkingCircle: ['parkir', 'retribusi', 'tiket parkir'],
  Key: ['kunci', 'kunci motor', 'akses'],
  Compass: ['arah', 'navigasi', 'petualangan'],
  Gauge: ['spedometer', 'servis', 'kecepatan'],

  // Rumah, Tagihan & Rutinitas
  Home: ['rumah', 'kontrakan', 'kos', 'tempat tinggal', 'properti'],
  Zap: ['listrik', 'pln', 'tokoin', 'tagihan listrik'],
  Droplets: ['air', 'pdam', 'tagihan air', 'minum'],
  Wifi: ['internet', 'indihome', 'biznet', 'wifi', 'kuota'],
  CreditCard: ['kartu kredit', 'bank', 'atm', 'mandiri', 'bca', 'bsi'],
  Phone: ['pulsa', 'kuota', 'telepon', 'indosat', 'telkomsel'],
  HeartPulse: ['kesehatan', 'dokter', 'obat', 'rumahsakit', 'apotek'],
  GraduationCap: ['kuliah', 'spp', 'pendidikan', 'uin', 'ijazah', 'wisuda'],
  Lightbulb: ['listrik', 'lampu', 'ide', 'kreatif'],
  ShieldCheck: ['asuransi', 'raksa', 'keamanan', 'proteksi'],
  Tv2: ['tv kabel', 'indihome', 'netflix', 'langganan'],
  Receipt: ['tagihan', 'struk', 'nota', 'pembayaran'],
  CalendarDays: ['rutin', 'bulanan', 'jadwal', 'sewa'],
  RotateCw: ['langganan', 'gojek plus', 'google ai', 'recurring'],
  Clock: ['waktu', 'pengingat', 'lembur'],
  Trash2: ['kebersihan', 'iuran sampah', 'kebersihan'],

  // Keluarga, Hewan & Tanaman
  Users: ['keluarga', 'family', 'teman', 'padepokan', 'kaum rebahan'],
  UserCheck: ['member', 'akun', 'profil'],
  Baby: ['bayi', 'anak', 'popok', 'kebutuhan anak'],
  Dog: ['anjing', 'anabul', 'pet', 'makanan hewan'],
  Cat: ['kucing', 'anabul', 'pet', 'makanan hewan'],
  Fish: ['ikan', 'akuarium', 'pakan ikan'],
  Flower2: ['bunga', 'tanaman', 'kebun', 'taman'],
  Trees: ['lingkungan', 'taman', 'alam'],
  Sprout: ['investasi', 'pertumbuhan', 'tanaman'],
  Sun: ['outdoor', 'siang', 'cuaca'],
  Heart: ['sedekah', 'donasi', 'zakat', 'kasih sayang'],

  // Investasi, Tabungan & Bisnis
  TrendingUp: ['investasi', 'saham', 'e-ipo', 'cuan', 'bank mandiri', 'sido muncul'],
  DollarSign: ['gaji', 'uang', 'cash', 'pendapatan', 'income'],
  Building2: ['kantor', 'perusahaan', 'gaji', 'pt trans retail', 'maybank'],
  PiggyBank: ['tabungan', 'celengan', 'hemat', 'deposit'],
  Coins: ['koin', 'uang receh', 'cashback', 'bonus'],
  Wallet: ['dompet', 'gopay', 'e-money', 'saldo', 'ovo', 'shopeepay'],
  Landmark: ['bank', 'bca', 'mandiri', 'bsi', 'seabank', 'bank jago'],
  HandCoins: ['pinjaman', 'piutang', 'utang', 'transfer', 'kas', 'pelunasan', 'cicilan'],
  BadgePercent: ['diskon', 'promo', 'bunga', 'tax'],
  BarChart3: ['laporan', 'grafik', 'analisis', 'keuangan'],
  ReceiptText: ['laporan pajak', 'faktur', 'nota'],
  Vault: ['deposito', 'brankas', 'aset', 'kekayaan'],
};

// DAFTAR IKON LENGKAP & VARIASI KATEGORI UNIK
export const ICON_GROUPS = [
  {
    category: 'Makanan & Kuliner',
    icons: [
      'Utensils', 'Coffee', 'Pizza', 'ShoppingBag', 'Apple', 'Beer',
      'Soup', 'Cake', 'Cookie', 'CupSoda', 'Sandwich', 'IceCream2',
      'Popcorn', 'Martini', 'GlassWater', 'Donut', 'Wine', 'Milk'
    ],
  },
  {
    category: 'Hiburan, Film & Game',
    icons: [
      'Gamepad2', 'Tv', 'Film', 'Music', 'Dumbbell', 'Palmtree', 'Ticket',
      'Camera', 'Headphones', 'Guitar', 'Smile', 'PartyPopper', 'Plane',
      'Tent', 'Trophy', 'Sparkles', 'Clapperboard', 'Swords', 'Radio', 'Drama'
    ],
  },
  {
    category: 'Gadget, Teknologi & Kerja',
    icons: [
      'Laptop', 'Smartphone', 'Monitor', 'Cpu', 'Printer', 'HardDrive',
      'Keyboard', 'Mouse', 'Server', 'Code', 'Terminal', 'Database',
      'Bot', 'Microscope', 'Briefcase', 'Folder'
    ],
  },
  {
    category: 'Belanja, Fashion & Skincare',
    icons: [
      'Shirt', 'ShoppingBasket', 'Watch', 'Glasses', 'Gem', 'Gift',
      'Footprints', 'Scissors', 'Store', 'Package', 'Sparkle', 'Crown',
      'SmilePlus', 'SprayCan'
    ],
  },
  {
    category: 'Transportasi & Otomotif',
    icons: [
      'Car', 'Bike', 'Bus', 'Train', 'Fuel', 'Wrench',
      'Navigation', 'PlaneTakeoff', 'ParkingCircle', 'Key', 'Compass', 'Gauge'
    ],
  },
  {
    category: 'Rumah, Tagihan & Rutinitas',
    icons: [
      'Home', 'Zap', 'Droplets', 'Wifi', 'CreditCard', 'Phone',
      'HeartPulse', 'GraduationCap', 'Lightbulb', 'ShieldCheck', 'Tv2', 'Receipt',
      'CalendarDays', 'RotateCw', 'Clock', 'Trash2'
    ],
  },
  {
    category: 'Keluarga, Hewan & Tanaman',
    icons: [
      'Users', 'UserCheck', 'Baby', 'Dog', 'Cat', 'Fish',
      'Flower2', 'Trees', 'Sprout', 'Sun', 'Heart'
    ],
  },
  {
    category: 'Investasi, Tabungan & Bisnis',
    icons: [
      'TrendingUp', 'DollarSign', 'Building2', 'PiggyBank',
      'Coins', 'Wallet', 'Landmark', 'HandCoins', 'BadgePercent', 'BarChart3',
      'ReceiptText', 'Vault'
    ],
  },
];