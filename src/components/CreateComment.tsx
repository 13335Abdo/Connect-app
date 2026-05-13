import { Spinner, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import axiosInstance from "../lib/axios";
import type { comentFormat } from "./PostDesign";
import { IoAttachOutline } from "react-icons/io5";
import { useMemo } from "react";
import axios from "axios";
interface LoggedUser {
    photo?: string;
    name?: string;
}
export default function CreateComment({ postId }: { postId: string }) {
    const queryClient = useQueryClient();
    const loged = useMemo<LoggedUser | null>(() => {
        try {
            const raw = localStorage.getItem("loggedUser");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, []);
    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            content: "",
            image: undefined as FileList | undefined,
        },
    });
    const imageFile = watch("image");
    function onSubmit(values: comentFormat) {
        const formData = new FormData();
        if (values.content) {
            formData.append("content", values.content);
        }
        if (values.image?.[0]) {
            formData.append("image", values.image[0]);
        }

        return axiosInstance.post(`/posts/${postId}/comments`, formData);
    }
    const { mutate, isPending } = useMutation({
        mutationFn: onSubmit,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["GetPostComments", postId] });
            toast.success(data.data.message);
            reset();
        },
        onError: (error) => {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Something went wrong"
                : "Something went wrong";
            toast.danger(message)
        },
    });
    return (
        <div className="shrink-0 px-4 py-3 border-t border-gray-100 flex items-center gap-2.5">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 overflow-hidden">
                {loged?.photo ? (
                    <img
                        src={loged.photo}
                        alt={loged.name ?? "User"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-purple-600 text-[11px] font-semibold">
                        {loged?.name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                )}
            </div>
            {/* Form */}
            <form
                onSubmit={handleSubmit(mutate)}
                className="relative flex items-center gap-2.5 flex-1"
            >
                <input
                    {...register("content")}
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 text-[13px] bg-gray-50 border border-gray-200 rounded-full px-4 py-2 pr-10 outline-none focus:border-purple-300 transition-colors"
                />
                {/* File Input */}
                <label className="absolute right-15 cursor-pointer">
                    <IoAttachOutline
                        size={22}
                        className={imageFile?.[0] ? "text-purple-500" : "text-red-400"}
                    />
                    {/* ✅ register بس من غير أي ref تاني */}
                    <input
                        {...register("image")}
                        type="file"
                        accept="image/*"
                        className="hidden"
                    />
                </label>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-8 h-8 cursor-pointer rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center transition-colors shrink-0"
                >
                    {isPending ? (
                        <Spinner size="sm" className="text-white" />
                    ) : (
                        <Send size={14} className="text-white" />
                    )}
                </button>
            </form>
        </div>
    );
}