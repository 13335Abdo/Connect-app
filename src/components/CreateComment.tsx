import { Spinner, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import axiosInstance from "../lib/axios";
import type { comentFormat } from "./PostDesign";
import { IoAttachOutline } from "react-icons/io5";
import { useContext, useMemo, useState } from "react";
import axios from "axios";
import { profilephotoContext } from "../contrext/photoContext";
interface LoggedUser {
    photo?: string;
    name?: string;
}
export default function CreateComment({ postId }: { postId: string }) {
    const queryClient = useQueryClient();
    const [hasImage, setHasImage] = useState(false);

    const { profilePicture } = useContext(profilephotoContext)
    const loged = useMemo<LoggedUser | null>(() => {
        try {
            const raw = localStorage.getItem("loggedUser");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, []);
    const { register, handleSubmit, reset } = useForm<comentFormat>({
        defaultValues: {
            content: "",
            image: undefined as FileList | undefined,
        },
    });
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
            // @ts-ignore
            queryClient.invalidateQueries(["GetPostComments", postId]);
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
        <div className="shrink-0 px-4 py-3 border-t border-slate-100 bg-white flex items-center gap-2.5">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-slate-100">
                {loged?.photo ? (
                    <img
                        // @ts-ignore
                        src={profilePicture ?? loged.photo}
                        alt={loged.name ?? "User"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-blue-600 text-[11px] font-semibold">
                        {loged?.name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                )}
            </div>
            {/* Form */}
            <form
                onSubmit={handleSubmit((values) => mutate(values))}
                className="relative flex items-center gap-2.5 flex-1"
            >
                <input
                    {...register("content")}
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 text-[13px] bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 pr-10 outline-none focus:border-blue-300 focus:bg-white transition-colors"
                />
                {/* File Input */}
                <label className="absolute right-15 cursor-pointer">
                    <IoAttachOutline
                        size={22}
                        className={hasImage ? "text-blue-500" : "text-slate-400"}
                    />
                    {/* ✅ register بس من غير أي ref تاني */}
                    <input
                        {...register("image", {
                            onChange: (e) => setHasImage(Boolean(e.target.files?.[0])),
                        })}
                        type="file"
                        accept="image/*"
                        className="hidden"
                    />
                </label>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-9 h-9 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shrink-0 shadow-sm shadow-blue-200"
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
