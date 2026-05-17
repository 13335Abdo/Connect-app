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
            className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setisOpened(false)}
        >
            <form
                onSubmit={handleSubmit((values) => mutate(values))}
                className="bg-white rounded-xl w-full max-w-[480px] overflow-hidden border border-gray-100 shadow-xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                    <span className="text-[15px] font-semibold text-gray-900">Share post</span>
                    <button type="button" onClick={() => setisOpened(false)} className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-4">
                    {/* User */}
                    <div className="flex items-center gap-2.5">
                        <img src={userPhoto} alt={userName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <span className="text-[14px] font-medium text-gray-900">{userName}</span>
                    </div>

                    {/* Input */}
                    <textarea
                        {...register("body")}
                        placeholder="Say something about this..."
                        className="w-full min-h-[80px] bg-transparent border-none outline-none resize-none text-[15px] text-gray-800 placeholder:text-gray-400 leading-relaxed"
                    />

                    {/* Original post preview */}
                    <div className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2 bg-gray-50">
                        <div className="flex items-center gap-2">
                            <img src={post.user.photo} alt={post.user.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                            <div>
                                <p className="text-[12px] font-semibold text-gray-900">{post.user.name}</p>
                                <p className="text-[11px] text-gray-400">{new Date(post.createdAt).toLocaleString("eg", { year: "numeric", day: "numeric", month: "short" })}</p>
                            </div>
                        </div>
                        {post.body && <p className="text-[13px] text-gray-600 leading-relaxed">{post.body}</p>}
                        {post.image && <img src={post.image} alt="post" className="w-full h-32 object-cover rounded-md" />}
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Footer */}
                    <div className="flex justify-end">
                        <button disabled={isPending} type="submit" className="bg-purple-500 hover:bg-purple-600 text-white text-[14px] font-medium px-5 py-2 rounded-full transition-colors cursor-pointer">
                           {isPending? "Loading..." : "Share now" } 
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
