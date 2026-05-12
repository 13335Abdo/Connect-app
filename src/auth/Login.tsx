import { Input, Button, Label, toast, Spinner } from "@heroui/react";
import imge from "../assets/signUpimage.avif";
import img from "../../public/Gemini_Generated_Image_4viszz4viszz4vis.png";
import { Controller, useForm } from "react-hook-form";
import axios from 'axios';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { authContext } from "../contrext/AuthContext";
import axiosInstance from "../lib/axios";
import { userContex } from "../contrext/UserContext";

const schema = z.object(
  {
    email: z.email("please enter valid email 'ahmed@example.com' "),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"),
  }
)

interface Values {
  email: string,
  password: string,
}
interface LoginType {
  expiresIn: string,
  token: string,
  tokenType: string,
  user: UserType,
}
interface UserType {
  user: string,
  cover: string,
  email: string,
  name: string,
  photo: string,
  username: string,
  _id: string,
}



export default function Login() {


  const { settoken } = useContext(authContext)

  const [isLoading, setisLoading] = useState(false)

  const navigate = useNavigate()

  async function handelSubmitform(values: Values): Promise<LoginType | null> {
    setisLoading(true)
    console.log("values", values);
    try {
      const { data } = await axiosInstance.post(
        '/users/signin',
        values
      );
      console.log(data);

      if (data.success) {

        setisLoading(false)

        toast.success("login successfully")

        navigate("/")

        localStorage.setItem("token", data.data.token)

        settoken(data.data.token)

        localStorage.setItem("loggedUser",JSON.stringify(data.data.user))


        return data.data


      } else return null
    }
    catch (e) {
      console.log(e);
      toast.danger("login faild")
      return null


    }
  }






  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }, resolver: zodResolver(schema)
  })



  return (
    <div className="flex min-h-lvh">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0C447C 0%, #185FA5 50%, #378ADD 100%)" }}>
        <img src={imge} alt="signup" className="w-full h-full object-cover opacity-20 absolute inset-0" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white text-lg" src={img} />
            <span className="text-white font-medium text-base">ConnectApp</span>
          </div>

          {/* Hero Text */}
          <div>
            <h1 className="text-white text-3xl font-semibold leading-snug mb-3">
              Welcome back<br />to your community
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Sign in to continue your journey with us
            </p>

          </div>

          <p className="text-white/30 text-xs">© 2026 ConnectApp. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Sign in</h2>
          <p className="text-sm text-gray-400 mb-8">Enter your credentials to access your account</p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(handelSubmitform)}>


            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="input-type-email">Email*</Label>
                  <Input
                    {...field}
                    placeholder="ahmed@example.com"
                    type="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
                  )}

                </div>
              )}

            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="input-type-email">Password*</Label>
                  <Input
                    {...field}
                    placeholder="••••••••"
                    type="password"
                    aria-invalid={fieldState.invalid}

                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
                  )}

                </div>
              )}

            />


            <Button
              isDisabled={isLoading}
              type="submit"
              className="mt-2 w-full font-medium"
              style={{ background: "linear-gradient(135deg, #185FA5, #378ADD)" }}
            >
              {isLoading ? <>loading... <Spinner size="sm" /></> : <span>Sign in →</span>}

            </Button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}