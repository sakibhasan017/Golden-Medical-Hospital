"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }

    const check = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.authenticated) {
          router.replace("/login");
          return;
        }

        if (!data.registered) {
          router.replace("/complete-profile");
          return;
        }

        if (data.role === "patient") {
          if (data.profileComplete) router.replace("/dashboard/patient");
          else router.replace("/complete-profile");
          return;
        }

        if (data.role === "doctor") {
          if (!data.profileComplete) {
            router.replace("/complete-profile");
            return;
          }
          if (data.user?.status === "approved") router.replace("/dashboard/doctor");
          else router.replace("/doctor-waiting");
          return;
        }

        router.replace("/");
      } catch (err) {
        router.replace("/");
      } finally {
        setChecking(false);
      }
    };

    check();
  }, [session, status, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center font-merriweather text-[#023E8A]">
        Checking account...
      </div>
    );
  }

  return null;
}
