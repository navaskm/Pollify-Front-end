import Link from 'next/link';
import { pollListPageStyles as s } from '@/public/style/style';
import usePolls from '@/hooks/usePolls';
import { PollSkeleton, Button } from '@/components/UIElements';
import PollCard from '@/components/PollCard';
import { PollListPageProps } from '@/utils/types';


const PollList = ({endpoint, title, emptyTitle, emptyText, EmptyIcon}: PollListPageProps) => {

  const {polls, loading, vote, unVote, bookmark, edit, close, remove} = usePolls(endpoint);

  return (
    <div>
      <h1 className={s.heading}>{title}</h1>

      {loading ? (
        <PollSkeleton />
      ) : polls.length === 0 ?(

        <div className={s.emptyContainer}>
          <span className={s.emptyIconWrapper}>
            <EmptyIcon size={24} />
          </span>

          <p className={s.emptyTitle}>{emptyTitle}</p>
          <p className={s.emptyText}>{emptyText}</p>

          <Link href='/dashboard'>
            <Button className="mt-4">
              Explore polls
            </Button>
          </Link>
        </div>

      ) : (
        
        polls.map(p => (
          <PollCard 
            key={p._id}
            poll={p}
            vote={vote}
            unvote={unVote}
            bookmark={bookmark}  
            edit={edit}
            close={close}
            remove={remove}
            owner={endpoint === "/polls/mine"}
          />
        ))

      )}
    </div>
  )
}

export default PollList