import { useMemo, useState } from 'react'
import axiosInstance from '../lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spinner, toast } from '@heroui/react';
import { Check, UserPlus } from 'lucide-react';
import type { dataTypeOfGetUserProfile } from './UserData';


export default function FollowButton({ userId: profileUserId }: { userId: string }) {
    const client = useQueryClient()

    const userId = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}")._id ?? ""; }
        catch { return ""; }
    }, []);

    const { data: userAccount, isLoading } = useQuery<dataTypeOfGetUserProfile>({
        queryKey: ["followUserProfile", profileUserId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/users/${profileUserId}/profile`);
            return data.data;
        },
        enabled: Boolean(profileUserId),
    });

    const [optimisticFollowing, setOptimisticFollowing] = useState<boolean | null>(null);

    const handleFollow = (userId: string) => {
        return axiosInstance.put(`/users/${userId}/follow`);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: handleFollow,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["userProfile", profileUserId] })
            client.invalidateQueries({ queryKey: ["followUserProfile", profileUserId] })
            setOptimisticFollowing((prev) => !(prev ?? userAccount?.isFollowing ?? false));
        },
        onError: () => {
            toast.danger("unexpected error");
        },
    });

    const user = userAccount?.user;
    const isFollowing = optimisticFollowing ?? userAccount?.isFollowing ?? false;

    if (isLoading || !user) {
        return <Spinner size="sm" />;
    }

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
