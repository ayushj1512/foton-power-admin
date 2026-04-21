import {
  BadgePercent,
  BookOpen,
  FolderKanban,
  Heart,
  Home,
  Image as ImageIcon,
  Package,
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
      { label: "Create Product", href: "/products/create" },
      { label: "Manage Products", href: "/products/manage" },
      { label: "Low Stock", href: "/products/low-stock" },
    ],
  },

  {
    label: "Media",
    icon: ImageIcon,
    children: [
      { label: "Media Library", href: "/media" },
      { label: "Upload Media", href: "/media/upload" },
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
    children: [{ label: "All Customers", href: "/customers" }],
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
    label: "Coupons",
    icon: BadgePercent,
    children: [
      { label: "All Coupons", href: "/coupons" },
      { label: "Add Coupon", href: "/coupons/add" },
      { label: "Active Coupons", href: "/coupons/active" },
      { label: "Expired Coupons", href: "/coupons/expired" },
    ],
  },

  {
    label: "Support Tickets",
    icon: Ticket,
    children: [
      { label: "All Tickets", href: "/support-tickets" },
      { label: "Open Tickets", href: "/support-tickets/open" },
    ],
  },

  {
    label: "Wishlist",
    icon: Heart,
    children: [
      { label: "Wishlist Dashboard", href: "/wishlist" },
      { label: "All Wishlist", href: "/wishlist/list" },
    ],
  },

  {
    label: "Profile",
    icon: ShieldCheck,
    href: "/profile",
  },
];