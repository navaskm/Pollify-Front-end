"use client"
import { Bookmark } from "lucide-react";
import PollList from "@/components/PollLis";

const page = () => {
  return (
    <PollList
      endpoint="/polls/bookmarks"
      title="Saved"
      emptyTitle="No saved polls yet"
      emptyText="Save polls you want to revisit later."
      EmptyIcon={Bookmark}
    />
  );
}

export default page