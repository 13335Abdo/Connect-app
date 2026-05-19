import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../lib/axios"
import { useState } from "react"
import { IoAttachOutline } from "react-icons/io5"
import { Spinner, toast } from "@heroui/react"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
interface ValuesType {
    content: string,
    image?: FileList;
}

export default function CreateReplayComment({ postId, commentId }: { postId: string, commentId: string }) {

    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            content: "",
            image: undefined as FileList | undefined,
        }
    })

    const [isOpen, setisOpen] = useState(false)

    const client = useQueryClient()

    const imageFile = watch("image");

    function createComment(values: ValuesType) {

        const formData = new FormData();
        if (values.content) {
            formData.append("content", values.content);
        }
        if (values.image?.[0]) {
            formData.append("image", values.image[0]);
        }

        return axiosInstance.post(`/posts/${postId}/comments/${commentId}/replies`, formData)
    }
    const { isPending, mutate } = useMutation({
        mutationFn: createComment,
        mutationKey: ["createComment"],
        onSuccess: () => {

            reset();
            //@ts-ignore
            client.invalidateQueries(["GetPostComments", postId])
            setisOpen(false)

        },
        onError: () => {
            toast.danger("unexpected erorr try again later")
        }
    })


    return (
        <>
            <button onClick={() => setisOpen(true)} className="hover:text-blue-500 transition-colors cursor-pointer">reply</button>
            {isOpen && <form
                onSubmit={handleSubmit((values) => mutate(values))}
                className="relative mt-2 flex items-center gap-2.5 flex-1"
            >
                <input
                    {...register("content")}
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 text-[13px] bg-white border border-slate-200 rounded-full px-4 py-2 pr-10 outline-none focus:border-blue-300 transition-colors shadow-sm"
                />
                {/* File Input */}
                <label className="absolute right-15 cursor-pointer">
                    <IoAttachOutline
                        size={22}
                        className={imageFile?.[0] ? "text-blue-500" : "text-slate-400"}
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
                    className="w-8 h-8 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors shrink-0 shadow-sm shadow-blue-200"
                >
                    {isPending ? (
                        <Spinner size="sm" className="text-white" />
                    ) : (
                        <Send size={14} className="text-white" />
                    )}
                </button>
            </form>}

        </>
    )
}
