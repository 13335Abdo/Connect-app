import { useQuery } from "@tanstack/react-query";
import { MessageCircle, X } from "lucide-react";
import { useMemo } from "react";
import type { PostType } from "../Home/Home";
import axiosInstance from "../lib/axios";
import CommentList from "./CommentList";
import CreateComment from "./CreateComment";
import type { CommentType } from "./PostDesign";
import PostSummary from "./PostSummary";

export default function CommentPopup({ post, isOpen, setIsOpen }: { post: PostType; isOpen: boolean; setIsOpen: (v: boolean) => void }) {

    const userId = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}")._id ?? ""; }
        catch { return ""; }
    }, []);

    function getPostComment(){
        return axiosInstance.get(`/posts/${post._id}/comments?page=1&limit=10`)
    }

    const { data, error } = useQuery<CommentType | null>({
        queryFn:  getPostComment ,
        queryKey: ["GetPostComments", post._id],
    });

    if (error) return null;

    const comments = data?.data?.data?.comments ?? [];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="cursor-pointer flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
            >
                <MessageCircle size={18} />
                Comment
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
                >
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-slate-950/20 overflow-hidden border border-white/80">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                            <span className="text-[15px] font-bold text-slate-900">Post Comments</span>
                            <button onClick={() => setIsOpen(false)} className="cursor-pointer w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4">
                            <PostSummary post={post} />
                            <div className="mt-5">
                                <CommentList postId={post._id} comments={comments} commentsCount={post.commentsCount} userId={userId} />
                            </div>
                        </div>

                        <CreateComment postId={post._id} />
                    </div>
                </div>
            )}
        </>
    );
}
