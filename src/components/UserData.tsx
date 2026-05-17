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
    username?: string,
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
    const userId = params.usrID ?? ""

    async function userProfile(): Promise<getUserProfile> {

        const data = await axiosInstance.get(`/users/${userId}/profile`)
        return data.data

    }
    const { data, isLoading, error } = useQuery({
        queryKey: ["userProfile", userId],
        queryFn: userProfile,
        enabled: Boolean(userId),
    })
    console.log("dataasasasas", data);

    if (isLoading) {

        return <Loading />

    }

    if (error) {

        return (
            <div className="w-full max-w-2xl mx-auto mt-6 px-3 sm:px-4">
                <div className="bg-white border border-gray-100 rounded-xl p-5 text-center text-sm text-gray-500">
                    User profile could not be loaded.
                </div>
            </div>
        )

    }

    if (!data?.data || !userId) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-6 px-3 sm:px-4">
                <div className="bg-white border border-gray-100 rounded-xl p-5 text-center text-sm text-gray-500">
                    User profile was not found.
                </div>
            </div>
        )
    }



    return (

        <div className="w-full max-w-2xl mx-auto mt-2 px-3 sm:px-4 relative">

            <UserAccountDetails userAccount={data.data} />
            <UserPosts userId={userId} />

        </div>
    )
}
