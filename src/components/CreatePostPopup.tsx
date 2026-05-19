import { X, Image } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@heroui/react";
import axios from "axios";

interface Props {
    userimage: string;
    userName: string;
    setisOpened: (x: boolean) => void
}
type FormValues = {
    body: string;
    image?: FileList;
};

export default function CreatePostPopup({ setisOpened, userimage, userName }: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const client = useQueryClient()

    const { handleSubmit, register, resetField } = useForm<FormValues>({
        defaultValues: {
            body: "",
            image: undefined,
        }
    })
    function createPost(values: FormValues) {
        const formData = new FormData()
        if (values.body) {
            formData.append("body", values.body)
        }
        if (values.image?.[0]) {
            formData.append("image", values.image[0])
        }
        return axiosInstance.post(`/posts`, formData)
    }
    const { mutate } = useMutation({
        mutationFn: createPost,
        mutationKey: ["createPost"],
        onSuccess: (data) => {

            console.log("data", data);
            
            toast.success("post create successfully")
            
            setisOpened(false)

            client.invalidateQueries({ queryKey: ["allposts"] })


            
        },
        onError: (error) => {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "unexpected error"
                : "unexpected error";
            toast.danger(message)
            
            setisOpened(false)
        }
    })

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPreviewImage(URL.createObjectURL(file));
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center p-4"
        // onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <form onSubmit={handleSubmit((values) => mutate(values))} className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto border border-white/80 shadow-2xl shadow-slate-950/20">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <span className="text-[15px] font-bold text-slate-900">Create post</span>
                    <button onClick={() => setisOpened(false)} className="cursor-pointer w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-4">
                    {/* User row */}
                    <div className="flex items-center gap-2.5">
                        <img src={userimage} alt={userName} className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-slate-100" />
                        <span className="text-[14px] font-bold text-slate-900">{userName}</span>
                    </div>

                    {/* Textarea */}
                    <textarea
                        {...register("body")}
                        placeholder="What's on your mind?"
                        className="w-full min-h-[120px] bg-transparent border-none outline-none resize-none text-[16px] text-slate-800 placeholder:text-slate-400 leading-relaxed"
                    />

                    {/* Image preview */}
                    {previewImage && (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-100">
                            <img src={previewImage} alt="preview" className="w-full h-56 object-cover" />
                            <button
                                type="button"
                                onClick={() => { setPreviewImage(null); resetField("image") }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/55 flex items-center justify-center text-white"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="h-px bg-slate-100" />

                    {/* Toolbar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <label className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                                <Image size={20} />
                                <input type="file" {...register("image",{
                                    onChange:handleImage
                                })} accept="image/*" className="hidden" />
                            </label>
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-blue-200">
                            Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
