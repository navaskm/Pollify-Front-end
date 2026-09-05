"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import axios from "axios";
import { Poll } from "@/utils/types";

export default function usePolls(path: string){

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  const {refresh} = useAuth();

  // for toast
  const toast = useToast();

  // to load polls
  const load = useCallback( async () => {
    setLoading(true)

    try {
      const {data} = await api.get<Poll[]>(path)
      setPolls(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    };

  },[path]);

  useEffect( () => { load() }, [load]);

  // to replace the pll with other polls
  const replace = (p: Poll) => {
    setPolls((arr) => arr.map((x) => x._id === p._id ? p : x))
  }

  // to vote on a poll or change your vote
  const vote = async (id: string, value: string | number) => {
    const wasVoted = polls.find(p => p._id === id)?.myVote !== null;
    await api.post(`/polls/${id}/vote`, {value});

    const {data} = await api.get(`/polls/${id}?noview=true`) // refetch to get the result

    replace(data)
    toast(wasVoted ? "Vote changed" : 'Vote recorded');
    refresh()
  }

  // to remove your vote
  const unVote = async (id:string) => {
    try {

      await api.delete( `/polls/${id}/vote`);

      const {data} = await api.get(`/polls/${id}?noview=true`);
      replace(data);

      toast("Vote removed");
      refresh()

    } catch (error) {
      if(axios.isAxiosError(error)){
        toast(
          error.response?.data?.message || 
          error.response?.data?.msg || 
          "Could't remove vote = is the server running?", 
          "error"
        )
      }
    }
  }

  // to bookmark a poll
  const bookmark = async (id: string) => {
    const {data} = await api.post(`/polls/${id}/bookmark`);

    setPolls(arr => 
      arr.map(x =>
        x._id === id ? {
          ...x,
          isBookmarked: !x.isBookmarked,
          saves: (x.saves || 0) + (x.isBookmarked ? -1 : 1)
        } : x
      )
    )

    toast(data.bookmarked ? "Saved" : "Remove from saved");

    refresh();
  }

  // to edit a poll
  const edit = async (
    id: string,  
    payload: {
      question: string;
      category: string;
    }
  ) => {
    await api.patch(`/polls/${id}`, payload);
    const {data} = await api.get(`/polls/${id}?noview=true`);
    replace(data);
    toast("Poll updated")
  };

  // to close or re-open the poll
  const close = async (id: string) => {

    const {data} = await api.patch(`/polls/${id}/close`);

    setPolls(arr => 
      arr.map(x =>
        x._id === id ? {
          ...x,
          closed : data.closed
        } : x
      )
    )

    toast(data.closed ? "Poll closed" : "Poll re-opened");
  }

  const remove = async (id: string) => {
    await api.delete(`/polls/${id}`);
    setPolls((arr) => arr.filter(x => x._id !== id));
    toast("Poll deleted");
    refresh();
  }

  return {
    polls, loading,
    load, vote,
    unVote, bookmark, edit, close,
    remove
  }
};