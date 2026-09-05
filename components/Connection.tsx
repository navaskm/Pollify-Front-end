import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../utils/api";
import { Avatar } from "./UIElements";
import { connectionsStyles as s } from "@/public/style/style";
import { User } from "@/utils/types";

export default function Connections({ 
  username,
  initialTab = "followers" 
}:{
  username: string,
  initialTab: "followers" | "following" | null
}) {

  const [tab, setTab] = useState<"followers" | "following" | null>(initialTab);
  const [data, setData] = useState<{
    followers: User[];
    following: User[];
  }>({ followers: [], following: [] });

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // to get user who is following
  useEffect(() => {
    if (!username) return;
    api
      .get(`/users/${username}/connections`)
      .then(({ data }) => setData(data))
      .catch(() => {});
  }, [username]);

  const list = tab === "followers" ? data.followers : data.following;

  const TABS: [
    "followers" | "following",
    string,
    number
  ][] = [
    ["followers", "Followers", data.followers.length],
    ["following", "Following", data.following.length],
  ];

  return (
    <div className={s.container}>
      <div className={s.tabContainer}>
        {TABS.map(([k, label, n]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`${s.tabButtonBase} ${
              tab === k ? s.tabButtonActive : s.tabButtonInactive
            }`}
          >
            {label} {n}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className={s.emptyText}>
          {tab === "followers"
            ? "No followers yet."
            : "You're not following anyone yet."}
        </p>
      ) : (
        <div className={s.userList}>
          {list.map((u) => (
            <Link
              key={u._id}
              href={`/user/${u.username}`}
              className={s.userLink}
            >
              <Avatar user={u} className={s.userAvatar} />
              <div className={s.userInfo}>
                <p className={s.userName}>{u.name}</p>
                <p className={s.userUsername}>@{u.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}