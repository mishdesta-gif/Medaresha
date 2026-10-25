"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@medaresha.com");
  const [password, setPassword] = React.useState("••••••••••••");
  const [selectedRole, setSelectedRole] = React.useState("owner");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  const handleRoleQuickSelect = (roleName: string, roleEmail: string) => {
    setSelectedRole(roleName);
    setEmail(roleEmail);
    setPassword("SecureStaff2026!");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Branding */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl tracking-[0.25em] text-olive font-medium">
              MEDARESHA
            </span>
          </Link>
          <span className="block text-[11px] uppercase tracking-[0.3em] text-botanical font-medium mt-1">
            Property Management Suite
          </span>
          <p className="mt-2 text-xs text-meda-muted">
            Secure administrative access for authorized hotel staff & operations.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-meda-border bg-[#FAF7F2] p-8 shadow-elevated">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted mb-1">
                Staff Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium uppercase tracking-wider text-meda-muted">
                  Password
                </label>
                <span className="text-[11px] text-olive hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full rounded-full h-12 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 mt-2"
            >
              Sign In to PMS
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Staff Role Demonstration Bar */}
          <div className="mt-8 pt-6 border-t border-meda-border space-y-2">
            <span className="block text-[10px] uppercase tracking-wider text-meda-muted text-center font-medium">
              Quick Role Test Logins:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect("owner", "admin@medaresha.com")}
                className="rounded-xl border border-meda-border bg-ivory p-2 hover:bg-sand transition-colors text-left"
              >
                <strong className="block text-olive font-medium">General Manager</strong>
                <span className="text-[10px] text-meda-muted">Full administrative privileges</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect("receptionist", "reception@medaresha.com")}
                className="rounded-xl border border-meda-border bg-ivory p-2 hover:bg-sand transition-colors text-left"
              >
                <strong className="block text-olive font-medium">Receptionist</strong>
                <span className="text-[10px] text-meda-muted">Check-in, Check-out, Stays</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect("housekeeping", "housekeeping@medaresha.com")}
                className="rounded-xl border border-meda-border bg-ivory p-2 hover:bg-sand transition-colors text-left"
              >
                <strong className="block text-olive font-medium">Housekeeping</strong>
                <span className="text-[10px] text-meda-muted">Room clean/dirty turnovers</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect("accountant", "finance@medaresha.com")}
                className="rounded-xl border border-meda-border bg-ivory p-2 hover:bg-sand transition-colors text-left"
              >
                <strong className="block text-olive font-medium">Accountant</strong>
                <span className="text-[10px] text-meda-muted">Ledger, Telebirr, CBE</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-meda-muted flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-botanical" />
          <span>Role-Based Access Control • Supabase Row Level Security</span>
        </div>
      </div>
    </div>
  );
}
