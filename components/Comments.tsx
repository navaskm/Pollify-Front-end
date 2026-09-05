import { useEffect, useState } from "react";
import Link from "next/link.js";
import { Send, Trash2, CornerDownRight } from "lucide-react";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/UIElements";
import { commentsStyles as s } from "@/public/style/style.js";
import { Comment, CommentItemProps } from "@/utils/types";



// it will return the output like 7 days ago
const ago = (date: string) => {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  for (const [n, sec] of [
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ] as const) {
    const v = Math.floor(s / sec);
    if (v >= 1) return `${v}${n}`;
  }
  return "now";
};



// this function is small helper component
function CommentItem({ c, replies, meId, onReply, onDelete }: CommentItemProps) {

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  // to give replay
  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    await onReply(c._id, text.trim());

    setText("");
    setOpen(false);
  };

  return (
    <div className={s.commentItem}>
      <Link href={`/user/${c.user?.username}`}>
        <Avatar user={c.user} className={s.avatarSmall} />
      </Link>
      <div className={s.commentContent}>
        <div className={s.commentBubble}>
          <div className={s.commentHeader}>
            <Link
              href={`/user/${c.user?.username}`}
              className={s.usernameLink}
            >
              @{c.user?.username}
            </Link>
            <span className={s.timestamp}>{ago(c.createdAt)}</span>
          </div>
          <p className={s.commentText}>{c.text}</p>
        </div>

        <div className={s.commentActions}>
          <button
            onClick={() => setOpen(!open)}
            className={s.replyButton}
          >
            Reply
          </button>
          {String(c.user?._id) === String(meId) && (
            <button
              onClick={() => onDelete(c._id)}
              className={s.deleteButton}
            >
              <Trash2 size={10} /> Delete
            </button>
          )}
        </div>

        {open && (
          <form onSubmit={send} className={s.replyForm}>
            <input
              className={s.replyInput}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Reply to @${c.user?.username}`}
              autoFocus
            />
            <button
              type="submit"
              className={s.replySubmit}
            >
              <Send size={12} />
            </button>
          </form>
        )}

        {replies.length > 0 && (
          <div className={s.repliesContainer}>
            {replies.map((r) => (
              <div key={r._id} className={s.replyItem}>
                <CornerDownRight
                  size={12}
                  className={s.replyIndent}
                />
                <Link href={`/user/${r.user?.username}`}>
                  <Avatar
                    user={r.user}
                    className={s.avatarTiny}
                  />
                </Link>
                <div className={s.replyBubble}>
                  <div className={s.replyHeader}>
                    <Link
                      href={`/user/${r.user?.username}`}
                      className={s.replyUsername}
                    >
                      @{r.user?.username}
                    </Link>
                    <span className={s.replyTimestamp}>
                      {ago(r.createdAt)}
                    </span>
                  </div>
                  <p className={s.replyText}>{r.text}</p>
                  {String(r.user?._id) === String(meId) && (
                    <button
                      onClick={() => onDelete(r._id)}
                      className={s.replyDelete}
                    >
                      <Trash2 size={9} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



// because the comment can be given on a poll so to find we use pollId
export default function Comments({ pollId }: {pollId: string}) {

  const { user } = useAuth();
  const toast = useToast();
  const [list, setList] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  // to load the comments
  useEffect(() => {
    api
      .get(`/comments/${pollId}`)
      .then(({ data }) => setList(data))
      .catch(() => {});
  }, [pollId]);

  // to add a comment
  const add = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);

    try {
      const { data } = await api.post(`/comments/${pollId}`, { text });
      setList((l) => [data, ...l]);
      setText("");
    } finally {
      setBusy(false);
    }
  };

  // to replay (ie to again post a new comment as a replay)
  const reply = async (parent: string, body: string) => {
    const { data } = await api.post(`/comments/${pollId}`, {
      text: body,
      parent,
    });
    setList((l) => [...l, data]);
  };

  // delete a comment
  const remove = async (id: string) => {
    await api.delete(`/comments/${id}`);
    setList((l) => l.filter((c) => c._id !== id && c.parent !== id));
    toast("Comment deleted");
  };

  const tops = list.filter((c) => !c.parent);

  const repliesOf = (id: string) =>
    list
      .filter((c) => String(c.parent) === String(id))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className={s.commentsContainer}>
      <form onSubmit={add} className={s.mainForm}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          className={s.mainInput}
        />
        <button
          type="submit"
          disabled={!text.trim() || busy}
          className={s.mainSubmit}
        >
          <Send size={13} />
        </button>
      </form>

      <div className={s.commentList}>
        {tops.map((c) => (
          <CommentItem
            key={c._id}
            c={c}
            replies={repliesOf(c._id)}
            meId={user?._id}
            onReply={reply}
            onDelete={remove}
          />
        ))}
        {tops.length === 0 && (
         <p className={s.emptyText}>
            No comments yet — start the conversation
          </p>
        )}
      </div>
    </div>
  );
}