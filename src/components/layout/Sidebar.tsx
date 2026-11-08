import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Truck, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ClipboardCheck, 
  History, 
  FileBarChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Lock,
  ShoppingBag,
  LogOut,
  ExternalLink,
  Store,
  User
} from 'lucide-react';
import { UserSession } from '../../types/auth';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  adminOnly?: boolean;
}

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  currentUser: UserSession;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onOpenLoginModal: () => void;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Data Barang', icon: Package },
  { id: 'categories', label: 'Kategori Barang', icon: Layers },
  { id: 'agen', label: 'Data Pemasok', icon: Truck },
  { id: 'kulakan', label: 'Barang Masuk', icon: ArrowDownToLine },
  { id: 'penjualan', label: 'Barang Keluar / Penjualan', icon: ArrowUpFromLine },
  { id: 'opname', label: 'Stok Opname', icon: ClipboardCheck },
  { id: 'kartu_stok', label: 'Riwayat Pergerakan Stok', icon: History },
  { id: 'laporan', label: 'Laporan', icon: FileBarChart },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onLogout,
  onOpenLoginModal,
}) => {
  const isAdmin = currentUser.role === 'admin';

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & App Name Header */}
        <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Store className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <h1 className="font-bold text-slate-800 text-sm tracking-tight truncate">
                  Berkah Jaya
                </h1>
                <p className="text-[11px] text-emerald-600 font-medium truncate">
                  Sistem Stok Sembako
                </p>
              </div>
            )}
          </div>

          {/* Close button on mobile / collapse on desktop */}
          <div className="flex items-center">
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Navigasi
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = item.adminOnly && !isAdmin;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && isLocked && (
                  <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                )}

                {!collapsed && item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout at Bottom */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          {!collapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div className="truncate flex-1">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {currentUser.nama}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        currentUser.role === 'admin' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                    />
                    <span className="font-semibold uppercase tracking-wider text-[9px]">
                      {currentUser.role === 'admin' ? 'Super Admin' : 'Petugas Toko'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={onLogout}
                  className="w-full py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  title="Keluar dari akun saat ini dan kembali ke halaman login"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Logout / Ganti Akun</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                title="Logout / Ganti Akun"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
