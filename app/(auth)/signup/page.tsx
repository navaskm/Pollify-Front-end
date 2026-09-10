"use client";

import { useState } from "react";
import { AlertCircle, Camera, Eye, EyeOff, User } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { signupStyles as s, authLayoutStyles as a } from "@/public/style/style";
import { AuthButton, authInputCls } from "@/components/UIElements";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";


const page = () => {

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const {register} = useAuth();
  const router = useRouter();

  const change = (e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, [e.target.name]: e.target.value});

  // for image handling
  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file))
  }

  // to submit the form data and get otp
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {

      const data = new FormData();

      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if(image) data.append("image", image);

      const result = await register(data);

      if (result?.otp) {
        sessionStorage.setItem(`pollify_otp:${form.email}`, result.otp);
      } else {
        sessionStorage.removeItem(`pollify_otp:${form.email}`);
      }

      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);

    } catch (error) {
      console.log("UNKNOWN ERROR:", error);
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data as { message?: string; msg?: string } | undefined;
        setError(
          payload?.message ||
            payload?.msg ||
            (error.code === "ECONNABORTED" ? "Request timed out. Please try again." : "") ||
            error.message ||
            "Signup Failed"
        );
      } else {
        setError("Signup Failed");
      }
    } finally {
      setBusy(false);
    };

  };

  return (
    <>
      <div className={a.headingWrapper}>
        <h1 className={a.pageTitle}>Create Account</h1>
        <p className={a.subtitle}>Join thousands of peoples shaping opinions.</p>
      </div>

      {error && (
        <div className={s.errorBox}>
          <AlertCircle size={16} className={s.errorIcon} />
          <p className={s.errorText}>{error}</p>
        </div>
      )}

      <form onSubmit={submit} className={s.form}>

        {/* avatar field */}
        <div className={s.avatarContainer}>
          <label className={s.avatarLabel}>

            <div className={s.avatarCircle}>
              {preview ? (
                 <img src={preview} alt='preview' className={s.avatarImage} />
              ):(
                <User size={22} className={s.avatarPlaceholder} />
              )}
            </div>

            <span className={s.avatarCamera}>
              <Camera size={10} className={s.avatarCameraIcon} />
            </span>

            <input type="file" accept="image/*" className="hidden" onChange={pickImage} />
          </label>

          <div>
            <div className={s.avatarInfoTitle}>Profile Photo</div>
            <p className={s.avatarInfoSub}>Optional ◽ PNG or JPG</p>
          </div>

        </div>

        {/* name and email */}
        <div className="grid grid-cols-2 gap-3">
          <div className={s.field}>
            <label className={s.label}>Full name</label>
            <input 
              name="name"
              required
              placeholder="John Done"
              value={form.name}
              onChange={change}
              className={authInputCls}
            />
          </div>

          <div className={s.field}>
            <label className={s.label}>Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="your@example.com"
              value={form.email}
              onChange={change}
              className={authInputCls}
            />
          </div>
        </div>

        {/* username */}
        <div className={s.field}>
          <label className={s.label}>Username</label>
          <div className={s.inputWrapper}>
            <span className={s.prefix}>@</span>
          
            <input
              name="username"
              required
              placeholder="john"
              value={form.username}
              onChange={change}
              className={`${s.inputWithPrefix} ${authInputCls}`}
            />
          </div>
        </div>

        {/* password */}
        <div className={s.field}>
          <label className={s.label}>Password</label>
          <div className={s.inputWrapper}>
            <input
              name="password"
              type={show? 'text':'password'}
              required
              placeholder="Min 5 character"
              minLength={5}
              value={form.password}
              onChange={change}
              className={`${s.inputWithSuffix} ${authInputCls}`}
            />

            <button type="button" onClick={()=> setShow(!show)} className={s.toggleButton}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {form.password.length > 0 && (
            <div className={s.strengthContainer}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`${s.strengthBarBase} ${
                    form.password.length >= i * 3
                      ? i <= 1
                        ? s.strengthWeak
                        : i <= 2
                          ? s.strengthMedium
                          : i <= 3
                            ? s.strengthStrong
                            : s.strengthVeryStrong
                      : s.strengthInactive
                  }`}
                />
              ))}
            </div>
          )}
            
        </div>

        <div className="pt-1">
          <AuthButton disabled={busy}>
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
                Creating account…
              </>
            ):(
              "Create Account ➔"
            )}
          </AuthButton>
        </div>
      </form>

      <p className={s.footerText}>
        Already have an account?{" "}
        <Link href="/login" className={s.footerLink}>Sign in</Link>
      </p>

      <p className={s.terms}>
        By creating an account, you agree to our Terms of Services.
      </p>
    </>
  )
}

export default page;