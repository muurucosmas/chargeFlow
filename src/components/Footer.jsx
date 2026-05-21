import { Link } from "react-router-dom";
import { ShieldCheck, Phone, HelpCircle } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full mt-16 border-t bg-white">

      <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left */}
        <p className="text-gray-500 text-sm text-center md:text-left">
          © {new Date().getFullYear()} ChargeFlow. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">

          <Link
            to="/privacy"
            className="flex items-center gap-1 text-gray-700 hover:text-green-600"
          >
            <ShieldCheck size={16} />
            Privacy
          </Link>

          <Link
            to="/contacts"
            className="flex items-center gap-1 text-gray-700 hover:text-green-600"
          >
            <Phone size={16} />
            Contacts
          </Link>

          <Link
            to="/faq"
            className="flex items-center gap-1 text-gray-700 hover:text-green-600"
          >
            <HelpCircle size={16} />
            FAQ
          </Link>

        </div>

      </div>
    </footer>
  );
}

export default Footer;