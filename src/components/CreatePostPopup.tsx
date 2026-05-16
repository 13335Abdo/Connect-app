import { X, Image, Smile, AtSign } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@heroui/react";

interface Props {
    userimage: string;
    userName: string;
    setisOpened: (x: boolean) => void
}

export default function CreatePostPopup({ setisOpened, userimage, userName }: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const client = useQueryClient()

    const { handleSubmit, register ,setValue} = useForm({
        defaultValues: {
            body: "",
            image: "",
        }
    })
    function createPost(values) {
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

            client.invalidateQueries(["allposts"])


            
        },
        onError: (error) => {
            console.log("error", error.response.data.message);
            
            toast.danger(error.response.data.message)
            
            setisOpened(false)
        }
    })

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPreviewImage(URL.createObjectURL(file));
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
        // onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <form onSubmit={handleSubmit(mutate)} className="bg-white rounded-xl w-full max-w-130 overflow-hidden border border-gray-100 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                    <span className="text-[15px] font-medium text-gray-900">Create post</span>
                    <button onClick={() => setisOpened(false)} className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-4">
                    {/* User row */}
                    <div className="flex items-center gap-2.5">
                        <img src={userimage} alt={userName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <span className="text-[14px] font-medium text-gray-900">{userName}</span>
                    </div>

                    {/* Textarea */}
                    <textarea
                        {...register("body")}
                        placeholder="What's on your mind?"
                        className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none text-[15px] text-gray-800 placeholder:text-gray-400 leading-relaxed"
                    />

                    {/* Image preview */}
                    {previewImage && (
                        <div className="relative rounded-lg overflow-hidden border border-gray-100">
                            <img src={previewImage} alt="preview" className="w-full h-45 object-cover" />
                            <button
                                onClick={() => { setPreviewImage(null); setValue("image","") }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/55 flex items-center justify-center text-white"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="h-px bg-gray-100" />

                    {/* Toolbar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <label className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors">
                                <Image size={20} />
                                <input type="file" {...register("image",{
                                    onChange:handleImage
                                })} accept="image/*" className="hidden" />
                            </label>
                        </div>
                        <button className="bg-purple-500 hover:bg-purple-600 text-white text-[14px] font-medium px-5 py-2 rounded-full transition-colors">
                            Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}