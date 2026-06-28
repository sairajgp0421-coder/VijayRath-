import { Order } from "../types";
import { CheckCircle2, Clock, MapPin, ShoppingBag, ShieldCheck, Sparkles, ClipboardCheck } from "lucide-react";

interface OrderTrackingViewProps {
  order: Order;
  onContinueShopping: () => void;
}

export default function OrderTrackingView({ order, onContinueShopping }: OrderTrackingViewProps) {
  // Determine active stepper node index
  const statusStepMap = {
    "Order Confirmed": 0,
    "Order Processed": 1,
    "Out for Delivery": 2,
    Delivered: 3,
  };

  const currentStep = statusStepMap[order.status] ?? 0;

  return (
    <div className="flex flex-col gap-8 font-sans pb-10 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-3">
        <div className="text-left">
          <h1 className="text-2xl font-display font-bold text-gray-950 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-700 animate-pulse" />
            Order Registered Successfully!
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wider">
            Order Pickup ID: <strong className="text-green-700 font-bold">{order.id}</strong>
          </p>
        </div>

        <button
          onClick={onContinueShopping}
          className="px-4.5 py-2.5 bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-bold rounded-lg cursor-pointer transition-colors"
        >
          Explore More Snacks
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: status checklist and receipt card */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Pick-up Status Stepper */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-5">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Order Preparation Progress
            </h2>

            {/* Steps tracker rows */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1: Placed */}
              <div className="flex md:flex-col items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                    currentStep >= 0
                      ? "bg-green-700 text-white border-green-700 shadow"
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
                >
                  {currentStep > 0 ? "✓" : "1"}
                </div>
                <div className="text-left md:text-center flex flex-col">
                  <span className="text-xs font-bold text-gray-900 leading-normal">Order Confirmed</span>
                  <span className="text-[10px] text-gray-450 mt-0.5">{order.datePlaced.split(",")[1] || "Just now"}</span>
                </div>
              </div>

              {/* Step 2: Processed */}
              <div className="flex md:flex-col items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                    currentStep >= 1
                      ? "bg-green-700 text-white border-green-700 shadow"
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
                >
                  {currentStep > 1 ? "✓" : "2"}
                </div>
                <div className="text-left md:text-center flex flex-col">
                  <span className="text-xs font-bold text-gray-900 leading-normal">Order Processed</span>
                  <span className="text-[10px] text-gray-450 mt-0.5 font-medium text-green-700">
                    {currentStep === 1 ? "Kitchen processed" : currentStep > 1 ? "Completed" : "Awaiting processing"}
                  </span>
                </div>
              </div>

              {/* Step 3: Out for Delivery */}
              <div className="flex md:flex-col items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                    currentStep >= 2
                      ? "bg-green-700 text-white border-green-700 shadow"
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
                >
                  {currentStep > 2 ? "✓" : "3"}
                </div>
                <div className="text-left md:text-center flex flex-col">
                  <span className="text-xs font-bold text-gray-900 leading-normal">Out for Delivery</span>
                  <span className="text-[10px] text-gray-450 mt-0.5 font-medium text-green-700">
                    {currentStep === 2 ? "Agent en route!" : currentStep > 2 ? "Completed" : "Awaiting pickup"}
                  </span>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex md:flex-col items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                    currentStep >= 3
                      ? "bg-green-700 text-white border-green-700 shadow"
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
                >
                  {currentStep === 3 ? "✓" : "4"}
                </div>
                <div className="text-left md:text-center flex flex-col">
                  <span className="text-xs font-bold text-gray-900 leading-normal">Delivered</span>
                  <span className="text-[10px] text-gray-450 mt-0.5 font-medium">
                    {currentStep === 3 ? "Handed over safely ✓" : "Pending arrival"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Guidelines Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-700" />
              Pickup Instructions & Store Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-green-100 bg-green-50/50 p-4 rounded-xl text-xs flex flex-col gap-2">
                <span className="font-extrabold text-green-950 uppercase tracking-wider text-[10px]">
                  VijayRath Namkeen & Bakery
                </span>
                <p className="text-gray-800 font-medium leading-relaxed">
                  Shop No. 1, Vaishnovi Garden View, Opp. Shaligram Lake View, Khoraj, Gandhinagar, Gujarat, India.
                </p>
                <div className="flex items-center gap-1.5 text-gray-500 font-bold mt-1 text-[10px]">
                  <Clock className="w-3.5 h-3.5 text-green-700" />
                  <span>Open Hours: 10:00 AM - 10:00 PM</span>
                </div>
              </div>

              <div className="border border-gray-150 p-4 rounded-xl text-xs flex flex-col gap-2 bg-gray-50/55">
                <span className="font-extrabold text-gray-700 uppercase tracking-wider text-[10px]">
                  Guidelines & Food Safety
                </span>
                <ul className="list-disc pl-4 text-gray-600 space-y-1.5">
                  <li>Show the order pickup ID <strong>{order.id}</strong> at the retrieval desk.</li>
                  <li>All foods are packed fresh in travel-safe eco-friendly insulation bags.</li>
                  <li>Green coriander-mint chutney and sweet tamarind dips included!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Receipt Breakdown */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3.5 text-xs">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider text-left border-b border-gray-50 pb-2.5 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-green-700" />
              Receipt Summary
            </h3>

            <div className="flex flex-col gap-3 text-left">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between font-medium">
                  <div className="flex flex-col">
                    <span className="text-gray-850 font-bold">{it.name}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                      Variant {it.weight} &bull; Qty {it.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">₹{it.price * it.quantity}</span>
                </div>
              ))}

              <div className="border-t border-gray-100 pt-3 flex justify-between items-end">
                <span className="font-bold text-gray-800 col-span-2">Total Amount Paid</span>
                <span className="text-md font-display font-black text-green-700">₹{order.totalPrice}</span>
              </div>
            </div>

            {/* Recipient info & preparation comments */}
            <div className="mt-2.5 pt-3 border-t border-gray-100 text-left text-gray-500 font-medium flex flex-col gap-1.5">
              <div>
                <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider block mb-0.5">
                  Recipient Contact
                </span>
                <p className="text-xs font-semibold text-gray-950 leading-tight">
                  {order.deliveryAddress.name} ({order.deliveryAddress.phone})
                </p>
              </div>

              <div>
                <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider block mb-0.5">
                  Special Notes & Branch
                </span>
                <p className="text-[11px] leading-snug text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-100">
                  {order.deliveryAddress.details}
                </p>
              </div>

              <div className="flex items-center gap-1 justify-center text-[10px] text-gray-400 border-t border-gray-50 pt-3 mt-1">
                <ShieldCheck className="w-4 h-4 text-green-700" />
                <span>Ready for convenient in-store handout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
