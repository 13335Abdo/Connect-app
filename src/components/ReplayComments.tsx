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

            {isLoading ? <Loading /> : <div>

                {replies?.map((replay) => (<>
                    <div className="h-px w-5 absolute top-7 inset-s-4 bg-gray-500 rotate-90">

                    </div>
                    <div className="h-px w-5 absolute top-[38px] inset-s-7 bg-gray-500">

                    </div>
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
