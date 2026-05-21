import { Phone, Mail, MapPin } from "lucide-react";

function Contacts() {
  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="space-y-4 bg-white p-6 rounded-xl shadow">

        <p className="flex items-center gap-2">
          <Phone className="text-green-600" />
          +254 700 000 000
        </p>

        <p className="flex items-center gap-2">
          <Mail className="text-green-600" />
          support@chargeflow.com
        </p>

        <p className="flex items-center gap-2">
          <MapPin className="text-green-600" />
          Nairobi, Kenya
        </p>

      </div>
    </div>
  );
}

export default Contacts;