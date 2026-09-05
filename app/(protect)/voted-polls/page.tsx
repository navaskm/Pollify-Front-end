"use client";
import PollList from "@/components/PollLis";
import { CheckCircle2 } from "lucide-react";

const page = () => {
  return (
    <PollList
      endpoint="/polls/voted"
      title="Voted Polls"
      emptyTitle="No voted polls yet"
      emptyText="You haven't voted on any polls yet."
      EmptyIcon={CheckCircle2}
    />
  );
}

export default page;