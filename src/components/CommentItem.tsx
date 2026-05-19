import { Spinner, toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { FaHeart, FaTrash } from "react-icons/fa";
import type { UserType } from "../Home/Home";
import axiosInstance from "../lib/axios";
import ReplayComments from "./ReplayComments";
import CreateReplayComment from "./CreateReplayComment";
import { MdEdit } from "react-icons/md";
import EditComponent from "./EditComponent";
import { Link } from "react-router-dom";

export interface CommentItemProps {
    isFromReplay?: boolean
    commentCreator: UserType;
    content?: string;
    image?: string;
    createdAt: string;
    likesCount: number;
    isOwner: boolean;
    commentId: string;
    postId: string;
    likes: string[];
}

export default function CommentItem({ likes, isFromReplay, postId, commentId, commentCreator, content, image, createdAt, likesCount, isOwner }: CommentItemProps) {


    const [isOpenEdit, setisOpenEdit] = useState(false)

    const [isOpen, setisOpen] = useState(false)

    const query = useQueryClient()

    const userId = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}")._id ?? ""; }
        catch { return ""; }
    }, []);

    const [isLiked, setIsLiked] = useState(() =>
        likes?.includes(userId)
    );


    async function likeAndUnlikeComment() {

        const data = await axiosInstance.put(`/posts/${postId}/comments/${commentId}/like`)

        // query.invalidateQueries(["GetPostComments", postId])


        return data

    }

    const { mutate } = useMutation({
        mutationFn: likeAndUnlikeComment,
        mutationKey: ["likeAndUnlikeComment"],
        onSuccess: () => {

            query.invalidateQueries({ queryKey: ["GetPostComments", postId] })
            setIsLiked(!isLiked)

        },
        onError: () => {
            toast.danger("un expected erorr")
        }

    })

    function deleteComment() {

        return axiosInstance.delete(`/posts/${postId}/comments/${commentId}`)

    }
    const { mutate: deletmutate, isPending } = useMutation({
        mutationFn: deleteComment,
        mutationKey: ["deleteComment"],
        onSuccess: (data) => {
            console.log("data", data);
            query.invalidateQueries({ queryKey: ["GetPostComments", postId] })

        },
        onError: () => {

            toast.danger("unexpected erorr")

        }
    })




    return (
        <>

            <div className={`flex gap-2.5 ${isFromReplay ? "pl-6" : ""}`}>
                <Link to={`/userData/${commentCreator._id}`}>
                    <img src={commentCreator.photo} alt={commentCreator.name} className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 ring-2 ring-white shadow-sm" />
                </Link>
                <div className="flex-1">
                    <div className="bg-white rounded-[0_16px_16px_16px] px-3.5 py-3 border border-slate-100 shadow-sm shadow-slate-200/50">
                        <div className="flex justify-between items-center relative">
                            <Link to={`/userData/${commentCreator._id}`}>
                                <p className="text-[13px] font-bold text-slate-900 hover:text-blue-600">{commentCreator.name}</p>
                            </Link>
                            {isOwner && (
                                <button onClick={() => setisOpen(!isOpen)} className="p-1.5 rounded-full hover:bg-slate-100 cursor-pointer text-slate-500">
                                    <MoreHorizontal size={20} />
                                </button>
                            )}
                            {isOpen && (
                                <div className="w-32 p-1.5 flex flex-col gap-1 absolute top-8 right-0 z-10 rounded-xl border border-slate-100 bg-white shadow-xl shadow-slate-200/80">
                                    <button onClick={() => setisOpenEdit(true)} className="flex items-center rounded-lg px-3 py-2 gap-2 cursor-pointer text-sm font-semibold text-slate-700 hover:bg-slate-100 w-full">
                                        <div>
                                            <MdEdit />
                                        </div>
                                        <p>Edit</p>
                                    </button>
                                    <button disabled={isPending} onClick={() => deletmutate()} className="flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer text-sm font-semibold text-red-500 hover:bg-red-50 w-full">
                                        <div>
                                            {isPending ? <Spinner size="md" /> : <FaTrash />}
                                        </div>
                                        {isPending ? <p>Loding...</p> : <p>Delete</p>}
                                    </button>
                                </div>
                            )}

                        </div>
                        {content && <p className="text-[13px] text-slate-700 mt-1 leading-relaxed">{content}</p>}
                        {image && <img src={image} alt={content} className="mt-2 max-h-64 rounded-xl object-cover" />}
                    </div>
                    <div className="flex relative items-center gap-3 mt-1.5 px-1 text-[11px] font-semibold text-slate-400">
                        <span>
                            {new Date(createdAt).toLocaleString("eg", {
                                year: "numeric", day: "numeric",
                                hour: "numeric", month: "short", minute: "2-digit",
                            })}
                        </span>
                        {isFromReplay ? "" : <>
                            <button className=" cursor-pointer flex items-center gap-1" onClick={() => {
                                mutate();
                            }
                            } >
                                <div className="hover:text-red-400 transition-colors">
                                    {isLiked ? <FaHeart size={13} className="text-red-500" /> : <Heart size={13} />}
                                </div>
                                {likesCount}
                            </button>
                            <CreateReplayComment postId={postId} commentId={commentId} />
                            <ReplayComments postId={postId} commentId={commentId} />

                        </>}

                    </div>
                </div>
            </div >
            {isOpenEdit && <EditComponent setisOpenEdit={setisOpenEdit} postId={postId} commentId={commentId} content={content ?? ""} image={image ?? ""} />}
        </>
    );
}
