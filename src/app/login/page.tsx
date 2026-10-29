"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, Sparkles, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DEMO_DISCLAIMER } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Phase 1 has no real auth. Simulate a delay then route to dashboard.
    setTimeout(() => {
      setLoading(false);
      toast.success("Signed in (demo)", { description: DEMO_DISCLAIMER });
      router.push("/dashboard");
    }, 700);
  };

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Back home
          </Link>

          <Card>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-background" />
              </div>
              <CardTitle className="text-lg">Sign in to CPV</CardTitle>
              <CardDescription className="text-xs">Phase 1 demo — no real authentication backend.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in (demo)"}
                </Button>
              </form>

              <div className="mt-4 p-3 rounded-md border border-warning/30 bg-warning/5">
                <p className="text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-1.5">
                  <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>This form does not authenticate against a real backend. Phase 1 has no authentication system. Use the role switcher in the top bar to explore demo roles.</span>
                </p>
              </div>

              <div className="mt-4 text-center text-[11px] text-muted-foreground">
                <p>Don't have an account? <button className="text-primary hover:underline" onClick={() => toast.info("Sign-up is not enabled in the demo.")}>Sign up (demo)</button></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
