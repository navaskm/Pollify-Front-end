import { useState } from "react";
import { Star, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import PollResults from '@/components/PollResults'
import { inputCls } from "@/components/UIElements";
import { pollVoteStyles as s } from "@/public/style/style.js";
import { PollVoteProps } from "@/utils/types";


export default function PollVote({ poll, onVote, onUnvote }: PollVoteProps) {

  const [sel, setSel] = useState<number | null>(null);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const voted = poll.myVote !== null && poll.myVote !== undefined;

  // if we vote the vote done on the pollId will be equals to the id of the user to increase the value
  const isMyVote = (value: number) => voted && String(poll.myVote) === String(value);

  const handleVote = (value: number) => {
    if (isMyVote(value) && onUnvote) {
      onUnvote(); // unvote to remove my vote
    } else {
      onVote(value); // to add and to increase the vote value
    }
  };


  if (voted || poll.closed) return <PollResults poll={poll} onUnvote={onUnvote} />;


  if (poll.type === "yesno") {
    return (
      <div className={s.yesNoGrid}>
        <button
          onClick={() => handleVote(0)}
          className={`${s.yesNoButtonBase} ${
            isMyVote(0) ? s.yesNoButtonYesActive : s.yesNoButtonYesInactive
          }`}
          title={isMyVote(0) ? "Click to remove your vote" : "Vote Yes"}
        >
          <ThumbsUp size={16} /> Yes
        </button>
        <button
          onClick={() => handleVote(1)}
          className={`${s.yesNoButtonBase} ${
            isMyVote(1) ? s.yesNoButtonNoActive : s.yesNoButtonNoInactive
          }`}
          title={isMyVote(1) ? "Click to remove your vote" : "Vote No"}
        >
          <ThumbsDown size={16} /> No
        </button>
      </div>
    );
  }
    

  if (poll.type === "single") {
    return (
      <div className={s.singleContainer}>
        {poll.options.map((o, i) => (
          <button
            key={i}
            onClick={() => handleVote(i)}
            className={`${s.singleOptionBase} ${
              isMyVote(i) ? s.singleOptionActive : s.singleOptionInactive
            }`}
            title={isMyVote(i) ? "Click to remove your vote" : ""}
          >
            <span
              className={`${s.singleOptionCircleBase} ${
                isMyVote(i)
                  ? s.singleOptionCircleActive
                  : s.singleOptionCircleInactive
              }`}
            >
              {isMyVote(i) ? <Check size={12} /> : String.fromCharCode(65 + i)}
            </span>
            {o.text}
            {isMyVote(i) && (
              <span className={s.singleUndoHint}>tap to undo</span>
            )}
          </button>
        ))}
      </div>
    );
  }
    

  if (poll.type === "rating") {
    const currentRating = voted ? Number(poll.myVote) : sel;
    return (
      <div className={s.ratingContainer}>
        <div className={s.ratingStars} onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => {
                if (voted) {
                  if (onUnvote) onUnvote();
                } else {
                  setSel(star);
                }
              }}
              onMouseEnter={() => !voted && setHover(star)}
              className={s.ratingStarButton}
              title={voted ? "Click to remove your vote" : ""}
            >
              <Star
                size={26}
                className={
                  star <= (hover || currentRating || 0)
                    ? s.ratingStarFilled
                    : s.ratingStarEmpty
                }
              />
            </button>
          ))}
        </div>
        {!voted && sel ? (
          <button
            onClick={() => onVote(sel)}
            className={s.ratingSubmit}
          >
            Submit
          </button>
        ) : !voted ? (
          <span className={s.ratingHint}>Tap to rate</span>
        ) : (
          <span className={s.ratingUndoHint}>tap star to undo</span>
        )}
      </div>
    );
  }


  if (poll.type === "image") {
    return (
      <div>
        <div className={s.imageGrid}>
          {poll.options.map((o, i) => (
            <button
              key={i}
              onClick={() => {
                if (voted) {
                  if (isMyVote(i) && onUnvote) onUnvote();
                } else {
                  setSel(sel === i ? null : i);
                }
              }}
              className={`${s.imageItemBase} ${
                isMyVote(i)
                  ? s.imageItemActive
                  : sel === i
                    ? s.imageItemSelected
                    : s.imageItemInactive
              }`}
              title={isMyVote(i) ? "Click to remove your vote" : ""}
            >
              <img src={o.image} alt="" className={s.imageThumb} />
              {(sel === i || isMyVote(i)) && (
                <span className={s.imageCheck}>
                  <Check size={13} />
                </span>
              )}
              {isMyVote(i) && (
                <span className={s.imageUndoText}>tap to undo</span>
              )}
            </button>
          ))}
        </div>
        {!voted && sel !== null && (
          <button
            onClick={() => onVote(sel)}
            className={s.imageSubmit}
          >
            Submit vote
          </button>
        )}
      </div>
    );
  }
    

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={280}
        className={`${inputCls} ${s.openTextarea}`}
        placeholder="Share your thoughts…"
      />
      <div className={s.openFooter}>
        <span className={s.openCharCount}>{text.length}/280</span>
        <button
          disabled={!text.trim()}
          onClick={() => onVote(text.trim())}
          className={s.openSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}