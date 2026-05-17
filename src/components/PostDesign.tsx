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
        <div className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden">
            <PostSummary
                post={post}
                showControls
                userId={userId}
            />

            {/* Stats Row */}

            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                <button onClick={()=>IkeGetLikesOpen(!GetLikesOpen)} className="cursor-pointer flex items-center gap-1.5 hover:underline">
                    <Heart size={16} className={`transition-colors fill-red-500 text-red-500`} />
                    <span className="text-[13px] text-gray-500">{post.likesCount}</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-gray-500 text-[13px]">{post.commentsCount} comments</span>
                    <span className="flex items-center gap-1.5 text-gray-500 text-[13px]">{post.sharesCount} shares</span>
                </div>
            </div>
            {GetLikesOpen&&<GetPostLikes postId={post._id} setisOpened={IkeGetLikesOpen} />}



            {/* Actions Row */}
            <div className="grid grid-cols-4 border-t border-gray-100 mx-2 mb-1">
                <button
                    onClick={() => { mutate() }}
                    className={`flex cursor-pointer items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold hover:bg-gray-100 transition-colors ${isLiked ? "text-red-500" : "text-gray-600"}`}
                >
                    {isPending ? <Spinner /> : <Heart size={18} className={isLiked ? "fill-red-500" : ""} />}
                    Like
                </button>
                <CommentPopup isOpen={isOpen} setIsOpen={setIsOpen} post={post} />
                <button onClick={() => setisOpened(true)} className="cursor-pointer flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                    <Share2 size={18} />
                    Share
                </button>
                <button onClick={() => markMutate()} className={`cursor-pointer flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-semibold ${isSaved ? "text-blue-600" : "text-gray-600"} hover:bg-gray-100 transition-colors`}>
                    {isSaved ? <FaBookmark size={18} color="blue" /> : <FaRegBookmark size={18} />}
                    Bookmark
                </button>
            </div>

            {isOpened && <SharePost post={post} setisOpened={setisOpened} />}


            {/* Top Comment */}
            {post.topComment && (
                <div className="mx-4 mb-3 border-s-3 border-blue-400 mt-1 flex flex-col gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2">
                        <div>
                            <img src={post.topComment.commentCreator.photo} alt={post.topComment.commentCreator.name} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                        </div>
                        <div className="text-[12px] font-semibold text-gray-800">{post.topComment.commentCreator.name}</div>
                    </div>

                    <div className="ms-10">
                        <p className="text-[13px] text-gray-700 mt-0.5 leading-snug">{post.topComment.content}</p>
                        {post.topComment?.image && <img src={post.topComment?.image} alt={post.topComment.commentCreator.name} className="rounded-lg w-20 h-20" />}
                    </div>
                </div>
            )}
        </div>
    );
}
