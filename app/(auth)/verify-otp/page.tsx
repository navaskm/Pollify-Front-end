"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import OtpStep from "@/components/OtpStep";
import { verifyOtpStyles as s, authLayoutStyles as a } from "@/public/style/style";
import { useAuth } from "@/context/AuthContext";

const page = () => {

  const {verifyOtp, resendOtp} = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  if (!email) {
    router.replace("/signup");
    return null;
  };

  // to submit otp
  const submit = async (otp: string) => {
    await verifyOtp({email, otp})
    router.push("/login?verified=true");
  };

  const handleResend = async () => await resendOtp(email);

  return (
    <>
      <div className={a.headingWrapper}>
        <h1 className={a.pageTitle}>Check your inbox</h1>
        <p className={a.subtitle}>We send a 6-digits code to verify your email address.</p>
      </div>

      <OtpStep
        email={email}
        onSubmit={submit}
        onResend={handleResend}
        submitText="Verify email ➔"
      />
      <p className={s.footerText}>
        Wrong email?{" "}
        <Link href='/signup' className={s.link}>
          Go Back
        </Link>
      </p>
    </>
  )
}

export default page;
