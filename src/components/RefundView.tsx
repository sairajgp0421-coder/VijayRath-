import { ArrowLeft, RefreshCw, Phone, MapPin, AlertCircle, Clock, CreditCard, Ban } from "lucide-react";

interface RefundViewProps {
  onBack: () => void;
}

export default function RefundView({ onBack }: RefundViewProps) {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10 font-sans animate-fade-in text-left">
      {/* Header back button area */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors font-medium text-sm border border-gray-200 hover:border-green-600 rounded-lg px-3.5 py-2 bg-white cursor-pointer shadow-2xs animate-fade-in"
          id="refund-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>
        <span className="text-xs text-gray-400 font-mono">Last Updated: June 2026</span>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm flex flex-col gap-8 animate-fade-in">
        <div className="flex items-center gap-3.5 border-b border-gray-50 pb-5">
          <div className="bg-green-50 p-2.5 rounded-xl">
            <RefreshCw className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-gray-950 tracking-tight">
              Cancellation & Refund Policy
            </h1>
            <p className="text-sm text-gray-500 font-sans mt-0.5">VijayRath Namkeen & Bakery</p>
          </div>
        </div>

        {/* Welcome introductory banner */}
        <div className="bg-green-50/55 border border-green-100 p-5 rounded-xl text-green-900 text-sm leading-relaxed font-medium">
          At VijayRath Namkeen & Bakery, customer satisfaction is our top priority. Please read our cancellation and refund policy carefully before placing an order.
        </div>

        {/* Policy Sections */}
        <div className="flex flex-col gap-8">
          
          {/* Order Cancellation */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-700" />
              Order Cancellation
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed pl-7 flex flex-col gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                <span>Orders can be cancelled within <strong>30 minutes</strong> of placement or before the order has been processed for preparation and dispatch.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold shrink-0 mt-0.5">✗</span>
                <span>Once an order has been prepared, packed, or shipped, cancellation requests may not be accepted due to perishable material safety.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                <span>To request a cancellation, please contact our customer support team immediately.</span>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-green-700" />
              Refund Policy
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              Refunds will be provided <strong>only</strong> in the following specific situations:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-7 mt-1">
              {[
                { title: "Wrong Product Delivered", desc: "A item other than what was requested is sent." },
                { title: "Damaged Package on Delivery", desc: "Product freshness or sealing was visibly impaired during shipping." },
                { title: "Unfulfilled Orders by Us", desc: "Any unexpected stock constraints preventing order dispatch of selected delicacies." },
                { title: "Unprocessed Paid Orders", desc: "A successful digital payment was captured, but the reservation has failed to process." }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-3">
                  <span className="bg-green-100 text-green-800 text-xs font-mono font-bold w-5 h-5 mt-0.5 flex items-center justify-center rounded-full shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-gray-900">{item.title}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Refundable Items */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-600" />
              Non-Refundable Items
            </h2>
            <div className="pl-7">
              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-4 text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Perishable Del delicacies Rule</p>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Due to the highly perishable nature of sweets, heritage bakery items, traditional snacks, and namkeen products, refunds or returns are <strong>not available</strong> for products that have been successfully delivered to you in good condition.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Processing */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-700" />
              Refund Processing
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed pl-7 flex flex-col gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                <span>Approved refunds will be automatically processed back to your original payment method (Credit card, Debit card, or UPI) within <strong>5–7 business days</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                <span>Please note that final bank ledger update timelines may slightly vary in accordance with your local bank or secure payment provider guidelines.</span>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-5 border-t border-gray-100 pt-5 mt-3 pl-7">
            <div>
              <h3 className="text-base font-bold text-gray-950 font-display">Contact Us</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                For any cancellation or refund-related queries, please do not hesitate to reach our team immediately:
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="font-bold text-gray-950">VijayRath Namkeen & Bakery</p>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-green-700 shrink-0" />
                <span>Mobile: +91 6355141378</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Persistent Bottom Return Button */}
      <div className="flex justify-center pt-2 animate-fade-in">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Shopping
        </button>
      </div>
    </div>
  );
}
