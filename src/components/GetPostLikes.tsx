import { X, UserPlus, Check } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useMemo, useState } from "react";
import type { UserType } from "../Home/Home";
import axiosInstance from "../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "./Loading";
import { Spinner, toast } from "@heroui/react";

interface Props {
    setisOpened: (x: boolean) => void;
    postId: string
}

export default function GetPostLikes({ setisOpened, postId }: Props) {
    const client = useQueryClient()
    const [addedUsers, setAddedUsers] = useState(false);

    const handleAddFriend = (userId: string) => {
        return axiosInstance.put(`/users/${userId}/follow`)
    };
    const{mutate,isPending} = useMutation({
        mutationFn:handleAddFriend,
        mutationKey:["handleAddFriend"],
        onSuccess:(data)=>{
            console.log("datttttttta",data);
            
            setAddedUsers(!addedUsers)
        },
        onError:()=>{
            toast.danger("unexpected erorr")
        }
    })

    const userId = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}")._id ?? ""; }
        catch { return ""; }
    }, []);

    function getLikes() {

        return axiosInstance.get(`/posts/${postId}/likes?page=1&limit=20`)

    }
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ["getLikes", postId],
        queryFn: getLikes
    })
    console.log("dataaaaaaaa", data);
    console.log("isLoading", isLoading);
    console.log("error", error);
    const likes = data?.data?.data?.likes

    if (isLoading || isFetching) {
        return (
            <div
                className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && setisOpened(false)}
            >
                <div className="bg-white rounded-xl w-full max-w-[380px] border border-gray-100 shadow-xl flex items-center justify-center py-16">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }



    return (
        <div
            className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setisOpened(false)}
        >
            <div className="bg-white rounded-xl w-full max-w-[380px] overflow-hidden border border-gray-100 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-gray-900">People who liked this</span>
                        <span className="text-[12px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {likes?.length} likes
                        </span>
                    </div>
                    <button onClick={() => setisOpened(false)} className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Empty state */}
                {likes?.length === 0 ? (
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
                    <div className="flex flex-col max-h-[360px] overflow-y-auto py-2">
                        {likes?.map((user) => {
                            return (
                                <div key={user._id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
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

                                    {/* Add friend btn */}

                                    {userId == user._id ? <p className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors shrink-0 bg-gray-100 text-gray-400">it is you</p> :
                                        <>
                                            <button
                                                onClick={()=>{mutate(user._id)}}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors shrink-0 cursor-pointer ${addedUsers
                                                    ? "bg-gray-100 text-gray-400"
                                                    : "bg-violet-100 text-violet-600 hover:bg-violet-200"
                                                    }`}
                                            >
                                                {isPending? <Spinner /> : <>
                                                

                                                {addedUsers ? <Check size={13} /> : <UserPlus size={13} />}
                                                {addedUsers ? "unfollow" : "follow"}
                                                </>}
                                            </button>
                                        </>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
