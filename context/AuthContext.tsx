"use client";
import { createContext, useContext, useState, useEffect, ReactNode} from "react";
import api from "@/utils/api";
import { User, VerifyOtpData, LoginData, LoginResponse, ResetPasswordData, ChangePasswordData, AuthContextType } from '@/utils/types'


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export function AuthProvider({children}: { children: ReactNode }){

  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState({created:0, voted:0, bookmarked:0});
  const [loading, setLoading] = useState(true)

  // TO LOAD USER PROFILE
  const loadMe = async () => {
    try {
      const {data} = await api.get('/auth/me');
      setUser(data.user);
      setStatus(data.status);
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(localStorage.getItem("token")){
      loadMe()
    }else{
      setLoading(false)
    }
  },[]);

  // TO SAVE THE TOKEN INSIDE THE LOCALSTORAGE
  const saveToken = async (token: string) => {
    localStorage.setItem("token", token);
    await loadMe();
  };

  // TO REGISTER A USER
  const register = async (formData: FormData) => {
    const { data } = await api.post("/auth/register", formData);
    return data as {
      needVerification: boolean;
      email: string;
      emailSent?: boolean;
      otp?: string;
    };
  };

  // TO VERIFY OTP
  const verifyOtp = (payload: VerifyOtpData) => api.post("/auth/verify-otp", payload);

  // TO RESEND THE OTP
  const resendOtp = async (email: string) => {
    const { data } = await api.post("/auth/resend-otp", { email });
    return data as { msg?: string; emailSent?: boolean; otp?: string };
  };

  // TO LOGIN
  const login = async (payload: LoginData) => {
    const {data} = await api.post<LoginResponse>("/auth/login", payload);
    await saveToken(data.token);
  }

  // TO FORGET, VERIFY OTP, AND REST THE PASSWORD
  const forgetPassword = (email: string) => api.post("/auth/forget-password", {email});
  const verifyRestOtp = (payload: VerifyOtpData) => api.post("/auth/verify-reset-otp", payload);
  const resetPassword = (payload: ResetPasswordData) => api.post("/auth/reset-password", payload);

  // FOR SETTINGS PAGE TO UPDATE PROFILE AND CHANGE PASSWORD
  const updateProfile = async (formData: FormData) => {
    const {data} = await api.patch("/auth/profile", formData);
    setUser(data.user)
  };

  const changePassword = (payload: ChangePasswordData) => api.patch("/auth/password", payload);

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  // TO DELETE AN ACC
  const deleteACC = async () => {
    await api.delete("/auth/account");
    logout();
  };

  return (
    <AuthContext.Provider value={{
        user,
        status,
        loading,
        register,
        verifyOtp,
        resendOtp,
        login,
        forgetPassword,
        verifyRestOtp,
        resetPassword,
        updateProfile,
        changePassword,
        deleteACC,
        logout,
        refresh: loadMe
      }}
    >
      {children}
    </AuthContext.Provider>
  )
};
