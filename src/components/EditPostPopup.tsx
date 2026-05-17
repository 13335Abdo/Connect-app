import { X, Image } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@heroui/react";

interface Props {
    postId: string;
    currentBody: string;
    currentImage?: string;
    setisOpenEditPost: (x: boolean) => void;
}
type FormValues = {
    body: string;
    image?: FileList;
};

export default function EditPostPopup({ postId, setisOpenEditPost, currentBody, currentImage }: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(currentImage ?? null);
    const client = useQueryClient();

        const userName = useMemo<string>(() => {
            try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}").username ?? ""; }
            catch { return ""; }
        }, []);
        const userimage = useMemo<string>(() => {
            try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}").photo ?? ""; }
            catch { return ""; }
        }, []);

    const { handleSubmit, register } = useForm<FormValues>({
        defaultValues: {
            body: currentBody,
            image: undefined,
        }
    });



    function editPost(values: FormValues) {
        const formData = new FormData();
        if (values.body) formData.append("body", values.body);
        if (values.image?.[0]) formData.append("image", values.image[0]);
        return axiosInstance.put(`/posts/${postId}`, formData);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: editPost,
        onSuccess: () => {
            toast.success("Post updated successfully");
            setisOpenEditPost(false);
            client.invalidateQueries({ queryKey: ["allposts"] });
        },
        onError: () => {
            toast.danger("Unexpected error");
        }
    });

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPreviewImage(URL.createObjectURL(file));
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setisOpenEditPost(false)}
        >
            <form onSubmit={handleSubmit((values) => mutate(values))} className="bg-white rounded-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto border border-gray-100 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                    <span className="text-[15px] font-semibold text-gray-900">Edit post</span>
                    <button type="button" onClick={() => setisOpenEditPost(false)} className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2.5">
                        <img src={userimage} alt={userName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <span className="text-[14px] font-medium text-gray-900">{userName}</span>
                    </div>

                    <textarea
                        {...register("body")}
                        placeholder="What's on your mind?"
                        className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none text-[15px] text-gray-800 placeholder:text-gray-400 leading-relaxed"
                    />

                    {previewImage && (
                        <div className="relative rounded-lg overflow-hidden border border-gray-100">
                            <img src={previewImage} alt="preview" className="w-full h-45 object-cover" />
                            
                        </div>
                    )}

                    <div className="h-px bg-gray-100" />

                    <div className="flex items-center justify-between">
                        <label className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors">
                            <Image size={20} />
                            <input type="file" {...register("image", { onChange: handleImage })} accept="image/*" className="hidden" />
                        </label>
                        <button type="submit" disabled={isPending} className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white text-[14px] font-medium px-5 py-2 rounded-full transition-colors cursor-pointer">
                            {isPending ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
