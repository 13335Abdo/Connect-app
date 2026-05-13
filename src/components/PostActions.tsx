import { Heart, MessageCircle, Share2 } from "lucide-react";
import type { PostType } from "../Home/Home";

interface Props {
    post: PostType;
    isLiked: boolean;
    onLike: () => void;
}

export default function PostActions({ post, isLiked, onLike }: Props) {
    return (
        <div className="grid grid-cols-3 border-t border-gray-100 mx-2 mt-2">
            <button
                onClick={onLike}
                className={`flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold hover:bg-gray-100 transition-colors ${isLiked ? "text-red-500" : "text-gray-600"}`}
            >
                <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
                Like
            </button>
            <label className="flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold hover:bg-gray-100 transition-colors text-gray-600">
                <MessageCircle size={18} />
                Comment
            </label>
            <button className="flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                <Share2 size={18} />
                Share
            </button>
        </div>
    );
}