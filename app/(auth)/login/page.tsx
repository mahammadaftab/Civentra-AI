"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase/config";
import { useAuth } from "@/app/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "super_admin") {
        router.push("/admin");
      } else if (user.role === "department_admin") {
        router.push("/department");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection is now handled by the useEffect above
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      // Redirection is now handled by the useEffect above
    } catch (err: any) {
      setError(err.message || "Failed to login with Google.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6">Sign in to your account</h3>
      
      {error && <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}

      <form className="space-y-6" onSubmit={handleEmailLogin}>
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
          <label className="block text-sm font-medium text-neutral-300">Password</label>
          <div className="mt-1">
            <input
              type="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-neutral-700 rounded-md shadow-sm placeholder-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-neutral-800 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-blue-500 hover:text-blue-400">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-neutral-900 text-neutral-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-neutral-700 rounded-md shadow-sm text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-colors"
          >
            Google
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-blue-500 hover:text-blue-400">
          Sign up
        </Link>
      </div>
    </div>
  );
}
