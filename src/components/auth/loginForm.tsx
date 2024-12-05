"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline, IoLogInOutline } from "react-icons/io5";
import { setToLocalStorageAsStringify } from "@/utils/local-storage";
import { AUTH_KEY, PERSONAL_INFO } from "@/constant/storage.key";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/helper/axios/axiosInstance";

type Inputs = {
  UserName: string;
  Password: string;
};

async function loginUser(data: Inputs) {
  const response = await axiosInstance.post(
    "/api/Login/IsValidUserWithJWTToken",
    {
      UserName: data.UserName,
      password: data.Password,
    }
  );
  return response.data;
}

export default function LoginForm() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: loginUser,
    onMutate: () => {},
    onSuccess: (data) => {
      const { message, jwtToken } = data;
      setToLocalStorageAsStringify(AUTH_KEY, jwtToken);
      router.replace("/request");

      toast.success(message ? message : "Login Successful.");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center lg:min-h-screen dark:bg-inherit px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            GATEPASS SYSTEM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* User Name Input */}
            <div className="space-y-2">
              <Label htmlFor="UserName">User Name</Label>
              <Input
                id="UserName"
                placeholder="Enter your username"
                {...register("UserName", { required: "User Name is required" })}
              />
              {errors.UserName && (
                <p className="text-red-500 text-sm">
                  {errors.UserName.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2 relative">
              <Label htmlFor="Password">Password</Label>
              <Input
                id="Password"
                type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                placeholder="Enter your password"
                {...register("Password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {isPasswordVisible ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </button>
              {errors.Password && (
                <p className="text-red-500 text-sm">
                  {errors.Password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isLoading}
              size="lg"
            >
              {mutation.isLoading ? "Loading..." : "Login"}
              {!mutation.isLoading && (
                <IoLogInOutline size={20} className="ml-2" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
