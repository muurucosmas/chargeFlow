import { HelpCircle } from "lucide-react";

function Faq() {
  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="text-green-600" />
        Frequently Asked Questions
      </h1>

      <div className="space-y-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold">Do I need an account to find chargers?</h2>
          <p className="text-gray-600 mt-1">
            Yes. You must log in or sign up to access charging station locations.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold">Is ChargeFlow free to use?</h2>
          <p className="text-gray-600 mt-1">
            Yes, the platform is free for all users.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold">How accurate are the charging locations?</h2>
          <p className="text-gray-600 mt-1">
            Locations are updated regularly to ensure accuracy.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold">Can I save favorite charging stations?</h2>
          <p className="text-gray-600 mt-1">
            This feature is coming soon in future updates.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Faq;