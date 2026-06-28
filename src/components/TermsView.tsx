import { ArrowLeft, FileText, Phone, MapPin } from "lucide-react";

interface TermsViewProps {
  onBack: () => void;
}

export default function TermsView({ onBack }: TermsViewProps) {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10 font-sans">
      {/* Header back button area */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors font-medium text-sm border border-gray-200 hover:border-green-600 rounded-lg px-3.5 py-2 bg-white cursor-pointer shadow-2xs"
          id="terms-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>
        <span className="text-xs text-gray-400 font-mono">Last Updated: June 2026</span>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm text-left flex flex-col gap-8">
        <div className="flex items-center gap-3.5 border-b border-gray-50 pb-5">
          <div className="bg-green-50 p-2.5 rounded-xl">
            <FileText className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-gray-950 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-500 font-sans mt-0.5">VijayRath Namkeen & Bakery</p>
          </div>
        </div>

        {/* Welcome message */}
        <div className="bg-green-50/55 border border-green-100 p-5 rounded-xl text-green-900 text-sm leading-relaxed font-medium">
          Welcome to VijayRath Namkeen & Bakery. By accessing and using our website, you agree to follow and be bound by the dynamic Terms & Conditions listed below.
        </div>

        {/* Section List */}
        <div className="flex flex-col gap-6">
          {/* Section 1 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              By using this website, you agree to comply with these Terms & Conditions. If you do not agree, please do not use our services.
            </p>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">2</span>
              Products & Pricing
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed pl-7 flex flex-col gap-1.5 list-disc">
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                All product prices are displayed in Indian Rupees (₹).
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                Prices may change without prior notice.
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                Product availability is subject to stock availability.
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                Images shown are for representation purposes and may slightly differ from actual products.
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">3</span>
              Orders
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed pl-7 flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                Orders are confirmed only after successful payment or confirmation from our team.
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                We reserve the right to cancel or refuse any order for any reason.
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                Incorrect customer details may result in delivery delays or cancellation.
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">4</span>
              Delivery
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed pl-7 flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                Delivery timelines are estimates and may vary due to unforeseen circumstances.
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                Customers must provide accurate delivery details.
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 shrink-0 mt-1">✓</span>
                Delivery charges, if applicable, will be displayed during checkout.
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">5</span>
              Returns & Refunds
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed pl-7 flex flex-col gap-2">
              <p className="font-semibold text-gray-800">
                Due to the perishable nature of food products, returns are generally not accepted.
              </p>
              <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-3 text-amber-900 text-xs flex flex-col gap-1.5">
                <span className="font-bold underline uppercase tracking-wider block mb-1">Refunds may be issued only if:</span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  <span>Wrong product is delivered.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  <span>Product is damaged during delivery.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  <span>Order cannot be fulfilled by us.</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Refunds will be processed according to our refund policy.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">6</span>
              User Responsibilities
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed pl-7 flex flex-col gap-1.5">
              <span className="font-semibold text-gray-800 block">Users agree not to:</span>
              <div className="flex items-start gap-2">
                <span className="text-red-500 shrink-0 mt-1">✗</span>
                Use the website for unlawful purposes.
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500 shrink-0 mt-1">✗</span>
                Attempt unauthorized access to website systems.
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500 shrink-0 mt-1">✗</span>
                Provide false or misleading information.
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">7</span>
              Intellectual Property
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              All website content including logos, text, images, designs, and graphics are the property of <strong className="text-gray-900">VijayRath Namkeen & Bakery</strong> and may not be copied or reproduced without permission.
            </p>
          </div>

          {/* Section 8 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">8</span>
              Limitation of Liability
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              We shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.
            </p>
          </div>

          {/* Section 9 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">9</span>
              Modifications
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              We reserve the right to modify these Terms & Conditions at any time without prior notice.
            </p>
          </div>

          {/* Section 10 */}
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">10</span>
              Governing Law
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India.
            </p>
          </div>

          {/* Section 11 */}
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-5 mt-3">
            <h2 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">11</span>
              Contact Information
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed pl-7 flex flex-col gap-3 py-1">
              <p className="font-bold text-gray-900">VijayRath Namkeen & Bakery</p>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                <span>
                  Shop No. 1, Vaishnovi Garden View,<br />
                  Opp. Shaligram Lake View, Khoraj, Gandhinagar, Gujarat, India.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-green-700 shrink-0" />
                <span>Mobile: +91 6355141378</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary bottom return */}
      <div className="flex justify-center pt-2">
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
