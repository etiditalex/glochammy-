import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  LayoutDashboard,
  LineChart,
  Mail,
  Megaphone,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Warehouse,
  LayoutGrid,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

export const adminNavSections: AdminNavSection[] = [
  {
    title: "Main",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/products", label: "Product list", icon: Package },
      { href: "/admin/inventory", label: "Inventory list", icon: Warehouse },
      { href: "/admin/orders", label: "Order list", icon: ShoppingCart },
      { href: "/admin/customers", label: "Client list", icon: Users },
      { href: "/admin/reports/sales", label: "Sales report", icon: LineChart },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
      { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
      { href: "/admin/email", label: "Email", icon: Megaphone },
    ],
  },
  {
    title: "Maintenance",
    items: [
      { href: "/admin/brands", label: "Brand list", icon: Tag },
      { href: "/admin/categories", label: "Category list", icon: LayoutGrid },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
