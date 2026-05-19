import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import type { PostType } from "../Home/Home";
import axiosInstance from "../lib/axios";
import Loading from "./Loading";
import PostDesign from "./PostDesign";

interface AllBookmarks {
    bookmarks: PostType[];
}

export default function GEtAllBookMark() {
    async function getAllBookMark(): Promise<AllBookmarks> {
        const { data } = await axiosInstance.get(`/users/bookmarks`);
        return data.data;
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["getAllBookMark"],
        queryFn: getAllBookMark
    });

    console.log("dddddddddata", data);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return null;
    }

    if (!data?.bookmarks?.length) {
        return (
            <div className="rounded-2xl border border-white/80 bg-white p-8 text-center shadow-sm shadow-slate-200/80">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Bookmark size={24} />
                </div>
                <p className="text-base font-bold text-slate-900">No saved posts yet</p>
                <p className="mt-1 text-sm text-slate-500">Bookmarked posts will show up here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.bookmarks.map((bookmark) => (
                <PostDesign key={bookmark._id} post={bookmark} />
            ))}
        </div>
    );
}
