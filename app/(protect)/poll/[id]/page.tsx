"use client";

import { useParams, useRouter } from "next/navigation";
import { singlePollPageStyles as s } from "@/public/style/style";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Poll } from "@/utils/types";
import { ArrowLeft } from "lucide-react";
import { PollSkeleton } from "@/components/UIElements";
import PollCard from "@/components/PollCard";

const page = () => {

  const router = useRouter();
  const id = useParams().id as string;

  const { user, refresh } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);


  // to load the poll
  const load = async (skipView = false) => {
    try {
      const { data } = await api.get(
        `/polls/${id}${skipView ? "?noview=true" : ""}`,
      );
      setPoll(data);
    } catch {
      setMissing(true);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    load(false);
  }, [id]);


  const vote = async (_id: string, value: string | number) => {
    await api.post(`/polls/${id}/vote`, { value });
    await load(true);
    refresh();
  };


  const unvote = async () => {
    await api.delete(`/polls/${id}/vote`);
    await load(true);
    refresh();
  };


  const bookmark = async () => {
    await api.post(`/polls/${id}/bookmark`);

    setPoll((p) => {
      if (!p) return p;

      return {
        ...p,
        isBookmarked: !p.isBookmarked,
        saves: (p.saves || 0) + (p.isBookmarked ? -1 : 1),
      }
    });

    refresh();
  };


  const edit = async (
    _id: string,
    payload: {
      question: string;
      category: string;
    }
  ) => {
    await api.patch(`/polls/${id}`, payload);
    await load(true);
  };


  const close = async () => {
    const { data } = await api.patch(`/polls/${id}/close`);
    setPoll((p) => {
      if (!p) return p;
      return { ...p, closed: data.closed }
    });
  };


  const remove = async () => {
    await api.delete(`/polls/${id}`);
    router.push("/dashboard")
  };


  return (
    <div>
      <button onClick={() => router.back()} className={s.backButton}>
        <ArrowLeft size={14} /> Back
      </button>

      {loading ? (
        <PollSkeleton count={1} />
      ) : missing || !poll ? (
        <div className={s.errorContainer}>
          This Poll does't exist or was deleted
        </div>
      ) : (
        <PollCard
          poll={poll}
          vote={vote}
          unvote={unvote}
          bookmark={bookmark}
          edit={edit}
          close={close}
          remove={remove}
          owner={poll.creator?._id === user?._id}
        />
      )}
    </div>
  )
};

export default page;