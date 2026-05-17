import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface FormValues {
  password: string;
  newPassword: string;
}

const scema = z.object({
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"),
  newPassword: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character")

})
export default function ChangePassword() {
  const navigate = useNavigate()
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues:{
      password:"",
      newPassword:"",
    },resolver:zodResolver(scema)
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    return axiosInstance.patch(`/users/change-password`,values)
  }
  const {mutate , isPending} = useMutation({
    mutationFn:onSubmit,
    mutationKey:["ChangePassword"],
    onSuccess:()=>{
      toast.success("password changed successfully")
      navigate("/")
    },
    onError:(erorr)=>{
      const message = axios.isAxiosError(erorr)
        ? erorr.response?.data?.errors ?? "unexpected error"
        : "unexpected error";
      toast.danger(message)
    }
  })

  return (
    <div className="w-full max-w-md mx-auto mt-6 sm:mt-10 px-4 sm:px-6 py-6 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col gap-5">
      <h2 className="text-[16px] font-semibold text-gray-900">Change Password</h2>

      <form onSubmit={handleSubmit((values) => mutate(values))} className="flex flex-col gap-4">
        {/* Old Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-700">Old Password</label>
          <div className="relative">
            <input
              {...register("password", { required: "Old password is required" })}
              type={show.old ? "text" : "password"}
              placeholder="Enter old password"
              className="w-full text-[13px] bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 outline-none focus:border-purple-400 transition-colors"
            />
            <button type="button" onClick={() => setShow(s => ({ ...s, old: !s.old }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              {show.old ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-[12px] text-red-500">{errors.password.message}</p>}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-700">New Password</label>
          <div className="relative">
            <input
              {...register("newPassword", { required: "New password is required", minLength: { value: 6, message: "At least 6 characters" } })}
              type={show.new ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full text-[13px] bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 outline-none focus:border-purple-400 transition-colors"
            />
            <button type="button" onClick={() => setShow(s => ({ ...s, new: !s.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-[12px] text-red-500">{errors.newPassword.message}</p>}
        </div>


        <button disabled={isPending} type="submit" className="bg-purple-500 disabled:bg-gray-500 hover:bg-purple-600 text-white text-[14px] font-medium py-2.5 rounded-full transition-colors cursor-pointer mt-1">
          {isPending? "Loading..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
