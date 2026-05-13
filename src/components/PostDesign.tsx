import { Heart, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { MetaType, PostType, UserType } from "../Home/Home";
import CommentPopup from "./CommentPopup";
import PostSummary from "./PostSummary";

export interface CommentType {
    data: {
        success: boolean;
        meta: MetaType;
        message: string;
        data: { comments: CommentData[] };
    };
}
interface CommentData {
    commentCreator: UserType;
    content: string;
    createdAt: string;
    likes: string[];
    parentComment: string;
    post: string;
    _id: string;
    image: string;
}
export interface comentFormat {
    content: string;
    image: string;
}

export default function PostDesign({ post }: { post: PostType }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const userId = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}")._id ?? ""; }
        catch { return ""; }
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden">
            <PostSummary
                post={post}
                isLiked={isLiked}
                onLike={() => setIsLiked(!isLiked)}
                showControls
                userId={userId}
            />

            {/* Stats Row */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                <button onClick={() => setIsLiked(!isLiked)} className="flex items-center gap-1.5 cursor-pointer">
                    <Heart size={16} className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    <span className="text-[13px] text-gray-500">{post.likesCount}</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-gray-500 text-[13px]">{post.commentsCount} comments</span>
                    <span className="flex items-center gap-1.5 text-gray-500 text-[13px]">{post.sharesCount} shares</span>
                </div>
            </div>

            {/* Actions Row */}
            <div className="grid grid-cols-3 border-t border-gray-100 mx-2 mb-1">
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold hover:bg-gray-100 transition-colors ${isLiked ? "text-red-500" : "text-gray-600"}`}
                >
                    <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
                    Like
                </button>
                <CommentPopup isOpen={isOpen} setIsOpen={setIsOpen} post={post} isLiked={isLiked} setIsLiked={setIsLiked} />
                <button className="cursor-pointer flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                    <Share2 size={18} />
                    Share
                </button>
            </div>

            {/* Top Comment */}
            {post.topComment && (
                <div className="mx-4 mb-3 border-s-3 border-blue-400 mt-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                    <img src={post.topComment.commentCreator.photo} alt={post.topComment.commentCreator.name} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-semibold text-gray-800">{post.topComment.commentCreator.name}</span>
                        <p className="text-[13px] text-gray-700 mt-0.5 leading-snug">{post.topComment.content}</p>
                    </div>
                </div>
            )}
        </div>
    );
}