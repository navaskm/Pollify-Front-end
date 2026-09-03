"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { loginStyles as s, authLayoutStyles as a } from "@/public/style/style";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, ArrowRight, CheckCircle, Eye, EyeOff, Mail } from "lucide-react";

const page = () => {

  const [form, setForm] = useState({email:'', password:''});
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const {login} = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const verified = searchParams.get("verified");
  const reset = searchParams.get("reset");

  const notice = verified
    ? "Email verified"
    : reset
      ? "Password updated. Sign in with your new password"
      : "";

  const change = (e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, [e.target.name]: e.target.value});

  // to submit the credentials and get logged in
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      await login(form)
      router.push("/dashboard");
    } catch (error) {
      if(axios.isAxiosError(error)){
        const data = error.response?.data;

        if(data?.needVerification){
          router.push( `/verify-otp?email=${encodeURIComponent(data.email)}`);
          return
        }

        setError(data?.message || data?.msg || "Login failed")
      }
    } finally {
      setBusy(false);
    };

  }

  return (
    <>
      <div className={a.headingWrapper}>
        <h1 className={a.pageTitle}>Welcome Back</h1>
        <p className={a.subtitle}>Sign in to your Pollify</p>
      </div>

      {notice && (
        <div className={s.notice}>
          <CheckCircle size={14} className={s.noticeIcon} />
          <p className={s.noticeText}>{notice}</p>
        </div>
      )}

      {error && (
        <div className={s.error}>
          <AlertCircle size={14} className={s.errorIcon} />
          <p className={s.errorText}>{error}</p>
        </div>
      )}

      <form onSubmit={submit} className={s.form}>
        {/* email */}
        <div className={s.field}>
          <label htmlFor={s.label}>Email address</label>
          <div className={s.inputWrapper}>
            <input 
              type="email" 
              value={form.email} 
              name="email" 
              required 
              placeholder="your@example.com"
              onChange={change}
              className={`${s.input} ${s.inputWithIcon}`}
            />
            <Mail size={14} className={s.icon} />
          </div>
        </div>

        {/* password */}
        <div className={s.field}>
          <div className={s.passwordRow}>
            <label className={s.label}>Password</label>
            <Link href="/forget-password" className={s.forgotLink}>Forget Password?</Link>
          </div>

          <div className={s.inputWrapper}>
            <input 
              type={show? 'text':'password'}
              value={form.password} 
              name="password" 
              required 
              placeholder="Enter your password"
              onChange={change}
              className={`${s.input} ${s.inputWithIcon}`}
            />
            <button type="button" onClick={()=> setShow(!show)} className={s.toggleButton}>
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* submit button */}
        <div className="pt-1">
          <button type="submit" disabled={busy} className={s.submitButton}>
            {busy ? (
               <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Signing in…
              </>
            ):(
              <>
                Sign in <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </form>


      <div className={s.divider}>
        <div className={s.dividerLine}/>
        <span className={s.dividerText}>New to Pollify?</span>
        <div className={s.dividerLine}/>
      </div>

      <Link href="/signup" className={s.signupLink}>
        Create a free account
      </Link>
    </>
  )
}

export default page;