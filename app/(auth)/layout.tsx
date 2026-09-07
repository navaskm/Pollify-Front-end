"use client";

import { Suspense, useEffect } from "react";
import Image from "next/image";
import { Loader2, TrendingUp, Users, Zap } from "lucide-react";
import { authLayoutStyles as s, appStyles as a } from "@/public/style/style";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const STATS = [
  { Icon: Users, value: "50K+", label: "Community members" },
  { Icon: TrendingUp, value: "2M+", label: "Votes cast" },
  { Icon: Zap, value: "500K+", label: "Polls created" },
];

const layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className={a.loadingContainer}>
        <Loader2
          className={a.loadingSpinner}
          size={32}
        />
      </div>
    );
  };

  return (
    <div className={s.container}>
      <div className={s.leftPanel}>

        {/* {s.gridPattern} */}
        <div className='' style={s.gridPatternStyle}/>
        <div className={s.glowTop} />
        <div className={s.glowBottom}/>

        {/* logo */}
        <div className={s.logoContainer}>
          <Image src="/favicon.svg" alt="logo" width={40} height={40} className={s.logoImg}/>
          <span className={s.logoText}>Pollify</span>
        </div>

        {/* main */}
        <div className={s.mainCopyContainer}>
          <div className={s.mainCopyInner}>

            <span className={s.liveBadge}>
              <span className={s.dot} />
              Live community
            </span>

            <h2 className={s.heading}>
              Every opinion <br />
              <span className={s.emeraldText}>deserves to</span> <br />
              be counted.
            </h2>

          </div>

          <p className={s.description}>
            Create poll in seconds, collect votes instantly, and discover what you community truly thinks.
          </p>

          <div className={s.statsGrid}>
            {STATS.map(({Icon, label, value}) => (
              <div key={label} className={s.statCard}>
                <Icon size={15} className={s.emeraldText} />
                <div className={s.statValue}>{value}</div>
                <div className={s.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className={s.footer}>
          &copy; {new Date().getFullYear()} Pollify ◽ Made for the community
        </p>

      </div>

      <div className={s.rightPanel}>
        <div className={s.formContainer}>
          <div className={s.mobileLogoContainer}>
            <Image src="/favicon.svg" alt="logo" width={32} height={32} className={s.mobileLogoImg}/>
            <span className={s.mobileLogoText}>Pollify</span>
          </div>

          <Suspense fallback={null}>
            {children}
          </Suspense>
        </div>
      </div>

    </div>
  )
}

export default layout