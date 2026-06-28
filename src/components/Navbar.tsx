import { ShoppingCart, User, MapPin, Search, ChevronDown, ShieldAlert } from "lucide-react";
import { ViewType } from "../types";
import { UserSession } from "../lib/authUtils";

interface NavbarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  session: UserSession | null;
  adminTab: "dashboard" | "products" | "orders" | "customers" | "coupons";
  setAdminTab: (tab: "dashboard" | "products" | "orders" | "customers" | "coupons") => void;
}

export default function Navbar({
  activeView,
  setActiveView,
  cartCount,
  searchQuery,
  setSearchQuery,
  session,
  adminTab,
  setAdminTab,
}: NavbarProps) {
  const isDashboardView = activeView === "admin";
  const userInitials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "";

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-2.5 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        {/* Brand logo & Address */}
        <div className="flex items-center justify-between md:justify-start gap-8">
          <button
            onClick={() => {
              setActiveView("home");
              setSearchQuery("");
            }}
            className="flex items-center gap-3 md:gap-4 hover:opacity-90 transition-opacity focus:outline-none"
            aria-label="VijayRath Home"
          >
            {/* Elegant vector-graphic of the uploaded brand logo */}
            <svg 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto shrink-0 transition-transform duration-300 hover:scale-102" 
              viewBox="0 0 300 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Curve for text path */}
              <path id="vijayrath-text-curve" d="M 35,72 A 125,75 0 0,1 265,72" fill="none" />
              
              {/* Curved Text VIJAYRATH */}
              <text className="font-serif select-none" fill="#1e293b" fontSize="28" fontWeight="800" letterSpacing="3">
                <textPath href="#vijayrath-text-curve" startOffset="50%" textAnchor="middle">
                  VIJAYRATH
                </textPath>
              </text>

              {/* TM symbol */}
              <text x="264" y="52" className="font-sans select-none" fill="#1e293b" fontSize="9" fontWeight="700">TM</text>

              {/* Elephant & Crown Group */}
              <g transform="translate(95.5, 18)" fill="none">
                {/* Elephant Body and Trunk */}
                <path
                  d="M36 44 C28 44 24 50 24 64 L24 76 C24 77.5 25 78 26.5 78 L29.5 78 C31 78 31.5 77 31.5 75.5 L31.5 66 C34 66 36 66 36.5 66 L36.5 75.5 C36.5 77 37 78 38.5 78 L41.5 78 C43 78 43.5 77 43.5 75.5 L43.5 65 C48 65 52 64 54.5 61.5 L54.5 75.5 C54.5 77 55 78 56.5 78 L59.5 78 C61 78 61.5 77 61.5 75.5 L61.5 61 L64.5 61 L64.5 75.5 C64.5 77 65 78 66.5 78 L69.5 78 C71 78 71.5 77 71.5 75.5 L71.5 62 C76 62 80 59 83 54 C85 51 85.5 48.5 85 45 C84.5 41.5 81 39 77.5 40 L74.5 41 C73.5 36 68 33.5 60.5 33.5 C56.5 33.5 53 34.5 50.5 36 C47.5 34 43 33 39 33.5 L36 44 Z"
                  fill="#1e293b"
                />

                {/* Elegant Ears Accent */}
                <path
                  d="M50.5 36 C53 38 54 42 53.5 46 C53 50 50.5 53 47 54"
                  stroke="#64748b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />

                {/* Elephant Tusk (white) */}
                <path
                  d="M75 44 C76 43.5 78 44 78.5 45 C78 46.5 76 47 75 47 L75 44 Z"
                  fill="#ffffff"
                />

                {/* Stylized Golden Crown sitting on its back (amber-500) */}
                <path
                  d="M40 33 L35 25 L41 27 L46 22 L51 27 L57 25 L52 33 Z"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                
                {/* Elegant small crown gems */}
                <circle cx="35" cy="24" r="1" fill="#f59e0b" />
                <circle cx="46" cy="21" r="1" fill="#f59e0b" />
                <circle cx="57" cy="24" r="1" fill="#f59e0b" />
              </g>

              {/* PREMIUM Text */}
              <text x="114" y="96" className="font-sans select-none text-right" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="3" textAnchor="end">
                PREMIUM
              </text>

              {/* DELIGHTS Text */}
              <text x="186" y="96" className="font-sans select-none text-left" fill="#475569" fontSize="11" fontWeight="700" letterSpacing="3" textAnchor="start">
                DELIGHTS
              </text>
            </svg>

            {/* Vertical divider */}
            <div className="h-8 md:h-10 w-[1px] bg-slate-200 shrink-0" />

            {/* Brand text on the right side of the logo */}
            <div className="flex flex-col text-left">
              <span className="text-xl md:text-2xl font-display font-extrabold text-green-700 tracking-tight leading-none">
                VijayRath
              </span>
              <span className="text-[10px] md:text-xs block text-slate-500 font-sans tracking-wide font-bold uppercase mt-1">
                {isDashboardView ? "Admin Portal" : "Namkeen & Bakery"}
              </span>
            </div>
          </button>


        </div>

        {session?.role === "admin" ? (
          <div className="flex flex-1 items-center justify-end flex-wrap gap-1.5 md:gap-3">
            <nav className="flex items-center flex-wrap gap-1 md:gap-2 border border-slate-100 rounded-xl p-1 bg-slate-50/50">
              <button
                onClick={() => {
                  setActiveView("home");
                  setSearchQuery("");
                }}
                className={`font-sans text-xs md:text-sm font-bold px-2.5 md:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === "home"
                    ? "bg-green-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Storefront
              </button>
              
              <div className="h-4 w-[1px] bg-slate-200" />

              <button
                onClick={() => {
                  setActiveView("admin");
                  setAdminTab("dashboard");
                }}
                className={`font-sans text-xs md:text-sm font-bold px-2.5 md:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === "admin" && adminTab === "dashboard"
                    ? "bg-green-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Dashboard
              </button>

              <div className="h-4 w-[1px] bg-slate-200" />

              <button
                onClick={() => {
                  setActiveView("admin");
                  setAdminTab("products");
                }}
                className={`font-sans text-xs md:text-sm font-bold px-2.5 md:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === "admin" && adminTab === "products"
                    ? "bg-green-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Products
              </button>

              <div className="h-4 w-[1px] bg-slate-200" />

              <button
                onClick={() => {
                  setActiveView("admin");
                  setAdminTab("orders");
                }}
                className={`font-sans text-xs md:text-sm font-bold px-2.5 md:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === "admin" && adminTab === "orders"
                    ? "bg-green-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Orders
              </button>

              <div className="h-4 w-[1px] bg-slate-200" />

              <button
                onClick={() => {
                  setActiveView("admin");
                  setAdminTab("customers");
                }}
                className={`font-sans text-xs md:text-sm font-bold px-2.5 md:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === "admin" && adminTab === "customers"
                    ? "bg-green-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Customers
              </button>

              <div className="h-4 w-[1px] bg-slate-200" />

              <button
                onClick={() => {
                  setActiveView("admin");
                  setAdminTab("coupons");
                }}
                className={`font-sans text-xs md:text-sm font-bold px-2.5 md:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === "admin" && adminTab === "coupons"
                    ? "bg-green-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Coupons
              </button>

              <div className="h-4 w-[1px] bg-slate-200" />

              <button
                onClick={() => setActiveView("account")}
                className={`font-sans text-xs md:text-sm font-bold px-2.5 md:px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === "account"
                    ? "bg-green-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Hi, Admin
              </button>
            </nav>

            <button
              onClick={() => setActiveView("cart")}
              className={`rounded-full transition-all border relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0 cursor-pointer ${
                activeView === "cart"
                  ? "bg-green-700 border-green-700 text-white"
                  : "text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-green-700"
              }`}
              title="Open Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-sans text-[8px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-pulse shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        ) : (
          <>
            {/* Global Search Bar (Only shown on non-dashboard, or adapted) */}
            {activeView === "home" ? (
              <div className="flex-1 max-w-xl">
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-green-700 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeView !== "home") setActiveView("home");
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 md:py-2.5 pl-10 md:pl-12 pr-20 md:pr-24 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:bg-white transition-all text-xs md:text-sm shadow-inner"
                    placeholder="Search products..."
                    id="global-search-input"
                  />
                  <button
                    maxLength={40}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-700 hover:bg-green-800 text-white font-sans text-[10px] md:text-xs font-semibold px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow transition-all hover:shadow-md cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </div>
            ) : isDashboardView ? (
              <div className="flex-1 max-w-sm flex items-center bg-amber-50 border border-amber-200 rounded-lg py-2 px-3 gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                <span className="text-xs text-amber-900 font-medium">
                  Admin Mode On — Manage products, stock quantities, and view live client orders.
                </span>
              </div>
            ) : null}

            {/* Floating Controls / Views Selector */}
            {activeView === "home" ? (
              <div className="flex items-center justify-between sm:justify-start gap-2 md:gap-6">
                <nav className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => {
                      setActiveView("home");
                      setSearchQuery("");
                    }}
                    className={`font-sans text-xs md:text-sm font-semibold px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg transition-all ${
                      (activeView as string) === "home" 
                        ? "bg-green-50 text-green-700" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Home
                  </button>

                  <button
                    onClick={() => setActiveView("account")}
                    className="font-sans text-xs md:text-sm font-semibold px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg transition-all text-gray-600 hover:bg-gray-50 hover:text-green-700"
                  >
                    {session ? `Hi, ${session.name.split(" ")[0]}` : "My Account"}
                  </button>
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Account Icon Button */}
                  <button
                    onClick={() => setActiveView("account")}
                    className="rounded-full transition-all border shrink-0 text-[10px] md:text-xs font-bold w-8 h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer text-gray-500 bg-gray-50 border-gray-150 hover:bg-gray-100/80 hover:text-green-700"
                    title={session ? `Signed in as ${session.name}` : "Access User Custom Area"}
                  >
                    {session ? (
                      <span className="text-green-700 uppercase tracking-tight text-[10px] md:text-xs">{userInitials}</span>
                    ) : (
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>

                  {/* Shopping Cart Trigger */}
                  <button
                    onClick={() => setActiveView("cart")}
                    className="rounded-full transition-all border relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0 text-gray-500 bg-gray-50 border-gray-150 hover:bg-gray-100 hover:text-green-700"
                    title="Open Shopping Cart"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white font-sans text-[8px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-pulse shadow">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveView("home");
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs md:text-sm font-semibold px-3 py-1.5 md:py-2 rounded-lg border border-green-100 transition-all cursor-pointer shadow-xs"
                >
                  ← Back to Shop
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
