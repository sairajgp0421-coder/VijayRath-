import { useState, useMemo, FormEvent, useEffect } from "react";
import { CartItem, Order } from "../types";
import { ArrowLeft, Landmark, Wallet, ShieldCheck, Sparkles } from "lucide-react";
import { UserSession } from "../lib/authUtils";

interface CheckoutViewProps {
  cart: CartItem[];
  appliedDiscountPercent: number;
  couponCode: string;
  onPlaceOrder: (newOrder: Order, isWalletPayment: boolean, finalCost: number) => void;
  onBackToCart: () => void;
  session: UserSession | null;
}

export default function CheckoutView({
  cart,
  appliedDiscountPercent,
  couponCode,
  onPlaceOrder,
  onBackToCart,
  session,
}: CheckoutViewProps) {
  // Shipping Input Forms initialized with session if logged in
  const [shippingName, setShippingName] = useState<string>(() => session?.name || "Rahul Sharma");
  const [shippingPhone, setShippingPhone] = useState<string>(() => session?.phone || "9876543210");
  const [shippingAddress, setShippingAddress] = useState<string>(
    "B-402, Green Valley Apartments, Opposite Central Park, Andheri East, Mumbai, Maharashtra 400069"
  );

  // Sync shipping info if the session is loaded or changed
  useEffect(() => {
    if (session) {
      setShippingName(session.name);
      setShippingPhone(session.phone);
    }
  }, [session]);

  // Payment Options
  const [paymentMode, setPaymentMode] = useState<"cod" | "upi">("upi");
  const [isPlacing, setIsPlacing] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const FREE_SHIPPING_THRESHOLD = 500;

  // Pricing calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.priceForWeight * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((subtotal * appliedDiscountPercent) / 100);
  }, [subtotal, appliedDiscountPercent]);

  const deliveryFee = 0;
  const grandTotal = subtotal - discountAmount;

  const handleCompleteOrder = (e: FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!shippingName.trim() || !shippingPhone.trim()) {
      setErrorText("Please complete your name and contact phone number before finalizing.");
      return;
    }

    setIsPlacing(true);

    // Simulate cooking/packing transport connection
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const dateFormatted = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
      const timeFormatted = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      const finalOrder: Order = {
        id: orderId,
        date: dateFormatted,
        datePlaced: `${dateFormatted}, ${timeFormatted}`,
        items: cart.map((item) => ({
          name: item.product.name,
          weight: item.selectedWeight,
          quantity: item.quantity,
          price: item.priceForWeight,
        })),
        totalPrice: grandTotal,
        status: "Order Confirmed",
        deliveryAddress: {
          name: shippingName,
          phone: shippingPhone,
          details: shippingAddress || "Pickup Order",
        },
        paymentMethod:
          paymentMode === "cod"
            ? "Cash on Delivery"
            : "UPI (Google Pay)",
      };

      onPlaceOrder(finalOrder, false, grandTotal);
      setIsPlacing(false);
    }, 1500); // Sleek loading time
  };

  return (
    <div className="flex flex-col gap-8 font-sans pb-10 text-left">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
        <button
          onClick={onBackToCart}
          className="p-1.5 text-gray-500 hover:text-green-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          title="Back to Cart"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl md:text-2xl font-display font-bold text-gray-950">
          Storefront Pick-up & Secure Cashier Checkout
        </h1>
      </div>

      <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: address and payments */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Pick-up details */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              1. Contact Information for Store Pickup
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 font-bold font-sans">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="bg-gray-50 border border-gray-200 focus:bg-white rounded-lg py-2.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700"
                  id="shipping-name-input"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 font-bold font-sans">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="bg-gray-50 border border-gray-200 focus:bg-white rounded-lg py-2.5 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700"
                  id="shipping-phone-input"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-gray-500 font-bold font-sans">Special Cooking Instructions & Pickup Comments (Optional)</label>
              <textarea
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Specify spice preferences, custom roasting limits, or expected pickup time..."
                className="bg-gray-50 border border-gray-200 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700"
                id="shipping-address-input"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              2. Choose Payment Mode
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMode("upi")}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  paymentMode === "upi"
                    ? "border-green-600 bg-green-50/50 text-green-950"
                    : "border-gray-150 hover:border-gray-300"
                }`}
              >
                <Landmark className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-900">UPI Instant Apps</span>
                  <span className="text-[10px] text-gray-500">Google Pay, PhonePe, or Paytm</span>
                </div>
              </button>

              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMode("cod")}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  paymentMode === "cod"
                    ? "border-green-600 bg-green-50/50 text-green-950"
                    : "border-gray-150 hover:border-gray-300"
                }`}
              >
                <Wallet className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-900">Cash on Delivery</span>
                  <span className="text-[10px] text-gray-500">Hand some cash to deliverer upon food arrival</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: billing summaries and checkout action */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Purchase Items Summary
            </h3>

            {/* List items briefly */}
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto divide-y divide-gray-50 pr-1 select-none">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs py-2">
                  <div className="text-left">
                    <span className="font-bold text-gray-800">{item.product.name}</span>
                    <p className="text-[10px] text-gray-400">
                      Variant: {item.selectedWeight} &bull; Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-gray-750">
                    ₹{item.priceForWeight * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3.5 text-xs">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              {appliedDiscountPercent > 0 && (
                <div className="flex justify-between font-bold text-green-700">
                  <span>Coupon Deduction</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="border-t border-gray-150 pt-3.5 flex justify-between items-end">
                <span className="text-xs font-bold text-gray-800">Grand Total Payable</span>
                <span className="text-xl font-display font-extrabold text-green-700">₹{grandTotal}</span>
              </div>
            </div>

            {errorText && (
              <div className="bg-red-50 border border-red-200 text-red-750 p-3 rounded-lg text-xs font-semibold leading-normal">
                {errorText}
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isPlacing}
              className={`w-full bg-green-700 hover:bg-green-800 text-white font-sans text-sm font-bold py-3.5 rounded-xl transition-all shadow hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5 ${
                isPlacing ? "opacity-75 cursor-wait" : ""
              }`}
            >
              {isPlacing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Food Transfer...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-pulse shrink-0" />
                  <span>Place Culinary Order &bull; ₹{grandTotal}</span>
                </div>
              )}
            </button>

            <div className="flex items-center gap-1 justify-center text-[10px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
              <span>Checked and secured with food safety guarantees</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
