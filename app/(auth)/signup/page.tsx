"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/app/lib/firebase/config";
import { useAuth } from "@/app/hooks/useAuth";
import { useAppStore, UserRole } from "@/app/store/useAppStore";

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const setPendingRole = useAppStore((state) => state.setPendingRole);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Set the intended role in the global store before creating the user
      // so the auth listener in useAuth.ts can pick it up.
      setPendingRole(role);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // The useAuth hook will now automatically create the user document with the selected role
      // Redirection is now handled by the useEffect above
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6">Create a new account</h3>
      
      {error && <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}

      <form className="space-y-6" onSubmit={handleSignup}>
        <div>
          <label className="block text-sm font-medium text-neutral-300">Full Name</label>
          <div className="mt-1">
            <input
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-neutral-700 rounded-md shadow-sm placeholder-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-neutral-800 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-neutral-300">Select Role</label>
          <div className="mt-1">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="appearance-none block w-full px-3 py-2 border border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-neutral-800 text-white"
            >
              <option value="citizen">Citizen</option>
              <option value="department_admin">Department Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">
          Sign in
        </Link>
      </div>
    </div>
  );
}
