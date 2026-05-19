import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import axiosInstance from "../lib/axios";
import FollowButton from "./FollowButton";
import { Link } from "react-router-dom";

interface LikedUser {
    _id: string;
    photo: string;
    name: string;
    username: string;
}

interface Props {
    setisOpened: (x: boolean) => void;
    postId: string;
}

export default function GetPostLikes({ setisOpened, postId }: Props) {

    // 📌 دي list بالـ IDs بتاعت الناس اللي عملتلهم follow
    // مثلاً: ["abc123", "xyz456"]


    async function getLikes() {
        return (await axiosInstance.get(`/posts/${postId}/likes?page=1&limit=20`)).data;
    }

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["getLikes", postId],
        queryFn: getLikes,
    });

    const likes: LikedUser[] = data?.data?.likes ?? [];

    if (isLoading || isFetching) {
        return (
            <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && setisOpened(false)}
            >
                <div className="bg-white rounded-xl w-full max-w-[380px] border border-gray-100 shadow-xl flex items-center justify-center py-16">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setisOpened(false)}
        >
            <div className="bg-white rounded-xl w-full max-w-[380px] overflow-hidden border border-gray-100 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-gray-900">People who liked this</span>
                        <span className="text-[12px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {likes.length} likes
                        </span>
                    </div>
                    <button onClick={() => setisOpened(false)} className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Empty state */}
                {likes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                            <FaHeart size={28} className="text-red-200" />
                        </div>
                        <p className="text-[15px] font-semibold text-gray-700">No likes yet</p>
                        <p className="text-[13px] text-gray-400 text-center leading-relaxed">
                            Be the first to like this post and show your support!
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col max-h-90 overflow-y-auto py-2">
                        {likes.map((user) => {

                            return (
                                <div key={user._id} className="flex justify-between items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                                    <Link to={`/userData/${user._id}`} className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                                <FaHeart size={8} className="text-white" />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                            <span className="text-[14px] font-medium text-gray-900 truncate">{user.name}</span>
                                            <span className="text-[12px] text-gray-400">@{user.username}</span>
                                        </div>
                                    </Link>
                                    <FollowButton userId={user._id}/>

                                    {/* 📌 لو ده انت مش هيظهر زرار follow */}

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
