import { Globe, Heart, MessageCircle, MoreHorizontal, Share2, X } from "lucide-react";
import { useState } from "react";
import type { MetaType, PostType, UserType } from "../Home/Home";
import CommentPopup from "./CommentPopup";

export interface CommentType {
    data: {
        success: boolean,
        meta: MetaType,
        message: string,
        data: CommentData
    }
}
interface CommentData {
    comments: Coments[]
}
interface Coments {

    commentCreator: UserType,
    content: string,
    createdAt: string,
    likes: string[],
    parentComment: string,
    post: string,
    _id: string,
    image:string

}

export interface comentFormat {
    content: string,
    image: string,
}


export default function PostDesign({ post }: { post: PostType }) {

    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);





    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 pt-3 pb-2">
                <img
                    src={post.user.photo}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-900 cursor-pointer hover:underline leading-tight">
                        {post.user.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[12px] text-gray-500">{new Date(post.createdAt).toLocaleString("eg", {
                            year: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            month: "short",
                            minute: "2-digit",

                        })}</span>
                        <span className="text-gray-400 text-[12px]">·</span>
                        <Globe size={11} className="text-gray-500" />
                    </div>
                </div>
                <div className="flex items-center gap-0.5">
                    <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                    <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {post.body && (
                <p className="px-4 pb-2 text-[15px] text-gray-900 leading-relaxed">{post.body}</p>
            )}

            {/* Image */}
            {post.image && (
                <img
                    src={post.image}
                    alt="post"
                    className="w-full object-cover max-h-125"
                />
            )}

            {/* Stats Row */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                <button
                    onClick={handleLike}
                    className="flex items-center gap-1.5 cursor-pointer"
                >
                    <Heart
                        size={16}
                        className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                    <span className="text-[13px] text-gray-500">{post.likesCount}</span>
                </button>

                <div className="flex items-center gap-3">


                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <MessageCircle size={16} />
                        <span className="text-[13px]">{post.commentsCount} comments</span>
                    </button>


                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                        <Share2 size={16} />
                        <span className="text-[13px]">{post.sharesCount} shares</span>
                    </button>
                </div>
            </div>

            {/* Actions Row */}
            <div className="grid grid-cols-3 border-t border-gray-100 mx-2 mb-1">
                <button
                    onClick={handleLike}
                    className={`flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold hover:bg-gray-100 transition-colors ${isLiked ? "text-red-500" : "text-gray-600"}`}
                >
                    <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
                    Like
                </button>



                <CommentPopup post={post} isLiked={isLiked} setIsLiked={setIsLiked}/>


                <button className="cursor-pointer flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                    <Share2 size={18} />
                    Share
                </button>
            </div>

            {/* Top Comment */}
            {post.topComment && (
                <div className="mx-4 mb-3 border-s-3 border-blue-400 mt-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                    <img
                        src={post.topComment.commentCreator.photo}
                        alt={post.topComment.commentCreator.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-semibold text-gray-800">
                            {post.topComment.commentCreator.name}
                        </span>
                        <p className="text-[13px] text-gray-700 mt-0.5 leading-snug">
                            {post.topComment.content}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}