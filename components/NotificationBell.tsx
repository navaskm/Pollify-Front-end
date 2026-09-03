"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { notificationStyles as s } from "@/public/style/style";
import useClickOutside from "@/hooks/useClickOutside";
import api from "@/utils/api";
import { NotificationType } from "@/utils/types";

const verb = (t: string) => t === 'vote' ? 'voted on your poll' : 'commented on your poll';

const NotificationBell = () => {

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationType[]>([]);
  const [unRead, setUnRead] = useState(0);

  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  // to load notifications
  const load = async () => {
    try {
      const { data } = await api.get("/notifications");

      setItems(data.items);
      setUnRead(data.unread);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000); // 30 second
    return () => clearInterval(t);
  },[]);

  // to mark as read
  const toggle = async () => {
    const next = !open;
    setOpen(next);

    if(next && unRead){
      try {
        await api.patch('/notifications/read');
        setUnRead(0);
      } catch (error) {
        
      }
    };
  };

  return (
    <div className={s.container} ref={ref}>
      <button onClick={toggle} className={s.bellButton}>
        <Bell size={16} />
        {unRead > 0 && <span className={s.badgeDot}></span>}
      </button>

      {open && (
        <div className={s.dropdown}>
          <div className={s.header}>
            <p className={s.headerText}>Notifications</p>
          </div>
          {items.length === 0 ? (
            <p className={s.emptyText}>No notifications yet.</p>
          ) : (
            items.map((n) => (
              <Link
                key={n._id}
                href={n.poll ? `/poll/${n.poll._id}` : "/dashboard"}
                onClick={() => setOpen(false)}
                className={`${s.notificationLink} ${
                  !n.read ? s.notificationUnread : ""
                }`}
              >
                <span className={s.notificationText}>
                  <span className={s.actorName}>
                    @{n.actor?.username}
                  </span>{" "}
                  {verb(n.type)}
                  {n.poll?.question ? (
                    <span className={s.pollPreview}>
                      {" "}
                      · "{n.poll.question.slice(0, 40)}"
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
   
    </div>
  )
}

export default NotificationBell