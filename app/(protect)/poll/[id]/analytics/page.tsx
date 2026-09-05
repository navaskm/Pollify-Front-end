"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { analyticsStyles as s } from "@/public/style/style";
import api from "@/utils/api";
import { PollSkeleton } from "@/components/UIElements";
import { PollAnalytics } from "@/utils/types";
import { Activity, ArrowLeft, BarChart3, Eye, MessageCircle } from "lucide-react";
import { StatCardProps } from "@/utils/types";
import PollResults from "@/components/PollResults";

function StatCard({ Icon, label, value, color }: StatCardProps) {
  return (
    <div className={s.statCard}>
      <span className={`${s.statIcon} ${color}`}>
        <Icon size={15} />
      </span>
      <p className={s.statValue}>{value}</p>
      <p className={s.statLabel}>{label}</p>
    </div>
  );
}

const page = () => {

  const router = useRouter();
  const id = useParams().id as string;

  const [data, setData] = useState<PollAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/polls/${id}/analytics`)
      .then(({ data }) => setData(data))
      .catch((e) =>
        setError(e.response?.data?.message || e.response?.data?.msg || "Could not load analytics"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PollSkeleton />;
  if (error || !data) {
    return (
      <div className={s.errorContainer}>
        {error || "Not found."}
      </div>
    );
  }

  const { poll, comments } = data;

  const engagement = poll.views
    ? Math.round((poll.totalVotes / poll.views) * 100)
    : 0;

  return (
    <div className={s.container}>
      <button className={s.backButton} onClick={() => router.back()}>
        <ArrowLeft size={14} /> Back
      </button>

      <div>
        <h1 className={s.heading}>Poll analytics</h1>
        <p className={s.subtitle}>{poll.question}</p>
        <p className=""></p>
      </div>

      <div className={s.statsGrid}>
        <StatCard Icon={Eye} label="View" value={poll.totalVotes} color='bg-sky-500/10 text-sky-500' />
        <StatCard Icon={BarChart3} label="Votes" value={poll.views} color='bg-emerald-500 text-emerald-500' />
        <StatCard Icon={MessageCircle} label="Comments" value={comments} color='bg-amber-500 text-amber-500' />
        <StatCard Icon={Activity} label="Engagement" value={`${engagement}%`} color='bg-violet-500 text-violet-500' />
      </div>

      <div className={s.resultsContainer}>
        <p className={s.resultsHeading}>Result breakdown</p>
        <PollResults poll={poll}  />
      </div>
    </div>
  )
}

export default page;