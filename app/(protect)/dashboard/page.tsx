"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, PenSquare, Sparkle, Users2 } from "lucide-react";
import { dashboardStyles as s } from "@/public/style/style";
import { useAuth } from "@/context/AuthContext";
import usePolls from "@/hooks/usePolls";
import { Avatar, PollSkeleton } from "@/components/UIElements";
import { FeedTab, FeedType, PollFilter } from "@/utils/types";
import FilterBar from "@/components/FilterBar";
import PollCard from "@/components/PollCard";

const feedTabs: FeedTab[] = [
  { key: "all", label: "Explore", Icon: Compass },
  { key: "following", label: "Following", Icon: Users2 },
];

export default function Home() {

  const [feed, setFeed] = useState<FeedType>("all");
  const [type, setType] = useState<PollFilter>("all");

  const router = useRouter();
  const {user} = useAuth();

  const params = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();

  const qs = new URLSearchParams();

  if(type !== 'all') qs.set('type', type);
  if(type === 'following') qs.set('feed', 'following');

  const path = `/polls${qs.toString() ? `?${qs}` : ""}`;

  // to get polls
  const {polls, loading, vote, unVote, bookmark} = usePolls(path);

  const shown = polls
    .filter((p) => p.question.toLowerCase().includes(q))
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    

  return(
    <div className={s.container}>
      <div className={s.greetingRow}>
        <div>
          <h1 className={s.greetingHeading}>
            Hey, {user?.name.split(" ")[0] || "there"}
          </h1>
          <p className={s.greetingSub}>What's the community thinking today?</p>
        </div>
      </div>

      <div className={s.composer}>
        <Avatar user={user} className={s.composerAvatar} />
        <button className={s.composerInput} onClick={() => router.push('/create-poll')}>
          Ask the community something...
        </button>
        <button className={s.composerInput} onClick={() => router.push('/create-poll')}>
          <PenSquare size={16} />
        </button>
      </div>

      {/* feed tabs */}
      <div className={s.feedTabs}>
        {feedTabs.map(({key, label, Icon}) => (
          <button key={key} onClick={() => setFeed(key)} className={`${s.tabBase} ${
            feed === key ? s.tabActive : s.tabInactive
          }`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <FilterBar value={type} onChange={setType} />


      {loading ? (
        <PollSkeleton />
      ) : shown.length === 0 ? (
        <div className={s.emptyContainer}>

          <span className={s.emptyIcon}>
            <Sparkle size={22} />
          </span>

          <p className={s.emptyTitle}>
            {q 
              ? `No result for "${q}"` 
              : feed === 'following' 
                ? "Nobody you follow has posted yet" 
                : "Nothing here yet"
            }
          </p>

          <p className={s.emptyDesc}>
            {feed === 'following' 
              ? "Follow creators to see their polls." 
              : "Be the first to create a poll!"
            }
          </p>

          <button className={s.emptyButton} onClick={() => router.push('/create-poll')}>
            <PenSquare size={14} /> Create a poll
          </button>
        </div>
      ):(
        shown.map(p => (
          <PollCard 
            key={p._id}
            poll={p}
            vote={vote}
            unvote={unVote}
            bookmark={bookmark}
          />
        ))
      )}
    </div>
  );
};