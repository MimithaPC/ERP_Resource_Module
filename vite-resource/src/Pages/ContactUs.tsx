import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const ContactUs: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    from_name: "",
    reply_to: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    emailjs.init("MWmQ6qXJomtTyucmT"); // Replace with your actual EmailJS public key
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.from_name || !form.reply_to || !form.message) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");

    emailjs
      .send("service_d10us7h", "template_bz5jgpj", form)
      .then(() => {
        setSent(true);
        setForm({ from_name: "", reply_to: "", message: "" });
      })
      .catch((err) => {
        console.error("Failed to send message:", err);
        setError("Something went wrong. Please try again later.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full space-y-6">
        {!showForm ? (
          <>
            <h1 className="text-3xl font-bold text-center text-blue-700">Contact Us</h1>
            <p className="text-center text-gray-600">
              Get in touch with ERP Building Construction. We're here to help you with all your building solutions!
            </p>

            <div className="space-y-4 text-gray-700">
              <div>
                <h2 className="font-semibold">Address:</h2>
                <p>
                  No. 45, Lotus Road, Colombo 01,<br /> Western Province,<br /> Sri Lanka
                </p>
              </div>

              <div>
                <h2 className="font-semibold">Phone:</h2>
                <p>+94 11 234 5678</p>
              </div>

              <div>
                <h2 className="font-semibold">Email:</h2>
                <p>shamperera1996@gmail.com</p>
              </div>

              <div>
                <h2 className="font-semibold">Working Hours:</h2>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="text-center">
              <button
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                onClick={() => setShowForm(true)}
              >
                Send Message
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-600 text-center">Send Us a Message</h2>

            <input
              type="text"
              name="from_name"
              placeholder="Your Name"
              value={form.from_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="reply_to"
              placeholder="Your Email"
              value={form.reply_to}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />

            {error && <p className="text-red-500">{error}</p>}

            {sent && (
              <p className="text-green-600 font-semibold text-center">
                ✅ Your message has been sent successfully!
              </p>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={() => setShowForm(false)}
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
