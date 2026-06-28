import { useState, useMemo, FormEvent } from "react";
import { CartItem, Coupon } from "../types";
import { Search, ShoppingBag, Trash2, Tag, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface CartViewProps {
  cart: CartItem[];
  onUpdateCartQty: (productId: string, weight: string, quantity: number) => void;
  onRemoveCartItem: (productId: string, weight: string) => void;
  onProceedToCheckout: (appliedDiscountPercent: number, couponCode: string) => void;
  onContinueShopping: () => void;
  coupons: Coupon[];
}

export default function CartView({
  cart,
  onUpdateCartQty,
  onRemoveCartItem,
  onProceedToCheckout,
  onContinueShopping,
  coupons,
}: CartViewProps) {
  const [couponInput, setCouponInput] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>("");

  const FREE_SHIPPING_THRESHOLD = 500;

  // Calculators
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.priceForWeight * item.quantity, 0);
  }, [cart]);

  // Pickup configuration
  const deliveryFee = 0;

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
  }, [subtotal, appliedCoupon]);

  const grandTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const targetCode = couponInput.trim().toUpperCase();
    if (!targetCode) return;

    const matched = coupons.find((c) => c.code === targetCode);
    if (matched) {
      setAppliedCoupon(matched);
      setCouponInput("");
    } else {
      const activeCodes = coupons.map(c => c.code).join(", ");
      setCouponError(`Invalid coupon code! Active codes: ${activeCodes || "None available"}`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <div className="flex flex-col gap-8 font-sans pb-10 text-left">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-display font-bold text-gray-950 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-green-700 hover:scale-110 transition-transform" />
          Selected Shopping Cart
        </h1>
        <button
          onClick={onContinueShopping}
          className="text-xs text-green-700 hover:text-green-800 font-bold uppercase tracking-wider"
        >
          Continue Shopping
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm max-w-lg mx-auto w-full my-6">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100 text-gray-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-display font-bold text-gray-800 mb-2"> Your Food Cart is Empty</h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed max-w-sm mx-auto">
            You haven't added any fresh khamans, spiced crispy gathiyas, sweet pure ghee jalebis, or organic vegetables yet.
          </p>
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5"
          >
            Explore Snacks & Farsans
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Block - Items list */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Cart products Mapping */}
            <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100 overflow-hidden shadow-sm">
              {cart.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Photo & description */}
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="text-left">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 font-semibold uppercase">
                          Pack: {item.selectedWeight}
                        </span>
                        <span className="text-[10px] bg-green-50 text-green-800 font-bold px-1.5 rounded py-0.5">
                          ₹{item.priceForWeight} per pack
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Actions & Price controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden shadow-mini">
                      <button
                        onClick={() => onUpdateCartQty(item.product.id, item.selectedWeight, item.quantity - 1)}
                        className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 font-black text-xs h-8 focus:outline-none"
                      >
                        -
                      </button>
                      <span className="px-3 text-gray-800 font-sans text-xs font-bold bg-green-50/50 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateCartQty(item.product.id, item.selectedWeight, item.quantity + 1)}
                        className="px-2.5 py-1 text-green-700 hover:bg-gray-100 font-black text-xs h-8 focus:outline-none"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-display font-bold text-gray-950 w-20 text-right">
                        ₹{item.priceForWeight * item.quantity}
                      </span>

                      <button
                        onClick={() => onRemoveCartItem(item.product.id, item.selectedWeight)}
                        className="p-1.5 text-gray-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Billing summaries & Promo coupons */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Coupon Promotion Block */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col gap-3">
              <h3 className="text-xs font-bold text-gray-850 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-green-700" /> Apply Coupon Code
              </h3>

              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs font-extrabold text-green-800">
                      Code applied: {appliedCoupon.code}
                    </span>
                    <p className="text-[10px] text-green-700 font-medium">
                      {appliedCoupon.description} &bull; Save {appliedCoupon.discountPercent}%!
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError("");
                    }}
                    placeholder="Enter code e.g. FARSAN20"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                    id="coupon-input-field"
                  />
                  <button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && <span className="text-[10px] text-red-600 font-bold leading-none">{couponError}</span>}

              {/* Show available prompts */}
              {!appliedCoupon && (
                <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-150 flex flex-col gap-1 text-[10px] text-gray-500">
                  <span className="font-bold text-gray-700 uppercase tracking-wider">Available Codes to Try:</span>
                  <span>&bull; <strong className="text-gray-700">FARSAN20</strong>: Save 20% flat on food items</span>
                  <span>&bull; <strong className="text-gray-700">SWEETS10</strong>: Save 10% flat on lovely sweets</span>
                  <span>&bull; <strong className="text-gray-700">FESTIVE</strong>: Save 15% flat during festive active times</span>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-bold text-gray-850 uppercase tracking-wider mb-1">
                Order Billing breakdown
              </h3>

              <div className="flex flex-col gap-3 text-xs text-gray-600">
                <div className="flex justify-between font-medium">
                  <span>Cart Items Subtotal</span>
                  <span className="text-gray-850 font-bold">₹{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between font-bold text-green-700 bg-green-50 px-2 py-1.5 rounded-md">
                    <span>Coupon Reward ({appliedCoupon.discountPercent}%)</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium">
                  <span>Est. Central & State GST (incl.)</span>
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wide">Included</span>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-4 flex justify-between items-end">
                <span className="text-xs font-bold text-gray-800">Grand Payable total</span>
                <span className="text-2xl font-display font-extrabold text-green-700">₹{grandTotal}</span>
              </div>

              <button
                onClick={() => onProceedToCheckout(appliedCoupon?.discountPercent || 0, appliedCoupon?.code || "")}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 justify-center text-[11px] text-gray-400 mt-1">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span>Encrypted secure merchant transfer</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
