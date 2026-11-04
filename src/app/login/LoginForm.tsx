"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderIcon, LogInIcon, MailIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginPasswordSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

type Props = {
  initialError?: string;
  nextPath: string;
};

type AuthTab = "password" | "magic";

export function LoginForm({ initialError, nextPath }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>(
    {}
  );
  const [magicStatus, setMagicStatus] = useState<
    "idle" | "loading" | "sent" | "error"
  >(initialError ? "error" : "idle");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [message, setMessage] = useState(
    initialError === "auth"
      ? "That sign-in link expired or is invalid. Request a new one."
      : initialError === "config"
        ? "Supabase is not configured on the server. You can explore as guest below."
        : ""
  );

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setMessage("");

    const parsed = loginPasswordSchema.safeParse({ email, password });
    if (!parsed.success) {
      const err: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0];
        if (typeof k === "string" && !err[k]) err[k] = issue.message;
      }
      setFieldErrors(err);
      return;
    }

    setPasswordStatus("loading");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, next: nextPath }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setPasswordStatus("error");
        setMessage(data.error ?? "Invalid email or password.");
        return;
      }

      router.refresh();
      router.push(nextPath);
    } catch {
      setPasswordStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  async function onMagicSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setMagicStatus("error");
      setMessage("Enter your email address.");
      return;
    }

    setMagicStatus("loading");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, next: nextPath }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setMagicStatus("error");
        setMessage(data.error ?? "Could not send sign-in link.");
        return;
      }

      setMagicStatus("sent");
      setMessage(
        "Check your inbox for your secure FERMORA sign-in link."
      );
    } catch {
      setMagicStatus("error");
      setMessage("Network error.");
    }
  }

  const showPasswordError = tab === "password" && passwordStatus === "error" && message;
  const showMagicError = tab === "magic" && magicStatus === "error" && message;
  const showMagicSuccess = tab === "magic" && magicStatus === "sent" && message;

  return (
    <div className="w-full max-w-md space-y-6 relative z-10">
      <div className="text-center space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#B66ACB]">
          Welcome Back
        </p>
        <h1 className="font-display text-3xl font-semibold text-[#101F3B]">
          Sign in to FERMORA
        </h1>
        <p className="text-[#26334A]/70 text-xs sm:text-sm leading-relaxed">
          Access your personal cycle tracker, cravings, and journal. New here?{" "}
          <Link
            href={`/signup?next=${encodeURIComponent(nextPath)}`}
            className="text-[#B66ACB] hover:text-[#9C4EB3] font-medium transition-colors underline"
          >
            Create an account
          </Link>
        </p>
      </div>

      <div
        className="flex rounded-md border border-[#E8DFD5] bg-[#FAF7F2] p-1"
        role="tablist"
        aria-label="Sign-in method"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "password"}
          className={cn(
            "flex-1 rounded-sm py-2 text-xs font-medium transition-all duration-150 ease-out cursor-pointer active:scale-95",
            tab === "password"
              ? "bg-[#F8F3E9] text-[#101F3B] font-semibold border border-[#E8DFD5]"
              : "text-[#26334A]/60 hover:text-[#101F3B]"
          )}
          onClick={() => {
            setTab("password");
            setMessage("");
            setMagicStatus("idle");
          }}
        >
          <span className="inline-flex items-center justify-center gap-1.5">
            <LogInIcon size={14} aria-hidden="true" />
            Password
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "magic"}
          className={cn(
            "flex-1 rounded-sm py-2 text-xs font-medium transition-all duration-150 ease-out cursor-pointer active:scale-95",
            tab === "magic"
              ? "bg-[#F8F3E9] text-[#101F3B] font-semibold border border-[#E8DFD5]"
              : "text-[#26334A]/60 hover:text-[#101F3B]"
          )}
          onClick={() => {
            setTab("magic");
            setMessage("");
            setPasswordStatus("idle");
            setFieldErrors({});
          }}
        >
          <span className="inline-flex items-center justify-center gap-1.5">
            <MailIcon size={14} aria-hidden="true" />
            Magic link
          </span>
        </button>
      </div>

      {tab === "password" ? (
        <form
          onSubmit={(e) => void onPasswordSubmit(e)}
          className="rounded-xl p-6 sm:p-8 bg-[#FAF7F2] border border-[#E8DFD5] space-y-4"
          noValidate
        >
          <div className="space-y-1">
            <Label htmlFor="login-email">Email Address</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={passwordStatus === "loading"}
              error={fieldErrors.email}
              className="bg-[#F8F3E9]"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={passwordStatus === "loading"}
              error={fieldErrors.password}
              className="bg-[#F8F3E9]"
            />
          </div>
          {showPasswordError && (
            <p className="text-red-600 text-xs font-medium" role="alert">
              {message}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-[#B66ACB] hover:bg-[#9C4EB3] border border-[#9C4EB3] text-white cursor-pointer mt-2"
            disabled={passwordStatus === "loading"}
          >
            {passwordStatus === "loading" ? (
              <>
                <LoaderIcon size={16} className="mr-2" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              <>
                <LogInIcon size={16} className="mr-2" aria-hidden="true" />
                Sign in to FERMORA
              </>
            )}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={(e) => void onMagicSubmit(e)}
          className="rounded-xl p-6 sm:p-8 bg-[#FAF7F2] border border-[#E8DFD5] space-y-4"
          noValidate
        >
          <div className="space-y-1">
            <Label htmlFor="magic-email">Email Address</Label>
            <Input
              id="magic-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={magicStatus === "loading" || magicStatus === "sent"}
              className="bg-[#F8F3E9]"
            />
          </div>
          {(showMagicError || showMagicSuccess) && (
            <p
              className={`text-xs font-medium ${showMagicError ? "text-red-600" : "text-emerald-700"}`}
              role={showMagicError ? "alert" : "status"}
            >
              {message}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-[#B66ACB] hover:bg-[#9C4EB3] border border-[#9C4EB3] text-white cursor-pointer mt-2"
            disabled={
              magicStatus === "loading" || magicStatus === "sent" || !email.trim()
            }
          >
            {magicStatus === "loading" ? (
              <>
                <LoaderIcon size={16} className="mr-2" aria-hidden="true" />
                Sending link...
              </>
            ) : magicStatus === "sent" ? (
              "Link Sent: Check Email"
            ) : (
              <>
                <MailIcon size={16} className="mr-2" aria-hidden="true" />
                Email me a magic link
              </>
            )}
          </Button>
        </form>
      )}

      {/* Guest Mode Link for immediate, functional exploration */}
      <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E8DFD5] text-center space-y-1 text-xs">
        <span className="text-[#26334A]/70">Want to test the platform without an account?</span>
        <div>
          <Link
            href="/dashboard?guest=1"
            className="font-semibold text-[#B66ACB] hover:text-[#9C4EB3] transition-colors"
          >
            Explore Dashboard as Guest →
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-[#26334A]/60">
        <Link href="/" className="hover:text-[#B66ACB] transition-colors">
          ← Return to FERMORA Home
        </Link>
      </p>
    </div>
  );
}
