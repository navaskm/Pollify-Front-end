"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, PlusSquare, PenLine, CheckCircle2, Bookmark, Search, X, Plus, Settings, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from "@/context/AuthContext";
import NotificationBell from '@/components/NotificationBell';
import Sidebar from '@/components/Sidebar';
import { Avatar } from '@/components/UIElements';
import { appStyles as a, layoutStyles as s } from "@/public/style/style";
import useClickOutside from '@/hooks/useClickOutside';



const NAV = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutGrid },
  { to: "/create-poll", label: "Create", Icon: PlusSquare },
  { to: "/my-polls", label: "My Polls", Icon: PenLine },
  { to: "/voted-polls", label: "Voted", Icon: CheckCircle2 },
  { to: "/bookmarked-polls", label: "Saved", Icon: Bookmark },
];



function ProtectedLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {

  const [mobileSearch, setMobileSearch] = useState<boolean>();
  const [userOpen, setUserOpen] = useState(false);

  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const userRef = useRef(null);

  const q = searchParams.get('q') || '';

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useClickOutside(userRef, () => setUserOpen(false), userOpen)

  if (loading || !user) {
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

      <header className={s.header}>
        <div className={s.headerInner}>
          <Link href='/dashboard' className={s.logoLink}>
            <Image src="/favicon.svg" alt="logo" width={32} height={32} className={s.logoImg}/>
            <span className={s.logoSpan}>Pollify</span>
          </Link>

          <div className={s.searchDesktop}>
            <Search size={14} className={s.searchIcon} />
            <input 
              value={q}
              onChange={(e) => router.replace(`/dashboard?q=${encodeURIComponent(e.target.value)}`)}
              placeholder='Search Polls'
              className={s.searchInput}
            />
          </div>

          {/* right cluster */}
          <div className={s.rightCluster}>
            <button 
              onClick={() => setMobileSearch(v => !v)}
              className={s.mobileSearchToggle}
            >
              {mobileSearch? <X size={17} /> : <Search size={17} />}
            </button>

            <Link href="/create-poll" className={s.createButton}>
              <Plus size={15} /> Create
            </Link>

            {/* notification bell */}
            <NotificationBell />

            {/* avatar */}
            <div className={s.avatarWrapper} ref={userRef} >
              <Avatar user={user} className={s.avatarClass} />
            </div>
          </div>

        </div>

        {/* mobile expanded search */}
        {mobileSearch && (
          <div className={s.mobileSearchContainer}>
            <div className={s.mobileSearchInner}>
              <Search size={15} className={s.searchIcon}/>
              <input 
                autoFocus
                value={q}
                onChange={(e) => router.push(`/dashboard?q=${encodeURIComponent(e.target.value)}`)}
                placeholder='Search polls'
                className={s.mobileSearchInput}
              />
            </div>
          </div>
        )}
      </header>

      <div className={s.bodyContainer}>
        <aside className={s.leftSidebar}>
          <p className={s.menuLabel}>Menu</p>

          <nav className={s.navContainer}>
            {NAV.map(({Icon, label, to}) => (
              <Link 
                href={to} 
                key={to}
                className={`${s.sideLinkBase} ${pathname === to ? s.sideLinkActive : s.sideLinkInactive}`}
              >
                <Icon size={16} className='shrink-0' />
                {label}
              </Link>
            ))}
          </nav>

          <div className={s.sidebarBottom}>
            <Link 
              href='/settings' 
              className={`${s.sideLinkBase} ${pathname === '/settings' ? s.sideLinkActive : s.sideLinkInactive}`}
            >
              <Settings size={16} className='shrink-0' /> Settings
            </Link>
            <button 
              onClick={() => {
                logout()
                router.push('/login')
              }}
              className={s.logoutButton}
            >
              <LogOut size={16} className='shrink-0' /> Logo out
            </button>
          </div>
        </aside>

        {/* main content */}
        <main className={s.mainContent}>
          {children}
        </main>

        <aside className={s.rightRail}>
          <Sidebar />
        </aside>
      </div>

      <nav className={s.bottomNav}>
        {NAV.map(({Icon, label, to}) => (
          <Link 
            href={to} 
            key={to}
            className={`${s.bottomLinkBase} ${pathname === to ? s.bottomLinkActive : s.bottomLinkInactive}`}
          >
            <Icon size={20} className='shrink-0' />
            <span>{label.split(" ")[0]}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
}



export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <ProtectedLayoutContent>
        {children}
      </ProtectedLayoutContent>
    </Suspense>
  );
}