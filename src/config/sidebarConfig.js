import {
  BadgePercent,
  BookOpen,
  Boxes,
  FolderKanban,
  Heart,
  Home,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Ticket,
  Truck,
  Users,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/", icon: Home },

  {
    label: "Orders",
    icon: Package,
    children: [
      { label: "All Orders", href: "/orders/list" },
      { label: "Processing", href: "/orders/list?orderStatus=processing" },
      { label: "Pending", href: "/orders/list?orderStatus=pending" },
      { label: "Packed", href: "/orders/list?orderStatus=packed" },
      { label: "Picked", href: "/orders/list?orderStatus=picked" },
      { label: "Shipped", href: "/orders/list?orderStatus=shipped" },
      { label: "Delivered", href: "/orders/list?orderStatus=delivered" },
      { label: "Cancelled", href: "/orders/list?orderStatus=cancelled" },
      { label: "Returned", href: "/orders/list?orderStatus=returned" },
      { label: "Refunded", href: "/orders/list?orderStatus=refunded" },
      { label: "RTO", href: "/orders/list?orderStatus=rto" },
      { label: "Pending Payments", href: "/orders/list?paymentStatus=pending" },
    ],
  },

  {
    label: "Shiprocket",
    icon: Truck,
    children: [
      { label: "Overview", href: "/shiprocket" },
      { label: "Pending Booking", href: "/shiprocket/pending" },
      { label: "Failed", href: "/shiprocket/failed" },
      { label: "Booked", href: "/shiprocket/booked" },
      { label: "Tracking", href: "/shiprocket/tracking" },
      { label: "Settings", href: "/shiprocket/settings" },
    ],
  },

  {
    label: "Products",
    icon: ShoppingBag,
    children: [
      { label: "All Products", href: "/products" },
      { label: "Add Product", href: "/products/create" },
      { label: "Manage Products", href: "/products/manage" },
      { label: "Draft Products", href: "/products?view=draft" },
      { label: "Out of Stock", href: "/products?stock=out" },
      { label: "Low Stock", href: "/products/low-stock" },
    ],
  },

  {
    label: "Blogs",
    icon: BookOpen,
    children: [
      { label: "All Blogs", href: "/blogs" },
      { label: "Create Blog", href: "/blogs/create" },
    ],
  },

  {
    label: "Customers",
    icon: Users,
    children: [
      { label: "All Customers", href: "/customers" },
      { label: "New Customers", href: "/customers?type=new" },
      { label: "Repeat Customers", href: "/customers?type=repeat" },
    ],
  },

  {
    label: "Categories",
    icon: Tags,
    children: [
      { label: "All Categories", href: "/categories" },
      { label: "Create Category", href: "/categories/create" },
    ],
  },

  {
    label: "Collections",
    icon: FolderKanban,
    children: [
      { label: "All Collections", href: "/collections" },
      { label: "Add Collection", href: "/collections/new" },
    ],
  },

  {
    label: "Inventory",
    icon: Boxes,
    children: [
      { label: "Overview", href: "/inventory" },
      { label: "Reservations", href: "/inventory/reservations" },
      { label: "In Stock", href: "/inventory?filter=in-stock" },
      { label: "Low Stock", href: "/inventory?filter=low-stock" },
      { label: "Out of Stock", href: "/inventory?filter=out-stock" },
    ],
  },

  {
    label: "Coupons",
    icon: BadgePercent,
    children: [
      { label: "All Coupons", href: "/coupons" },
      { label: "Add Coupon", href: "/coupons/add" },
      { label: "Active Coupons", href: "/coupons?status=active" },
      { label: "Expired Coupons", href: "/coupons?status=expired" },
    ],
  },

  {
    label: "Support Tickets",
    icon: Ticket,
    children: [
      { label: "All Tickets", href: "/support-tickets" },
      { label: "Open Tickets", href: "/support-tickets?status=open" },
    ],
  },

  { label: "Wishlist", icon: Heart, href: "/wishlist" },

  { label: "Admin Users", icon: ShieldCheck, href: "/users" },
  { label: "Settings", icon: Settings, href: "/settings" },
];