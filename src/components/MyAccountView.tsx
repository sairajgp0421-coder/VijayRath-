import { Order } from "../types";
import { User, Clock, LogOut } from "lucide-react";
import { UserSession } from "../lib/authUtils";

interface MyAccountViewProps {
  orders: Order[];
  session: UserSession | null;
  onLogout: () => void;
}

export default function MyAccountView({ orders, session, onLogout }: MyAccountViewProps) {
  const userName = session?.name || "Rahul Sharma";
  const userPhone = session?.phone || "9876543210";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Filter orders belonged to the logged-in user by cleaning and matching phone lines
  const cleanUserPhone = userPhone.replace(/\D/g, "");
  const myOrders = orders.filter((ord) => {
    const cleanOrderPhone = ord.deliveryAddress?.phone?.replace(/\D/g, "") || "";
    return cleanOrderPhone === cleanUserPhone;
  });

  return (
    <div className="flex flex-col gap-8 font-sans pb-10 text-left">
      {/* Title Header */}
      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-display font-bold text-gray-950 flex items-center gap-2">
          <User className="w-6 h-6 text-green-700" />
          My Personal Account Portal
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wider">
          Review your authentic snack purchase history and guest profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Profile */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm text-left">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-700 font-extrabold text-lg flex items-center justify-center border border-green-250">
                {initials}
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-gray-900 leading-tight">{userName}</h3>
                <p className="text-xs text-emerald-700 font-extrabold uppercase mt-0.5 tracking-wider">
                  {session?.role === "admin" ? "Master Kitchen Admin" : "Regular Culinary Guest"}
                </p>
                <p className="text-[11px] text-gray-500 mt-1 leading-none">Member active in S.S database</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4 text-xs text-gray-600 flex flex-col gap-2 font-medium">
              <div className="flex justify-between items-center">
                <span className="text-gray-450">Primary Contact:</span>
                <span className="text-gray-900 font-bold font-mono">+91 {userPhone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-450">Security Access:</span>
                <span className="text-emerald-700 capitalize text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150 font-extrabold">
                  {session?.role || "user"}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="mt-6 w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-red-200 transition-colors cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              Secure Sign Out
            </button>
          </div>
        </div>

        {/* Right Side: Historical orders list */}
        <div className="lg:col-span-8 flex flex-col gap-4 text-left">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm text-left flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-gray-500" />
              Order history & Receipts
            </h2>

            {myOrders.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs font-medium">
                No orders compiled yet! Visit Home page to add delicious snacks.
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                {myOrders.map((ord) => (
                  <div key={ord.id} className="p-4 bg-gray-50/70 border border-gray-150 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Items detail summary */}
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-gray-900 text-xs uppercase">
                          ID: {ord.id}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">{ord.date}</span>
                      </div>

                      <p className="text-[11.5px] text-gray-650 mt-1 line-clamp-1 font-semibold">
                        {ord.items.map((it) => `${it.name} (${it.weight}) x${it.quantity}`).join(", ")}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-display font-bold text-green-700">
                          ₹{ord.totalPrice}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold font-sans">
                          Payment: {ord.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Active Action control mapping */}
                    <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-2 md:pt-0">
                      {/* Active Label Status */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                          ord.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : ord.status === "Order Processed"
                            ? "bg-orange-100 text-orange-850"
                            : ord.status === "Out for Delivery"
                            ? "bg-blue-105 text-blue-900 animate-pulse"
                            : "bg-yellow-105 text-yellow-900"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
