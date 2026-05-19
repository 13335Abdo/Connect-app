import { Spinner, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { MetaType, PostType, UserType } from "../Home/Home";
import axiosInstance from "../lib/axios";
import CommentPopup from "./CommentPopup";
import PostSummary from "./PostSummary";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import SharePost from "./SharePost";
import GetPostLikes from "./GetPostLikes";
import axios from "axios";

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
    image?: FileList;
}

export default function PostDesign({ post }: { post: PostType }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaved, setisSaved] = useState(post.bookmarked);
    const [isOpened, setisOpened] = useState(false);
    const [GetLikesOpen, IkeGetLikesOpen] = useState(false);

    const client = useQueryClient()

    const userId = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}")._id ?? ""; }
        catch { return ""; }
    }, []);

    const [isLiked, setIsLiked] = useState(() =>
        post.likes?.includes(userId)
    );

    function bookMarkAndUnBook() {
        return axiosInstance.put(`/posts/${post._id}/bookmark`)
    }
    const { mutate: markMutate } = useMutation({
        mutationFn: bookMarkAndUnBook,
        mutationKey: ["bookMarkAndUnBook"],
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["allposts"] })
            setisSaved(!post.bookmarked)
        },
        onError: (erorr) => {
            console.log("erorr", axios.isAxiosError(erorr) ? erorr.response : erorr);
            toast.danger("unexpected erorr")
        }
    })

    function likeAnndUnLikePost() {
        return axiosInstance.put(`/posts/${post._id}/like`)
    }
    const { mutate, isPending } = useMutation({
        mutationFn: likeAnndUnLikePost,
        mutationKey: ["likeAnndUnLikePost"],
        onSuccess: (data) => {


            console.log("data from like post", data);
            client.invalidateQueries({ queryKey: ["allposts"] })
            client.invalidateQueries({ queryKey: ["getLikes", post.id] })
            setIsLiked(!isLiked)


        },
        onError: () => {
            toast.danger("unexpected erorr")
        }
    })





    return (
        <article className="bg-white border border-white/80 rounded-2xl mb-4 overflow-hidden shadow-sm shadow-slate-200/80 transition hover:shadow-md hover:shadow-slate-200/90">
            <PostSummary
                post={post}
                showControls
                userId={userId}
            />

            {/* Stats Row */}

            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <button onClick={()=>IkeGetLikesOpen(!GetLikesOpen)} className="cursor-pointer flex items-center gap-1.5 rounded-full px-2 py-1 text-slate-500 hover:bg-red-50 hover:text-red-500">
                    <Heart size={16} className={`transition-colors fill-red-500 text-red-500`} />
                    <span className="text-[13px] font-semibold">{post.likesCount}</span>
                </button>
                <div className="flex items-center gap-3 text-[13px] font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">{post.commentsCount} comments</span>
                    <span className="flex items-center gap-1.5">{post.sharesCount} shares</span>
                </div>
            </div>
            {GetLikesOpen&&<GetPostLikes postId={post._id} setisOpened={IkeGetLikesOpen} />}



            {/* Actions Row */}
            <div className="grid grid-cols-2 gap-1 border-t border-slate-100 px-2 py-2 sm:grid-cols-4">
                <button
                    onClick={() => { mutate() }}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-colors ${isLiked ? "bg-red-50 text-red-500" : "text-slate-600 hover:bg-slate-100"}`}
                >
                    {isPending ? <Spinner /> : <Heart size={18} className={isLiked ? "fill-red-500" : ""} />}
                    Like
                </button>
                <CommentPopup isOpen={isOpen} setIsOpen={setIsOpen} post={post} />
                <button onClick={() => setisOpened(true)} className="cursor-pointer flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-100">
                    <Share2 size={18} />
                    Share
                </button>
                <button onClick={() => markMutate()} className={`cursor-pointer flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold ${isSaved ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100"} transition-colors`}>
                    {isSaved ? <FaBookmark size={18} color="blue" /> : <FaRegBookmark size={18} />}
                    Bookmark
                </button>
            </div>

            {isOpened && <SharePost post={post} setisOpened={setisOpened} />}


            {/* Top Comment */}
            {post.topComment && (
                <div className="mx-4 mb-4 border-s-3 border-blue-400 mt-1 flex flex-col gap-2 bg-blue-50/60 rounded-xl px-3 py-3">
                    <div className="flex items-center gap-2">
                        <div>
                            <img src={post.topComment.commentCreator.photo} alt={post.topComment.commentCreator.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 ring-2 ring-white" />
                        </div>
                        <div className="text-[12px] font-semibold text-slate-800">{post.topComment.commentCreator.name}</div>
                    </div>

                    <div className="ms-10">
                        <p className="text-[13px] text-slate-700 mt-0.5 leading-snug">{post.topComment.content}</p>
                        {post.topComment?.image && <img src={post.topComment?.image} alt={post.topComment.commentCreator.name} className="rounded-xl w-24 h-24 object-cover mt-2" />}
                    </div>
                </div>
            )}
        </article>
    );
}
