"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardIcon, LoaderIcon, LogInIcon, LogOutIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  mobile?: boolean;
  /** Close mobile menu when a link is pressed */
  onClickLink?: () => void;
};

export function NavAuthButtons({ className, mobile, onClickLink }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setReady(true);
      return;
    }

    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        setSignedIn(!!data.session);
        setReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await fetch(`${window.location.origin}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      setSignedIn(false);
      router.refresh();
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#E8DFD5] bg-[#FAF7F2]">
          <LoaderIcon size={16} className="text-[#B66ACB]" aria-hidden="true" />
        </span>
      </div>
    );
  }

  if (signedIn) {
    return (
      <div
        className={cn(
          mobile ? "flex flex-col gap-2 pt-2" : "flex items-center gap-2",
          className
        )}
      >
        <Button
          asChild
          variant="default"
          size={mobile ? "lg" : "sm"}
          className={mobile ? "w-full justify-center" : "bg-[#B66ACB] text-white hover:bg-[#9C4EB3]"}
        >
          <Link href="/dashboard" onClick={onClickLink}>
            <DashboardIcon size={15} className="mr-1.5" aria-hidden="true" />
            Dashboard
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size={mobile ? "lg" : "sm"}
          className={mobile ? "w-full" : "text-[#26334A] border-[#E8DFD5] hover:bg-[#E6DDF4]/40"}
          disabled={signingOut}
          onClick={() => void signOut()}
        >
          {signingOut ? (
            <LoaderIcon size={15} className="mr-1.5 text-[#B66ACB]" aria-hidden="true" />
          ) : (
            <LogOutIcon size={15} className="mr-1.5 text-[#26334A]/70" aria-hidden="true" />
          )}
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        mobile ? "flex flex-col gap-2 pt-2" : "flex items-center gap-2",
        className
      )}
    >
      <Button
        asChild
        variant="ghost"
        size={mobile ? "lg" : "sm"}
        className={
          mobile
            ? "w-full justify-center text-[#101F3B]"
            : "text-[#26334A] hover:text-[#101F3B] hover:bg-[#E6DDF4]/40"
        }
      >
        <Link href="/login" onClick={onClickLink}>
          <LogInIcon size={15} className="mr-1.5 text-[#B66ACB]" aria-hidden="true" />
          Log in
        </Link>
      </Button>
      <Button
        asChild
        variant="default"
        size={mobile ? "lg" : "sm"}
        className="bg-[#B66ACB] text-white hover:bg-[#9C4EB3] border border-[#9C4EB3]"
      >
        <Link href="/signup" onClick={onClickLink}>
          Get Started
        </Link>
      </Button>
    </div>
  );
}
