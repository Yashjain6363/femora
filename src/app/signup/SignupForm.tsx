"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderIcon, MailIcon, UserPlusIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema } from "@/lib/validations";

type Props = { nextPath: string };

export function SignupForm({ nextPath }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>(
    {}
  );
  const [status, setStatus] = useState<
    "idle" | "loading" | "verify" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const parsed = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const err: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0];
        if (typeof k === "string" && !err[k]) err[k] = issue.message;
      }
      setFieldErrors(err);
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${window.location.origin}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...parsed.data,
          next: nextPath,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        needsEmailConfirmation?: boolean;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Sign up failed.");
        return;
      }

      if (data.needsEmailConfirmation) {
        setStatus("verify");
        return;
      }

      router.refresh();
      router.push(nextPath);
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  async function resendVerification() {
    setResending(true);
    setVerifyError("");
    try {
      const res = await fetch(`${window.location.origin}/api/auth/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), next: nextPath }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setVerifyError(data.error ?? "Could not resend email.");
      }
    } catch {
      setVerifyError("Network error.");
    } finally {
      setResending(false);
    }
  }

  if (status === "verify") {
    return (
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B66ACB]">
            Email Verification
          </p>
          <h1 className="font-display text-3xl font-semibold text-[#101F3B]">
            Check your email
          </h1>
          <p className="text-[#26334A]/70 text-xs sm:text-sm leading-relaxed">
            We sent a secure confirmation link to complete your FERMORA registration.
          </p>
        </div>
        {verifyError && (
          <p className="text-red-600 text-xs text-center font-medium" role="alert">
            {verifyError}
          </p>
        )}
        <div className="rounded-xl p-8 bg-[#FAF7F2] border border-[#E8DFD5] space-y-4 text-center">
          <div className="w-12 h-12 rounded-lg bg-[#E6DDF4] flex items-center justify-center mx-auto border border-[#E8DFD5]">
            <MailIcon size={22} className="text-[#7A3E8E]" aria-hidden="true" />
          </div>
          <p className="text-[#26334A]/70 text-xs">
            Sent to <span className="font-semibold text-[#101F3B]">{email}</span>
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#E8DFD5] text-[#101F3B] hover:bg-[#F8F3E9] cursor-pointer"
            disabled={resending}
            onClick={() => void resendVerification()}
          >
            {resending ? (
              <>
                <LoaderIcon size={15} className="mr-2" aria-hidden="true" />
                Sending...
              </>
            ) : (
              "Resend confirmation email"
            )}
          </Button>
          <Button asChild variant="ghost" className="w-full text-xs text-[#26334A]/70">
            <Link href="/login">Back to Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6 relative z-10">
      <div className="text-center space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#B66ACB]">
          Join FERMORA
        </p>
        <h1 className="font-display text-3xl font-semibold text-[#101F3B]">
          Begin your journey
        </h1>
        <p className="text-[#26334A]/70 text-xs sm:text-sm leading-relaxed">
          Create your private wellness profile. Understand your body&apos;s natural rhythm.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-xl p-6 sm:p-8 bg-[#FAF7F2] border border-[#E8DFD5] space-y-3.5"
        noValidate
      >
        <div className="space-y-1">
          <Label htmlFor="signup-name">Your Name</Label>
          <Input
            id="signup-name"
            autoComplete="name"
            placeholder="e.g. Elena"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={status === "loading"}
            error={fieldErrors.fullName}
            className="bg-[#F8F3E9]"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="signup-email">Email Address</Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            error={fieldErrors.email}
            className="bg-[#F8F3E9]"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={status === "loading"}
            error={fieldErrors.password}
            className="bg-[#F8F3E9]"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="signup-confirm">Confirm Password</Label>
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={status === "loading"}
            error={fieldErrors.confirmPassword}
            className="bg-[#F8F3E9]"
          />
        </div>

        {status === "error" && message && (
          <p className="text-red-600 text-xs font-medium" role="alert">
            {message}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#B66ACB] hover:bg-[#9C4EB3] border border-[#9C4EB3] text-white cursor-pointer mt-2"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <LoaderIcon size={16} className="mr-2" aria-hidden="true" />
              Creating your space...
            </>
          ) : (
            <>
              <UserPlusIcon size={16} className="mr-2" aria-hidden="true" />
              Create Account
            </>
          )}
        </Button>
      </form>

      {/* Guest Mode option */}
      <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E8DFD5] text-center space-y-1 text-xs">
        <span className="text-[#26334A]/70">Testing the experience?</span>
        <div>
          <Link
            href="/dashboard?guest=1"
            className="font-semibold text-[#B66ACB] hover:text-[#9C4EB3] transition-colors"
          >
            Explore Dashboard as Guest →
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-[#26334A]/70">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(nextPath)}`}
          className="text-[#B66ACB] font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-[#26334A]/60">
        <Link href="/" className="hover:text-[#B66ACB] transition-colors">
          ← Return to FERMORA Home
        </Link>
      </p>
    </div>
  );
}
