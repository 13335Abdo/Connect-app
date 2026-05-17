import { useParams } from "react-router-dom"
import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import UserPosts from "./UserPosts";
import UserAccountDetails from "./UserAccountDetails";

interface getUserProfile {
    success: string,
    message: string,
    data: dataTypeOfGetUserProfile
}
export interface dataTypeOfGetUserProfile {
    user: userData,
    isFollowing: boolean,
}
interface userData {
    _id: string,
    username: string,
    photo: string,
    name: string,
    id: string,
    gender: string,
    followingCount: number,
    following: follwers[],
    followersCount: number,
    followers: follwers[],
    email: string,
    dateOfBirth: string,
    createdAt: string,
    cover: string,
    bookmarksCount: number,
}
interface follwers {
    _id: string,
    photo: string,
    name: string,
    id: string,
    followingCount: number,
    followersCount: number,
    bookmarksCount: number,
}

export default function UserData() {

    const params = useParams()
    console.log("params", params.usrID);
    const userId = params.usrID

    async function userProfile(): Promise<getUserProfile> {

        const data = await axiosInstance.get(`/users/${userId}/profile`)
        return data.data

    }
    const { data, isLoading, error } = useQuery({
        queryKey: ["userProfile", userId],
        queryFn: userProfile,
    })
    console.log("dataasasasas", data);

    if (isLoading) {

        return <Loading />

    }

    if (error) {

        return null

    }


    return (

        <div className="w-1/2 m-auto mt-2 relative">

            <UserAccountDetails userAccount={data?.data}/>
            <UserPosts userId={userId} />

        </div>
    )
}
