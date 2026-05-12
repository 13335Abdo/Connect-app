import { useQuery } from "@tanstack/react-query"
import { Heart, MessageCircle, Share2, X } from "lucide-react"
import { useState } from "react"
import type { PostType } from "../Home/Home"
import axiosInstance from "../lib/axios"
import CreateComment from "./CreateComment"
import type { CommentType } from "./PostDesign"

export default function CommentPopup({ post, isLiked, setIsLiked }: { post: PostType, isLiked: boolean }) {



    const [isOpen, setIsOpen] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const { data, error } = useQuery({
        queryFn: GetPostComments,
        queryKey: ["GetPostComments", post._id],

    })



    function GetPostComments(): Promise<CommentType | null> {
        return axiosInstance.get(`/posts/${post._id}/comments?page=1&limit=10`)
    }


    if (error) {

        return null

    }

    const comment = data?.data.data.comments

    console.log("comment",comment);
    





    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true);
                }}
                className="cursor-pointer flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
                <MessageCircle size={18} />
                Comment
            </button>



            {/* Modal منفصل تماماً عن الـ grid */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
                >
                    <div className="bg-white rounded-xl w-full max-w-[55%] max-h-[85vh] flex flex-col shadow-xl overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
                            <span className="text-[15px] font-semibold text-gray-800">Post Comments</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="cursor-pointer w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="flex-1 overflow-y-auto p-4">

                            {/* Post summary */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-5 border border-gray-100">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <img src={post.user.photo} alt={post.user.name} className="w-9 h-9 rounded-full object-cover" />
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-900">{post.user.name}</p>
                                        <p className="text-[11px] text-gray-400">{new Date(post.createdAt).toLocaleString("eg", {
                                            year: "numeric",
                                            day: "numeric",
                                            hour: "numeric",
                                            month: "short",
                                            minute: "2-digit",

                                        })}</p>
                                    </div>
                                </div>
                                {post.body && <p className="text-[13px] text-gray-700 leading-relaxed">{post.body}</p>}
                                {post.image && (
                                    <img
                                        src={post.image}
                                        alt="post"
                                        className="w-full object-cover"
                                    />
                                )}
                                <div className="grid grid-cols-3 border-t border-gray-100 mx-2 mb-1">
                                    <button
                                        onClick={handleLike}
                                       className={`flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold hover:bg-gray-100 transition-colors ${isLiked ? "text-red-500" : "text-gray-600"}`}
                                    >
                                        <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
                                        Like
                                    </button>


                                    <label

                                        className={`flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold hover:bg-gray-100 transition-colors  text-gray-600`}
                                    >
                                        <MessageCircle size={18} />
                                        Comment
                                    </label>






                                    <button className="flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                                        <Share2 size={18} />
                                        Share
                                    </button>
                                </div>
                            </div>

                            {/* Comments label */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[12px] font-semibold text-gray-500">
                                    {comment?.length > 0 ? `${post.commentsCount} Comments` : "Comments"}
                                </span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

                            {/* Comments list or Empty state */}
                            {comment?.length === 0 ? (
                                <div className="flex flex-col items-center py-10 text-center">
                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                        <MessageCircle size={24} className="text-gray-400" />
                                    </div>
                                    <p className="text-[14px] font-semibold text-gray-700 mb-1">No comments yet</p>
                                    <p className="text-[12px] text-gray-400">Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {comment?.map((comme) => (
                                        <div key={comme._id} className="flex gap-2.5">
                                            <img
                                                src={comme.commentCreator.photo}
                                                alt={comme.commentCreator.name}
                                                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                                            />
                                            <div className="flex-1">
                                                <div className="bg-gray-50 rounded-[0_10px_10px_10px] px-3 py-2 border border-gray-100">
                                                    <p className="text-[12px] font-semibold text-gray-900">{comme.commentCreator.name}</p>
                                                    {comme.content&&<p className="text-[13px] text-gray-700 mt-0.5 leading-snug">{comme.content}</p>}
                                                    {comme.image&&<img src={comme.image} alt={comme.content} />}
                                                    
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 px-1 text-[11px] text-gray-400">
                                                    <span>{new Date(comme.createdAt).toLocaleString("eg", {
                                                        year: "numeric",
                                                        day: "numeric",
                                                        hour: "numeric",
                                                        month: "short",
                                                        minute: "2-digit",

                                                    })}</span>
                                                    <button className="hover:text-red-400 transition-colors">❤ {comme.likes.length}</button>
                                                    <button className="hover:text-blue-500 transition-colors">Reply</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input area */}
                        <CreateComment postId={post._id} />
                    </div>
                </div>
            )}
        </>
    )
}
