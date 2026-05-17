import { useMemo, useState } from 'react'
import axiosInstance from '../lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner, toast } from '@heroui/react';
import { Check, UserPlus } from 'lucide-react';
import type { dataTypeOfGetUserProfile } from './UserData';


export default function FollowButton({ userAccount }:{userAccount:dataTypeOfGetUserProfile}) {

    const { user } = userAccount

    const client = useQueryClient()

    const userId = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}")._id ?? ""; }
        catch { return ""; }
    }, []);

    const [isFollowing, setIsFollowing] = useState(userAccount.isFollowing ?? false);

    const handleFollow = (userId: string) => {
        return axiosInstance.put(`/users/${userId}/follow`);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: handleFollow,
        onSuccess: () => {
            client.invalidateQueries(["userProfile", userId])
            setIsFollowing((prev) => !prev);
        },
        onError: () => {
            toast.danger("unexpected error");
        },
    });

    if (userId === user._id) {
        return (
            <p className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium shrink-0 bg-gray-100 text-gray-400">
                it is you
            </p>
        );
    }

    return (
        <button
            onClick={() => mutate(user._id)}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors shrink-0 cursor-pointer ${isFollowing
                ? "bg-gray-100 text-gray-400"
                : "bg-violet-100 text-violet-600 hover:bg-violet-200"
                }`}
        >
            {isPending ? (
                <Spinner size="sm" />
            ) : (
                <>
                    {isFollowing ? <Check size={13} /> : <UserPlus size={13} />}
                    {isFollowing ? "Following" : "Follow"}
                </>
            )}
        </button>
    );
}