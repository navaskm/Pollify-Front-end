"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, PenSquare, Users2 } from "lucide-react";
import { dashboardStyles as s } from "@/public/style/style";
import { useAuth } from "@/context/AuthContext";
import usePolls from "@/hooks/usePolls";
import { Avatar } from "@/components/UIElements";
import { PollType } from "@/utils/types";


export default function Home() {

  const [feed, setFeed] = useState<PollType>("all");
  const [type, setType] = useState("all");

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
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

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
        {[
          ["all", "Explore", Compass],
          ["following", "Following", Users2]
        ].map(([k, label, icon]) => (
          <button>
            
          </button>
        ))}
      </div>
    </div>
  );
};