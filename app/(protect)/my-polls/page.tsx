"use client";
import { PenLine } from 'lucide-react';
import PollList from '@/components/PollLis';

const page = () => {
  return (
    <PollList 
      endpoint="/polls/mine"
      title="My Polls"
      emptyTitle="No polls yet"
      emptyText="You haven't created any polls yet."
      EmptyIcon={PenLine}
    />
  )
}

export default page;