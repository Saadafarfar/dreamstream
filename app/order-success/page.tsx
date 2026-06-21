import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-6">

      <div className="max-w-2xl text-center bg-slate-900 border border-slate-800 rounded-3xl p-10">

        <div className="text-6xl mb-4">✅</div>

        <h1 className="text-4xl font-bold mb-4">
          Order Received
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Thank you for your request.
          We have received your information and will contact you shortly on
          WhatsApp or by email.
        </p>

        <div className="bg-green-500/10 border border-green-500 rounded-xl p-4 mb-8">
          Typical response time: less than 1 hour.
        </div>

        <a
          href="https://wa.me/YOURWHATSAPPNUMBER"
          target="_blank"
          className="block w-full bg-green-600 hover:bg-green-700 rounded-xl py-4 font-semibold mb-4"
        >
          Contact Us on WhatsApp
        </a>

        <Link
          href="/"
          className="block w-full border border-slate-700 rounded-xl py-4 hover:bg-slate-800"
        >
          Back to Home
        </Link>

      </div>

    </main>
  );
}