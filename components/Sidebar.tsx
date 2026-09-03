import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

import api from "@/utils/api";
import { TrendingItem } from "@/utils/types";
import { sidebarStyles as s } from "@/public/style/style";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "./UIElements";
import { TYPE_META } from "./FilterBar";

const COLORS = [
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
];

function Stat({n, label}:{n: number, label: string}){
  return (
    <div className={s.statBox}>
      <p className={s.statNumber}>{n ?? 0}</p>
      <p className={s.statLabel}>{label}</p>
    </div>
  )
}

// logged in user min profile card
function ProfileCard(){

  const {user, status} = useAuth();
  if(!user) return null;

  return (
    <div className={s.profileCard}>
      <div className={s.glowBlob} />
      <div className={s.profileInner}>
        <div className={s.avatarWrapper}>
          <div className={s.avatarGlow} />
          <Avatar user={user} className={s.avatarClass} />
        </div>

        <Link href={`/user/${user.username}`} className={s.userNameLink}>
          {user.name}
        </Link>

        <p className={s.usernameText}>{user.username}</p>
      </div>

      <div className={s.statsContainer}>
        <Stat n={status?.created} label="Created" />
        <Stat n={status?.voted} label="Voted" />
        <Stat n={status?.bookmarked} label="Saved" />
      </div>

      <Link href={`/user/${user.username}`} className={s.viewProfileLink}>
        View Profile
      </Link>
    </div>
  );
};


function Trending() {

  const [items, setItems] = useState<TrendingItem[]>([]);

  useEffect(() => {
    api
      .get("/polls/trending")
      .then(({ data }) => setItems(data))
      .catch(() => {});
  }, []);

  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className={s.trendingCard}>
      <h3 className={s.trendingHeading}>
        <TrendingUp size={12} className={s.trendingIcon} /> Poll types
      </h3>
      <ul className={s.trendingList}>
        {items.map((it, idx) => {
          const m = TYPE_META[it.type];
          if (!m) return null;
          const { Icon } = m;
          const pct = Math.round((it.count / max) * 100);
          return (
            <li key={it.type}>
              <div className={s.trendingItemRow}>
                <span className={s.trendingItemLabel}>
                  <Icon size={12} className={s.trendingItemIcon} /> {m.label}
                </span>
                <span className={s.trendingItemCount}>{it.count}</span>
              </div>
              <div className={s.trendingBarTrack}>
                <div
                  className={`${s.trendingBarFillBase} ${COLORS[idx % COLORS.length]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};


const Sidebar = () => {
  return (
    <>
      <ProfileCard />
      <Trending />
    </>
  );
};

export default Sidebar;