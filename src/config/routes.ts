import {
  Banknote,
  BarChart3,
  Bell,
  CalendarCheck,
  Car,
  CircleHelp,
  CreditCard,
  FileSignature,
  LayoutDashboard,
  Map,
  PieChart,
  Scroll,
  Settings,
  ShieldCheck,
  SquareArrowUpRight,
  UserCog,
  Users,
  Wrench,
} from "lucide-react"

import { NavGroup, NavMainItem } from "@/types/navigation"

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Fleet Map",
        url: "/fleet-map",
        icon: Map,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
        subItems: [
          { title: "Revenue", url: "/analytics/revenue" },
          { title: "Fleet Usage", url: "/analytics/fleet" },
          { title: "Bookings", url: "/analytics/bookings" },
        ],
      },
    ],
  },

  {
    id: 2,
    label: "Fleet Management",
    items: [
      {
        title: "Vehicles",
        url: "/vehicles",
        icon: Car,
        subItems: [
          { title: "All Vehicles", url: "/vehicles" },
          { title: "Add Vehicle", url: "/vehicles/add" },
          { title: "Vehicle Types", url: "/vehicles/types" },
          { title: "Documents", url: "/vehicles/documents" },
        ],
      },
      {
        title: "Maintenance",
        url: "/maintenance",
        icon: Wrench,
        subItems: [
          { title: "Tasks", url: "/maintenance" },
          { title: "Service History", url: "/maintenance/history" },
          { title: "Expense Log", url: "/maintenance/expenses" },
        ],
      },
    ],
  },

  {
    id: 3,
    label: "Bookings",
    items: [
      {
        title: "Bookings",
        url: "/bookings",
        icon: CalendarCheck,
        subItems: [
          { title: "All Bookings", url: "/bookings" },
          { title: "Create Booking", url: "/bookings/create" },
          { title: "Calendar View", url: "/bookings/calendar" },
        ],
      },
      {
        title: "Payments",
        url: "/payments",
        icon: CreditCard,
        subItems: [
          { title: "All Payments", url: "/payments" },
          { title: "Pending", url: "/payments/pending" },
          { title: "Refunds", url: "/payments/refunds" },
        ],
      },
      {
        title: "Agreements",
        url: "/agreements",
        icon: FileSignature,
        subItems: [
          { title: "All Agreements", url: "/agreements" },
          { title: "Templates", url: "/agreements/templates" },
        ],
      },
    ],
  },

  {
    id: 4,
    label: "Customers",
    items: [
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
        subItems: [
          { title: "All Customers", url: "/customers" },
          { title: "Add Customer", url: "/customers/add" },
          { title: "Blacklist", url: "/customers/blacklist" },
        ],
      },
    ],
  },

  {
    id: 5,
    label: "Staff & Roles",
    items: [
      {
        title: "Staff",
        url: "/staff",
        icon: UserCog,
        subItems: [
          { title: "All Staff", url: "/staff" },
          { title: "Invite Staff", url: "/staff/invite" },
        ],
      },
      {
        title: "Roles & Permissions",
        url: "/roles",
        icon: ShieldCheck,
        subItems: [
          { title: "Roles", url: "/roles" },
          { title: "Permissions", url: "/roles/permissions" },
        ],
      },
    ],
  },

  {
    id: 6,
    label: "Finance",
    items: [
      {
        title: "Invoices",
        url: "/invoices",
        icon: Scroll,
        subItems: [
          { title: "All Invoices", url: "/invoices" },
          { title: "Overdue", url: "/invoices/overdue" },
        ],
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: Banknote,
        subItems: [
          { title: "All Transactions", url: "/transactions" },
          { title: "Payouts", url: "/transactions/payouts" },
        ],
      },
      {
        title: "Reports",
        url: "/reports",
        icon: PieChart,
        subItems: [
          { title: "Financial", url: "/reports/financial" },
          { title: "Fleet Performance", url: "/reports/fleet" },
          { title: "Customer Insights", url: "/reports/customers" },
        ],
      },
    ],
  },
]

export const secondaryNavItems: NavMainItem[] = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Get Help",
    url: "/help",
    icon: CircleHelp,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: SquareArrowUpRight,
  },
]

export const accountDropdownItems: NavMainItem[] = [
  {
    title: "Account",
    url: "/account",
    icon: ShieldCheck,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
]
