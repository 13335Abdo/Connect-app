import { Spinner, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import type { PostType } from "../Home/Home";
import axiosInstance from "../lib/axios";
import EditPostPopup from "./EditPostPopup";

interface Props {
    post: PostType;
    showControls?: boolean;
    userId?: string;
}

export default function PostSummary({ post, showControls = false, userId }: Props) {
    const [isOpen, setisOpen] = useState(false);
    const [isOpenEditPost, setisOpenEditPost] = useState(false);
    const client = useQueryClient();

    function deletePost() {
        return axiosInstance.delete(`/posts/${post._id}`);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: deletePost,
        mutationKey: ["deletePost"],
        onSuccess: () => {
            toast.success("post Deleted successfully");
            client.invalidateQueries({ queryKey: ["allposts"] });
        },
        onError: () => {
            toast.danger("unexpected erorr");
        }
    });

    const postDate = (date: string) =>
        new Date(date).toLocaleString("eg", {
            year: "numeric",
            day: "numeric",
            hour: "numeric",
            month: "short",
            minute: "2-digit",
        });

    return (
        <>
            <div className="relative p-4">
                <div className="mb-3 flex items-center gap-3">
                    <img
                        src={post.user.photo}
                        alt={post.user.name}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <Link to={`/userData/${post.user._id}`} className="min-w-0 flex-1">
                        <p className="cursor-pointer text-sm font-bold leading-tight text-slate-900 hover:text-blue-600">
                            {post.user.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1">
                            <span className="text-[12px] text-slate-500">{postDate(post.createdAt)}</span>
                            <span className="text-[12px] text-slate-300">.</span>
                            <Globe size={11} className="text-slate-500" />
                        </div>
                    </Link>

                    {showControls && post.user._id === userId && (
                        <div className="relative flex items-center gap-0.5">
                            <button
                                onClick={() => setisOpen(!isOpen)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 top-10 z-10 flex w-36 flex-col gap-0.5 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/80">
                                    <button
                                        onClick={() => setisOpenEditPost(!isOpenEditPost)}
                                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                                    >
                                        <MdEdit size={15} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => mutate()}
                                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-50"
                                    >
                                        {isPending ? (
                                            <>
                                                <Spinner color="danger" size="sm" /> Loading...
                                            </>
                                        ) : (
                                            <>
                                                <FaTrash size={13} /> Delete
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {post.body && <p className="whitespace-pre-line text-[14px] leading-relaxed text-slate-700">{post.body}</p>}

                {post.isShare ? (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-2 flex items-center gap-2.5">
                            <img
                                src={post.sharedPost.user.photo}
                                alt={post.sharedPost.user.name}
                                className="h-9 w-9 shrink-0 cursor-pointer rounded-full object-cover ring-2 ring-white"
                            />
                            <Link to={`/userData/${post.sharedPost.user._id}`} className="min-w-0 flex-1">
                                <p className="cursor-pointer text-[13px] font-semibold leading-tight text-slate-900 hover:text-blue-600">
                                    {post.sharedPost.user.name}
                                </p>
                                <div className="mt-0.5 flex items-center gap-1">
                                    <span className="text-[12px] text-slate-500">{postDate(post.sharedPost.createdAt)}</span>
                                    <span className="text-[12px] text-slate-300">.</span>
                                    <Globe size={11} className="text-slate-500" />
                                </div>
                            </Link>
                        </div>
                        {post.sharedPost.body && (
                            <p className="text-[13px] leading-relaxed text-slate-700">{post.sharedPost.body}</p>
                        )}
                        {post.sharedPost.image && (
                            <img src={post.sharedPost.image} alt="post" className="mt-3 max-h-[520px] w-full rounded-xl object-cover" />
                        )}
                    </div>
                ) : (
                    post.image && <img src={post.image} alt="post" className="mt-3 max-h-[620px] w-full rounded-2xl object-cover" />
                )}

                {isOpenEditPost && (
                    <EditPostPopup
                        postId={post._id}
                        currentImage={post.image}
                        currentBody={post.body}
                        setisOpenEditPost={setisOpenEditPost}
                    />
                )}
            </div>
        </>
    );
}
