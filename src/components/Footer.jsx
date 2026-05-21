import { Link } from "react-router-dom";
import { ShieldCheck, Phone, HelpCircle } from "lucide-react";

const links = [
  { to: "/privacy", label: "Privacy", icon: ShieldCheck },
  { to: "/contacts", label: "Contacts", icon: Phone },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-16 border-t bg-white">
      <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-gray-500 text-sm text-center md:text-left">
          © {year} ChargeFlow. All rights reserved.
        </p>

        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

      </div>
    </footer>
  );
}

export default Footer;