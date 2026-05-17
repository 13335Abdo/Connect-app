import { Input, Button, RadioGroup, Radio, Label, toast, Spinner } from "@heroui/react";
import imge from "../assets/signUpimage.avif";
import img from "../../public/Gemini_Generated_Image_4viszz4viszz4vis.png";
import { Controller, useForm } from "react-hook-form";
import axios from 'axios';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../lib/axios";
const schema = z.object({
  name: z.string("name must be string").min(2, "name must be above 2 char"),
  username: z.string("user name must be string").regex(/^[a-z0-9_]{3,30}$/, "Username must be 3-30 characters long and can only contain lowercase letters, numbers, and underscores"),
  email: z.email("please enter valid email 'ahmed@example.com' "),
  dateOfBirth: z.string().min(1, "enter your birthday"),
  gender: z.enum(["male", "female"], "choose gender"),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"),
  rePassword: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"),
}).refine((params) => params.password === params.rePassword, { message: "password should equal repassword", path: ["rePassword"] })


interface Values {
  name: string,
  username: string,
  email: string,
  dateOfBirth: string,
  gender: string,
  password: string,
  rePassword: string,
}



export default function Signup() {
  const [isLoading, setisLoading] = useState(false)

  const navigate = useNavigate()

  async function handelSubmitform(values: Values) {
    setisLoading(true)
    console.log("values", values);
    try {
      const { data } = await axiosInstance.post(
        '/users/signup',
        values
      );
      console.log(data);

      if (data.success) {

        setisLoading(false)

        toast.success("account created successfuly")

        navigate("/login")


      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setisLoading(false)
        console.log("API error:", error.response?.data); // هنا هتشوف الـ message من الـ API
        toast.danger(error.response?.data.message)
      }
    }
  }






  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: undefined,
      password: "",
      rePassword: "",

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
              Start your journey <br /> with us today
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Join thousands of users and unlock <br /> a better experience.
            </p>

          </div>

          <p className="text-white/30 text-xs">© 2026 ConnectApp. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 sm:py-12 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Create account</h2>
          <p className="text-sm text-gray-400 mb-8">Fill in the details below to get started</p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(handelSubmitform)}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="name">Name*</Label>
                    <Input {...field} id="name" placeholder="Enter your name" type="text" aria-invalid={fieldState.invalid} />
                    {errors.name && (
                      <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
                    )}
                  </div>
                )}
              />


              <Controller
                name="username"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="input-type-email">User name*</Label>
                    <Input
                      {...field}
                      id="input-type-email"
                      placeholder="Enter user name"
                      type="text"
                      aria-invalid={fieldState.invalid}
                    />
                    {errors.username &&
                      <span className="text-red-500 text-xs mt-1">{errors.username.message}</span>

                    }

                  </div>
                )}


              />

            </div>

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
            <Controller
              name="rePassword"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="input-type-email">Confirm password*</Label>
                  <Input
                    {...field}
                    placeholder="••••••••"
                    type="password"
                    aria-invalid={fieldState.invalid}
                  />
                  {errors.rePassword && (
                    <span className="text-red-500 text-xs mt-1">{errors.rePassword.message}</span>
                  )}

                </div>
              )}

            />


            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="input-type-email">date of birth*</Label>
                  <Input
                    {...field}
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {errors.dateOfBirth && (
                    <span className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</span>
                  )}

                </div>
              )}

            />




            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-4 mt-2">
                  <RadioGroup {...field} name="plan-orientation" orientation="horizontal">
                    <Radio value="male" >
                      <Radio.Control className="border-2">
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>
                        <Label>male</Label>
                      </Radio.Content>
                    </Radio>
                    <Radio value="female">
                      <Radio.Control className="border-2">
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>
                        <Label>female</Label>
                      </Radio.Content>
                    </Radio>
                  </RadioGroup>
                  {errors.gender && (
                    <span className="text-red-500 text-xs mt-1">{errors.gender.message}</span>
                  )}
                </div>
              )}

            />


            <Button
              type="submit"
              className="mt-2 w-full font-medium"
              style={{ background: "linear-gradient(135deg, #185FA5, #378ADD)" }}
            >
              {isLoading ? <>loading... <Spinner size="sm" /></> : <span>Create account →</span>}
            </Button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
