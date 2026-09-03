"use client";

import { ReactNode, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, PlusSquare, PenLine, CheckCircle2, Bookmark, Search, X, Plus, Loader2 } from 'lucide-react';

import NotificationBell from '@/components/NotificationBell';
import { layoutStyles as s } from '@/public/style/style';
import { useAuth } from '@/context/AuthContext';
import useClickOutside from '@/hooks/useClickOutside';

const NAV = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutGrid },
  { to: "/create-poll", label: "Create", Icon: PlusSquare },
  { to: "/my-polls", label: "My Polls", Icon: PenLine },
  { to: "/voted-polls", label: "Voted", Icon: CheckCircle2 },
  { to: "/bookmarked-polls", label: "Saved", Icon: Bookmark },
];

export default function Home() {

  const [userOpen, setUserOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState<boolean>();

  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userRef = useRef(null);
  
  const q = searchParams.get('q') || '';
  
  useClickOutside(userRef, () => setUserOpen(false), userOpen)

  return (
    // <main className={s.container}>

    //   <header className={s.header}>
    //     <div className={s.headerInner}>
    //       <Link href='/dashboard' className={s.logoLink}>
    //         <Image src="/favicon.svg" alt="logo" width={32} height={32} className={s.logoImg}/>
    //         <span className={s.logoSpan}>Pollify</span>
    //       </Link>

    //       <div className={s.searchDesktop}>
    //         <Search size={14} className={s.searchIcon} />
    //         <input 
    //           value={q}
    //           onChange={(e) => router.replace(`/dashboard?q=${encodeURIComponent(e.target.value)}`)}
    //           placeholder='Search Polls'
    //           className={s.searchInput}
    //         />
    //       </div>

    //       {/* right cluster */}
    //       <div className={s.rightCluster}>
    //         <button 
    //           onClick={() => setMobileSearch(v => !v)}
    //           className={s.mobileSearchToggle}
    //         >
    //           {mobileSearch? <X size={17} /> : <Search size={17} />}
    //         </button>

    //         <Link href="/create-poll" className={s.createButton}>
    //           <Plus size={15} /> Create
    //         </Link>

    //         {/* notification bell */}
    //         <NotificationBell />

    //         {/* avatar */}
            
    //       </div>


    //     </div>

        
    //   </header>

    // </main>


    <main>
      <h4>Pollify app</h4>
    </main>
  );
};