'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name?: string;
  className?: string;
}

export default function CategoryIcon({ name, className = 'w-5 h-5' }: CategoryIconProps) {
  if (!name) return <Icons.Tag className={className} />;

  // Dynamic Icon Component Loader
  const IconComponent = (Icons as any)[name] || Icons.Tag;

  return <IconComponent className={className} />;
}

// DAFTAR IKON UCUL BERBAGAI VARIASI (EXPORTABLE)
export const ICON_GROUPS = [
  {
    category: 'Makanan & Jajan',
    icons: [
      'Utensils', 'Coffee', 'Pizza', 'ShoppingBag', 'Apple', 'Beer', 
      'Soup', 'Cake', 'Cookie', 'CupSoda', 'Sandwich', 'IceCream2', 
      'Popcorn', 'Martini', 'GlassWater'
    ],
  },
  {
    category: 'Hiburan & Hobi',
    icons: [
      'Gamepad2', 'Tv', 'Film', 'Music', 'Dumbbell', 'Palmtree', 'Ticket', 
      'Camera', 'Headphones', 'Guitar', 'Smile', 'PartyPopper', 'Plane', 
      'Tent', 'Trophy', 'Sparkles'
    ],
  },
  {
    category: 'Belanja & Gaya Hidup',
    icons: [
      'Shirt', 'ShoppingBasket', 'Watch', 'Glasses', 'Gem', 'Gift', 
      'Footprints', 'Scissors', 'Store', 'Package'
    ],
  },
  {
    category: 'Transportasi & Kendaraan',
    icons: [
      'Car', 'Bike', 'Bus', 'Train', 'Fuel', 'Wrench', 
      'Navigation', 'PlaneTakeoff', 'ParkingCircle', 'Key'
    ],
  },
  {
    category: 'Kebutuhan & Tagihan',
    icons: [
      'Home', 'Zap', 'Droplets', 'Wifi', 'CreditCard', 'Phone', 
      'HeartPulse', 'GraduationCap', 'Lightbulb', 'ShieldCheck', 'Tv2', 'Receipt'
    ],
  },
  {
    category: 'Pemasukan & Keuangan',
    icons: [
      'Briefcase', 'TrendingUp', 'DollarSign', 'Building2', 'PiggyBank', 
      'Coins', 'Wallet', 'Landmark', 'HandCoins', 'BadgePercent'
    ],
  },
];