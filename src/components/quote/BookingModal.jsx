import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_0jbdzoj";
const INTERNAL_TEMPLATE_ID = "template_s2gi2s6";
const CLIENT_TEMPLATE_ID = "template_wh2qjax";
const PUBLIC_KEY = "xCgcapOUZtxZ-3G9C";

export default function BookingModal({
  open,
  onClose,
  dates,
  pkg,
  services,
  total,
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const serviceText =
    services && services.length
      ? services.join(", ")
      : "None";

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
        dates: dates?.join(", ") || "N/A",
        package: pkg,
        services: serviceText,
        total,
      };

      // INTERNAL EMAIL
      await emailjs.send(
        SERVICE_ID,
        INTERNAL_TEMPLATE_ID,
        payload,
        PUBLIC_KEY
      );

      // CLIENT EMAIL
      await emailjs.send(
        SERVICE_ID,
        CLIENT_TEMPLATE_ID,
        payload,
        PUBLIC_KEY
      );

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 md:p-8 shadow-2xl relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {!success ? (
          <>
            <h2 className="text-2xl font-semibold mb-2">
              Lock Your Dates
            </h2>

            <p className="text-gray-600 mb-6">
              Enter your information below and we’ll place your dates on a 48-hour soft hold.
            </p>

            <form onSubmit={submit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                name="notes"
                placeholder="Project details / notes (optional)"
                rows="4"
                value={form.notes}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF7A2E] hover:bg-[#F25F00] text-white py-3 rounded-xl font-semibold transition-all"
              >
                {loading ? "Sending..." : "Confirm Soft Hold"}
              </button>

            </form>
          </>
        ) : (
          <div className="text-center py-6">

            <div className="text-5xl mb-4">
              ✅
            </div>

            <h2 className="text-2xl font-semibold mb-3">
              Dates Soft Held
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Your requested dates are now on a 48-hour soft hold.
              A confirmation email has been sent and someone from Waxwing On Set will contact you shortly.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}