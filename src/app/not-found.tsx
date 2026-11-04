import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-obsidian-DEFAULT flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-8xl font-display font-bold text-gradient-rose">404</div>
        <h1 className="text-2xl font-semibold text-white">Page not found</h1>
        <p className="text-white/50 max-w-sm">
          This page doesn't exist. Let's get you back to building better money habits.
        </p>
        <Button asChild size="lg">
          <Link href="/">Back to SakhiFi</Link>
        </Button>
      </div>
    </main>
  );
}