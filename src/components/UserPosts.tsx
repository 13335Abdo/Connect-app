import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../lib/axios"
import Loading from "./Loading";
import type { PostType } from "../Home/Home";
import PostDesign from "./PostDesign";

export default function UserPosts({ userId }: { userId: string }) {

    async function userPosts(): Promise<PostType[]> {

        const data = await axiosInstance(`/users/${userId}/posts`)
        return data.data.data.posts

    }
    const { data, isLoading, error } = useQuery({
        queryKey: ["userPosts", userId],
        queryFn: userPosts
    })
    console.log("userPostssssssssss", data);

    if (isLoading) {
        return <Loading />

    }
    if (error) {
        return null
    }


    return (
        <>

            {data?.map((post) => <PostDesign key={post._id} post={post} />)}



        </>
    )
}
