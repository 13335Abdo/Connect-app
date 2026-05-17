import { Spinner, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import type { PostType } from "../Home/Home";
import axiosInstance from "../lib/axios";
import EditPostPopup from "./EditPostPopup";
import { Link } from "react-router-dom";

interface Props {
    post: PostType;
    showControls?: boolean; // الـ X وـ MoreHorizontal بس في الـ feed
    userId?: string;
}

export default function PostSummary({ post, showControls = false, userId }: Props) {

    const [isOpen, setisOpen] = useState(false)
    const [isOpenEditPost, setisOpenEditPost] = useState(false)
    const client = useQueryClient()

    function deletePost() {
        return axiosInstance.delete(`/posts/${post._id}`)
    }
    const { mutate, isPending } = useMutation({
        mutationFn: deletePost,
        mutationKey: ["deletePost"],
        onSuccess: () => {
            toast.success("post Deleted successfully")
            client.invalidateQueries({ queryKey: ["allposts"] })

        },
        onError: () => {
            toast.danger("unexpected erorr")
        }
    })

    return (
        <>

            <div className="bg-gray-50 relative rounded-lg p-3 border border-gray-100">
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-2">
                    <img src={post.user.photo} alt={post.user.name} className="w-9 h-9 rounded-full object-cover shrink-0 cursor-pointer" />
                    <Link to={`/userData/${post.user._id}`} className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 cursor-pointer hover:underline leading-tight">
                            {post.user.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[12px] text-gray-500">
                                {new Date(post.createdAt).toLocaleString("eg", {
                                    year: "numeric", day: "numeric",
                                    hour: "numeric", month: "short", minute: "2-digit",
                                })}
                            </span>
                            <span className="text-gray-400 text-[12px]">·</span>
                            <Globe size={11} className="text-gray-500" />
                        </div>
                    </Link>
                    {showControls && (
                        <div className="relative flex items-center gap-0.5">
                            {/* _________________هعملها هنا ___________________*/}
                            {post.user._id === userId && (
                                <button onClick={() => setisOpen(!isOpen)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            )}
                            {isOpen &&
                                <div className="bg-white border absolute top-9 right-0 border-gray-100 rounded-lg shadow-md p-1 flex flex-col gap-0.5 w-36">
                                    <button onClick={() => setisOpenEditPost(!isOpenEditPost)} className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-gray-700 hover:bg-gray-100 transition-colors w-full cursor-pointer">
                                        <MdEdit size={15} />
                                        Edit
                                    </button>
                                    <button onClick={() => mutate()} className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors w-full cursor-pointer">
                                        {isPending ? <> <Spinner color="danger" size="sm" /> Loading...</> : <> <FaTrash size={13} /> Delete</>}
                                    </button>
                                </div>}
                        </div>
                    )}
                </div>
                {post.body && <p className="text-[13px] text-gray-700 leading-relaxed">{post.body}</p>}


                {post.isShare && <div className="flex items-center gap-2.5 mb-2">
                    <img src={post.sharedPost.user.photo} alt={post.sharedPost.user.name} className="w-9 h-9 rounded-full object-cover shrink-0 cursor-pointer" />
                    <Link to={`/userData/${post.sharedPost.user._id}`} className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 cursor-pointer hover:underline leading-tight">
                            {post.sharedPost.user.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[12px] text-gray-500">
                                {new Date(post.sharedPost.createdAt).toLocaleString("eg", {
                                    year: "numeric", day: "numeric",
                                    hour: "numeric", month: "short", minute: "2-digit",
                                })}
                            </span>
                            <span className="text-gray-400 text-[12px]">·</span>
                            <Globe size={11} className="text-gray-500" />
                        </div>
                    </Link>
                </div>}

                {/* Body */}



                {post.isShare ?

                    <>
                        {post.sharedPost.image && <img src={post.sharedPost.image} alt="post" className="w-full object-cover mt-2" />}
                        {post.sharedPost.body && <p className="text-[13px] text-gray-700 leading-relaxed">{post.sharedPost.body}</p>}
                    </>




                    : post.image && <img src={post.image} alt="post" className="w-full object-cover mt-2" />}


                {/* Actions */}
                {isOpenEditPost && <EditPostPopup postId={post._id} currentImage={post.image} currentBody={post.body} setisOpenEditPost={setisOpenEditPost} />}
            </div>
        </>
    );
}
