"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/lib/firebase/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox for further instructions");
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-2">Reset Password</h3>
      <p className="text-sm text-neutral-400 mb-6">Enter your email and we will send you a link to reset your password.</p>
      
      {error && <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}
      {message && <div className="mb-4 text-sm text-green-500 bg-green-500/10 p-3 rounded-md border border-green-500/20">{message}</div>}

      <form className="space-y-6" onSubmit={handleResetPassword}>
        <div>
          <label className="block text-sm font-medium text-neutral-300">Email address</label>
          <div className="mt-1">
            <input
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-neutral-700 rounded-md shadow-sm placeholder-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-neutral-800 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-400">
        <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">
          Back to login
        </Link>
      </div>
    </div>
  );
}
