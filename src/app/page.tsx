import React from "react";
import dynamic from "next/dynamic";
import lottieImage from "../../public/assets/illustrations/login.json";

const LoginForm = dynamic(() => import("@/components/auth/loginForm"));
const LottieFile = dynamic(() => import("@/components/shared/lottie-file"));

const HomePage = () => {
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

export default HomePage;
