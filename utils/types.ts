import { ReactNode } from "react";

export type User = {
  _id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  bio: string;
  // bookmarks: string[];
  // following: string[];
  // isVerified: boolean;
  // createdAt: string;
  // updatedAt: string;
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

export type AuthContextType = {
  user: User | null;
  status: AuthStatus;
  loading: boolean;

  register: (formateData: FormData) => Promise<void>;
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
  onResend: () => void | Promise<void>;
  submitText?: string;
};

export type UIElementsAvatarProps = {
  user?: User | null;
  className?: string;
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

export type PollType = "single" | "yesno" | "rating" | "image" | "open" | "all";

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
};