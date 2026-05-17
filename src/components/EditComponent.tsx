import { Card, CardHeader, toast } from "@heroui/react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { IoAttach } from "react-icons/io5";
import axiosInstance from "../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type EditComponentProps = {
    image: string;
    content: string;
    postId: string;
    commentId: string;
    setisOpenEdit: (x: boolean) => void;
};

type FormValues = {
    content: string;
    image: FileList;
};

export default function EditComponent({
    image,
    content,
    postId,
    commentId,
    setisOpenEdit,
}: EditComponentProps) {


    const queryClient = useQueryClient();

    const [previewImage, setPreviewImage] = useState(image);

    const {
        handleSubmit,
        register,
        setValue,
        
    } = useForm<FormValues>({
        defaultValues: {
            content: content,
        },
    });


    // image preview
    const handleImagePreview = (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
    };

    async function editComment(values: FormValues) {
        const formData = new FormData();

        if (values.content) {
            formData.append("content", values.content);
        }

        if (values.image?.[0]) {
            formData.append("image", values.image[0]);
        }

        return axiosInstance.put(
            `/posts/${postId}/comments/${commentId}`,
            formData
        );
    }

    const { mutate: editCommentMutate, isPending } = useMutation({
        mutationFn: editComment,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["GetPostComments", postId],
            });
            setisOpenEdit(false)

            toast.success("Comment updated successfully");
        },

        onError: () => {
            toast.danger("Unexpected error");
        },
    });

    return (
        <Card className="w-full max-w-[320px] p-4 gap-4 relative shadow-lg rounded-2xl">

            {/* Image Preview */}
            <div className="relative w-fit">
               {previewImage&& <img
                    alt="comment preview"
                    className="aspect-square w-20 rounded-2xl object-cover border"
                    src={previewImage}
                />}

                {previewImage && (
                    <X
                        size={16}
                        onClick={() => {
                            setPreviewImage("");
                            setValue("image", {} as FileList);
                        }}
                        className="cursor-pointer hover:text-red-600 absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                    />
                )}
            </div>

            <CardHeader className="p-0">
                <form
                    onSubmit={handleSubmit((values) => editCommentMutate(values))}
                    className="flex flex-col gap-4 w-full"
                >

                    {/* Content Input */}
                    <input
                        type="text"
                        placeholder="Edit your comment..."
                        {...register("content")}
                        className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                    />

                    {/* File Input */}
                    <div className="flex items-center justify-between">

                        <label className="cursor-pointer flex items-center gap-2 hover:text-gray-600 transition">
                            <IoAttach size={20} />

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                {...register("image", {
                                    onChange: (e) => {
                                        const file = e.target.files?.[0];

                                        if (file) {
                                            handleImagePreview(file);
                                        }
                                    },
                                })}
                            />
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90 transition disabled:opacity-50"
                        >
                            {isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </CardHeader>
        </Card>
    );
}
