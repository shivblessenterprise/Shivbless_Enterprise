"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ADMIN_SESSION_KEY, verifyAdminPassword } from "@/lib/admin";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "1") {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="container-premium flex min-h-[70vh] items-center justify-center py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 shadow-card"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          Admin
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink-900">
          Product Management
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Sign in to add, edit, and organise catalogue products. Data is stored
          locally for now and can later connect to Firebase, Supabase, or an API.
        </p>

        <label htmlFor="admin-password" className="mt-6 block text-sm font-medium">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
          autoComplete="current-password"
          required
        />
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="mt-5 w-full" size="lg">
          Sign In
        </Button>
      </form>
    </div>
  );
}
