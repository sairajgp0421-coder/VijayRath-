import { ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin } from "lucide-react";
import { ViewType } from "../types";

interface FooterProps {
  setActiveView: (view: ViewType) => void;
  setSelectedCategory?: (category: "all" | "farsan" | "sweets" | "dryfruits" | "namkeen") => void;
  onAdminClick?: () => void;
}

export default function Footer({ setActiveView, setSelectedCategory, onAdminClick }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800 font-sans">
      {/* Guarantees bar */}
      <div className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">100% Secure Payments</h4>
              <p className="text-xs text-gray-500">Trusted gateways with UPI & Card protect</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Truck className="w-6 h-6 text-green-500 shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">Fresh & Rapid Delivery</h4>
              <p className="text-xs text-gray-500">Carefully handpacked & dispatched fast</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-green-500 shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">Easy Returns & Refunds</h4>
              <p className="text-xs text-gray-500">Refunded instantly into wallet balances</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        {/* About column */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">
            VijayRath Namkeen & Bakery
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Bridging premium Gujarati culinary heritage with clean, high-trust digital solutions. Made with authentic hand-ground spices and organic ingredients in hygiene-certified kitchens.
          </p>
        </div>

        {/* Categories links */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wide">Category Menu</h4>
          <ul className="text-sm flex flex-col gap-2">
            <li>
              <button
                onClick={() => {
                  if (setSelectedCategory) setSelectedCategory("farsan");
                  setActiveView("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-green-400 transition-colors cursor-pointer text-left focus:outline-none"
              >
                Farsan
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (setSelectedCategory) setSelectedCategory("namkeen");
                  setActiveView("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-green-400 transition-colors cursor-pointer text-left focus:outline-none"
              >
                Namkeen
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (setSelectedCategory) setSelectedCategory("sweets");
                  setActiveView("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-green-400 transition-colors cursor-pointer text-left focus:outline-none"
              >
                Sweets
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (setSelectedCategory) setSelectedCategory("dryfruits");
                  setActiveView("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-green-400 transition-colors cursor-pointer text-left focus:outline-none"
              >
                Dryfruite
              </button>
            </li>
          </ul>
        </div>

        {/* Corporate Policies */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wide">Customer Policies</h4>
          <ul className="text-sm text-gray-400 flex flex-col gap-2">
            <li>
              <button
                onClick={() => {
                  setActiveView("terms");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-green-400 transition-colors cursor-pointer text-left focus:outline-none"
              >
                Terms & Conditions
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("privacy");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-green-400 transition-colors cursor-pointer text-left focus:outline-none"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <a href="#" className="hover:text-green-400 transition-colors">
                Shipping & Delivery Code
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveView("refund");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-green-400 transition-colors cursor-pointer text-left focus:outline-none"
              >
                Cancellation & Refund policy
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (onAdminClick) {
                    onAdminClick();
                  } else {
                    setActiveView("login");
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-purple-400 transition-colors cursor-pointer text-left focus:outline-none flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-800 text-xs font-semibold text-gray-400"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Staff & Admin Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Contact/Support */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wide">Humble Support</h4>
          <ul className="text-sm text-gray-400 flex flex-col gap-3">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500 shrink-0" />
              <span>+91 63551 41378</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-500 shrink-0" />
              <span className="break-all">info@vijayrath.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>
                Shop No. 1, Vaishnovi Garden View,<br />
                Opp. Shaligram Lake View, Khoraj,<br />
                Gandhinagar, Gujarat, India.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-950 py-6 border-t border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 VijayRath Namkeen & Bakery. All rights reserved.</p>
          <p className="flex items-center gap-1.5 justify-center">
            Designed for <strong className="text-white">Premium Heritage Kitchen</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
