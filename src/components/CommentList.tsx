import { MessageCircle } from "lucide-react";
import type { CommentType } from "./PostDesign";
import CommentItem from "./CommentItem";

interface Props {
    comments: CommentType["data"]["data"]["comments"];
    commentsCount: number;
    userId: string;
    postId: string
}

export default function CommentList({ postId, comments, commentsCount, userId }: Props) {

    return (
        <>
            {/* Label */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-[12px] font-bold uppercase tracking-wide text-slate-500">
                    {comments?.length > 0 ? `${commentsCount} Comments` : "Comments"}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Empty state */}
            {comments?.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                        <MessageCircle size={24} className="text-blue-500" />
                    </div>
                    <p className="text-[14px] font-semibold text-slate-700 mb-1">No comments yet</p>
                    <p className="text-[12px] text-slate-400">Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {comments?.map((comment) => (
                        <CommentItem
                            likes={comment.likes}
                            key={comment._id}
                            postId={postId}
                            commentId={comment._id}
                            commentCreator={comment.commentCreator}
                            content={comment.content}
                            image={comment.image}
                            createdAt={comment.createdAt}
                            likesCount={comment.likes.length}
                            isOwner={comment.commentCreator._id === userId}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
