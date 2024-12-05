import React from "react";
import LoginForm from "@/components/auth/loginForm";
import LottieFile from "@/components/shared/lottie-file";
import lottieImage from "../../../public/assets/illustrations/login.json";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naturub | Login",
};

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-2 px-4 md:px-8">
      <div className="w-full md:w-1/2 flex justify-center">
        <LottieFile
          className="w-72 md:w-[500px]"
          lottieAnimation={lottieImage}
        />
      </div>
      <div className="w-full lg:w-1/3">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
