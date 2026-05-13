import { Globe, MoreHorizontal, X } from "lucide-react";
import type { PostType } from "../Home/Home";

interface Props {
    post: PostType;
    isLiked: boolean;
    onLike: () => void;
    showControls?: boolean; // الـ X وـ MoreHorizontal بس في الـ feed
    userId?: string;
}

export default function PostSummary({ post, isLiked, onLike, showControls = false, userId }: Props) {
    return (
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2">
                <img src={post.user.photo} alt={post.user.name} className="w-9 h-9 rounded-full object-cover shrink-0 cursor-pointer" />
                <div className="flex-1 min-w-0">
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
                </div>
                {showControls && (
                    <div className="flex items-center gap-0.5">
                        {post.user._id === userId && (
                            <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        )}
                        <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Body */}
            {post.body && <p className="text-[13px] text-gray-700 leading-relaxed">{post.body}</p>}
            {post.image && <img src={post.image} alt="post" className="w-full object-cover mt-2" />}

            {/* Actions */}
        </div>
    );
}