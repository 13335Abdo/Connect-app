import { X } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { PostType } from "../Home/Home";
import axiosInstance from "../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@heroui/react";
import axios from "axios";

interface Props {
    post: PostType;
    setisOpened: (x: boolean) => void;
}
type FormValues = {
    body: string;
};

export default function SharePost({ post, setisOpened }: Props) {
    const client = useQueryClient()
    const { register, handleSubmit } = useForm<FormValues>({
        defaultValues: { body: "" }
    });

    const userName = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}").username ?? ""; }
        catch { return ""; }
    }, []);

    const userPhoto = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}").photo ?? ""; }
        catch { return ""; }
    }, []);

    function onSubmit(values: FormValues) {
        console.log(values);
        return axiosInstance.post(`/posts/${post._id}/share`,values)
    }
    const{mutate,isPending}=useMutation({
        mutationFn:onSubmit,
        mutationKey:["sharePost"],
        onSuccess:(data)=>{
            console.log("data from share post",data);
            client.invalidateQueries({ queryKey: ["allposts"] })
            

            setisOpened(false)
            toast.success("post shared successfully")
            
        },
        onError:(erorr)=>{
            setisOpened(false)
            const message = axios.isAxiosError(erorr)
                ? erorr.response?.data?.errors ?? "unexpected error"
                : "unexpected error";
            toast.danger(message);
        }
    })

    return (
        <div
            className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setisOpened(false)}
        >
            <form
                onSubmit={handleSubmit((values) => mutate(values))}
                className="bg-white rounded-2xl w-full max-w-[480px] overflow-hidden border border-white/80 shadow-2xl shadow-slate-950/20"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <span className="text-[15px] font-bold text-slate-900">Share post</span>
                    <button type="button" onClick={() => setisOpened(false)} className="cursor-pointer w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-4">
                    {/* User */}
                    <div className="flex items-center gap-2.5">
                        <img src={userPhoto} alt={userName} className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-slate-100" />
                        <span className="text-[14px] font-bold text-slate-900">{userName}</span>
                    </div>

                    {/* Input */}
                    <textarea
                        {...register("body")}
                        placeholder="Say something about this..."
                        className="w-full min-h-[90px] bg-transparent border-none outline-none resize-none text-[15px] text-slate-800 placeholder:text-slate-400 leading-relaxed"
                    />

                    {/* Original post preview */}
                    <div className="border border-slate-200 rounded-2xl p-3 flex flex-col gap-2 bg-slate-50">
                        <div className="flex items-center gap-2">
                            <img src={post.user.photo} alt={post.user.name} className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-white" />
                            <div>
                                <p className="text-[12px] font-semibold text-slate-900">{post.user.name}</p>
                                <p className="text-[11px] text-slate-400">{new Date(post.createdAt).toLocaleString("eg", { year: "numeric", day: "numeric", month: "short" })}</p>
                            </div>
                        </div>
                        {post.body && <p className="text-[13px] text-slate-600 leading-relaxed">{post.body}</p>}
                        {post.image && <img src={post.image} alt="post" className="w-full h-36 object-cover rounded-xl" />}
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Footer */}
                    <div className="flex justify-end">
                        <button disabled={isPending} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-full transition-colors cursor-pointer shadow-sm shadow-blue-200 disabled:opacity-70">
                           {isPending? "Loading..." : "Share now" } 
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
