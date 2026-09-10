import { ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

export type User = {
  _id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  bio: string;
};

export type VerifyOtpData = {
  email: string;
  otp: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type ResetPasswordData = {
  email: string;
  otp: string;
  password: string;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

type AuthStatus = {
  created: number;
  voted: number;
  bookmarked: number;
};

export type RegisterResponse = {
  needVerification: boolean;
  email: string;
  emailSent?: boolean;
  otp?: string;
};

export type AuthContextType = {
  user: User | null;
  status: AuthStatus;
  loading: boolean;

  register: (formateData: FormData) => Promise<RegisterResponse>;
  verifyOtp: (payload: VerifyOtpData) => Promise<any>;
  resendOtp: (email: string) => Promise<any>;
  login: (payload: LoginData) => Promise<void>;

  forgetPassword: (email: string) => Promise<any>;
  verifyRestOtp: (payload: VerifyOtpData) => Promise<any>;
  resetPassword: (payload: ResetPasswordData) => Promise<any>;

  updateProfile: (formData: FormData) => Promise<void>;
  changePassword: (payload: ChangePasswordData) => Promise<any>;

  deleteACC: () => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

export type OtpStepProps = {
  email: string;
  onSubmit: (otp: string) => void | Promise<void>;
  onResend: () => void | Promise<string | void>;
  submitText?: string;
};

export type UIElementsAvatarProps = {
  user?: {
    name?: string;
    avatar?: string;
  } | null;
  className?: string;
};

export type UIElementsButtonVariant = "primary" | "ghost" | "danger";

export type UIElementsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: UIElementsButtonVariant;
};

export type NotificationType = {
  _id: string;
  type: string;
  read: boolean;
  actor?: {
    name: string;
    username: string;
    avatar: string;
  };
  poll?: {
    _id: string;
    question: string;
  };
};

export type TrendingItem = {
  type: "single" | "yesno" | "rating" | "image" | "open";
  count: number;
};

type ToastType = "success" | "error";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

export type ToastFunction = (
  message: string,
  type?: ToastType
) => void;

export type PollType = "single" | "yesno" | "rating" | "image" | "open";
export type PollFilter = "all" | "following" | PollType;

type PollOption = {
  text: string;
  image?: string;
};

type PollResult = {
  text?: string;
  image?: string;
  index?: number;
  star?: number;
  label?: string;
  count: number;
  percent: number;
};

type Vote = {
  user: string;
  value: string | number;
  createdAt?: string;
  updatedAt?: string;
};

export type Poll = {
  _id: string;
  question: string;
  type: PollType;
  category: string;
  closed: boolean;
  createdAt: string;
  creator: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
  };
  options: PollOption[];
  votes: Vote[];
  views: number;
  totalVotes: number;
  results: PollResult[];
  myVote: string | number | null;
  isBookmarked: boolean;
  saves: number;
  comments: number;
};

export type FeedType = "all" | "following";

export type FeedTab = {
  key: FeedType;
  label: string;
  Icon: React.ElementType;
};

export type PollCardProps = {
  poll: Poll;
  vote: (pollId: string, value: string | number) => Promise<void>;
  unvote?: (pollId: string) => Promise<void>;
  bookmark: (pollId: string) => Promise<void>;

  edit?: (
    pollId: string,
    data: {
      question: string;
      category: string;
    }
  ) => Promise<void>;

  close?: (pollId: string) => Promise<void>;
  remove?: (pollId: string) => Promise<void>;
  owner?: boolean;
};

export type PollVoteProps = {
  poll: Poll;
  onVote: (value: string | number) => void | Promise<void>;
  onUnvote?: () => void | Promise<void>;
};

export type Comment = {
  _id: string;
  poll: string;
  user: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
  };
  parent: string | null;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentItemProps = {
  c: Comment;
  replies: Comment[];
  meId?: string;
  onReply: (commentId: string, text: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
};

export type PollResultsProps = {
  poll: Poll;
  onUnvote?: () => void | Promise<void>;
};

export type VersusBarProps = {
  results: PollResult[];
  myVote: string | number | null;
  total: number;
  onUnvote?: () => void | Promise<void>;
};

export type ResultBarProps = {
  label: string;
  percent: number;
  highlight: boolean;
  winner: boolean;
  onClick?: () => void;
};

export type PollListPageProps = {
  endpoint: string;
  title: string;
  emptyTitle: string;
  emptyText: string;
  EmptyIcon: LucideIcon;
};

export type PublicProfileData = {
  user: {
    _id: string;
    name: string;
    username: string;
    avatar: string;
    bio: string;
  };
  isFollowing: boolean;
  isMe: boolean;
  stats: {
    created: number;
    voted: number;
    followers: number;
    following: number;
  };
  polls: Poll[];
};

export type PollAnalytics = {
  poll: Poll;
  comments: number;
};

export type StatCardProps = {
  Icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
};