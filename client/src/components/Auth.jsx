import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";

// Email Regex for basic validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name,setname] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");

  const validateEmail = (email) => emailRegex.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleSignUp = async () => {
    if (!email) return toast.error("Email is required");
    if (!validateEmail(email)) return toast.error("Enter a valid email address");

    if (!password) return toast.error("Password is required");
    if (!validatePassword(password))
      return toast.error("Password must be at least 6 characters");

    if (!confirmpassword) return toast.error("Please confirm your password");
    if (password !== confirmpassword)
      return toast.error("Password and confirm password do not match");

    try {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { name, email, password},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("User Registered");
        dispatch(loginSuccess(response.data.message));
        navigate("/movies")
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Something went wrong during signup");
    }
  };

  const handleLogin = async () => {
    if (!email) return toast.error("Email is required");
    if (!validateEmail(email)) return toast.error("Enter a valid email address");

    if (!password) return toast.error("Password is required");

    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Welcome back user");
         dispatch(loginSuccess(response.data.message));
          navigate("/movies");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong during login");
    }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="bg-white shadow-2xl rounded-3xl w-[90vw] sm:w-[80vw] md:w-[60vw] xl:w-[50vw] 2xl:w-[40vw] p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Welcome</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details to get started with the best Task Management app
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-gray-100 rounded-full p-1">
            <TabsTrigger
              value="login"
              className="w-full rounded-full text-sm md:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:text-black transition-all cursor-pointer"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="w-full rounded-full text-sm md:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:text-black transition-all cursor-pointer"
            >
              SignUp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="flex flex-col gap-4 mt-6">
            <Input
              placeholder="Email"
              type="email"
              className="rounded-full px-6 py-4"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              className="rounded-full px-6 py-4"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <Button className="rounded-full mt-4 cursor-pointer" onClick={handleLogin}>
              Login
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="flex flex-col gap-4 mt-6">
          <Input
              placeholder="Name"
              type="email"
              className="rounded-full px-6 py-4"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              className="rounded-full px-6 py-4"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              className="rounded-full px-6 py-4"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              className="rounded-full px-6 py-4"
              value={confirmpassword}
              onChange={(e) => setconfirmpassword(e.target.value)}
            />
            <Button className="rounded-full mt-4 cursor-pointer" onClick={handleSignUp}>
              Sign Up
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
