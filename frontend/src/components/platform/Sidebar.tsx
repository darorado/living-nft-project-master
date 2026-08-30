"use client";
import React from 'react';
import { LayoutDashboard, Beaker, Coins, Settings, User, LogOut, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Bio-Lab', icon: Beaker, path: '/lab' },
  { name: 'Tokenomics', icon: Coins, path: '/economy' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function PlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-950 border-r border-gray-800 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-black tracking-tighter text-white">LIVING OS</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {MENU_ITEMS.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === item.path 
                ? 'bg-gray-800 text-white shadow-lg' 
                : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-900 rounded-xl cursor-pointer transition-all">
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">Admin User</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl cursor-pointer transition-all">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Disconnect</span>
        </div>
      </div>
    </aside>
  );
}
