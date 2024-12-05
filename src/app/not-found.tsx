"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const navigate = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-৯00">404</h1>
      <p className="text-xl text-gray-600 mt-4">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Button
        className="mt-6"
        onClick={() => navigate.push("/")}
        variant="default"
      >
        Go Back Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
