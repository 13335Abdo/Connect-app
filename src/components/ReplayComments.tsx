import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../lib/axios"
import CommentItem, { type CommentItemProps } from "./CommentItem";
import Loading from "./Loading";


interface rplay {
    data: {
        success: boolean;
        message: string;
        data: replies
    }

}
interface replies {

    replies: CommentItemProps[]

}

export default function ReplayComments({ postId, commentId }: { commentId: string, postId: string }) {


    const userId = (() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}")._id ?? ""; }
        catch { return ""; }
    })()

    function getCommentsReplay(): Promise<rplay> {

        return axiosInstance.get(`/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`)

    }

    const { data, isLoading } = useQuery({
        queryFn: getCommentsReplay,
        queryKey: ["getCommentsReplay", postId, commentId]
    })

    console.log("data", data?.data.data.replies);

    const replies = data?.data.data.replies




    return (
        <>

            {isLoading ? <Loading /> : <div className="mt-3 space-y-3 border-l-2 border-slate-200 pl-3">

                {replies?.map((replay) => (<>
                    <CommentItem
                        isFromReplay={true}
                        key={replay.commentId}
                        postId={postId}
                        commentId={replay.commentId}
                        commentCreator={replay.commentCreator}
                        content={replay.content}
                        image={replay.image}
                        createdAt={replay.createdAt}
                        likesCount={replay.likesCount}
                        isOwner={replay.commentCreator._id === userId}
                        likes={replay.likes}
                    />
                </>
                ))}



            </div>}




        </>
    )
}
