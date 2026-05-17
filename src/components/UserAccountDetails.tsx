import { useState } from "react";
import FollowButton from "./FollowButton";
import type { dataTypeOfGetUserProfile } from "./UserData";
import UsersListPopup from "./UsersListPopup";

export default function UserAccountDetails({ userAccount }: { userAccount: dataTypeOfGetUserProfile }) {
    const [follwers, setfollwers] = useState(false)
    const [follwering, setfollwering] = useState(false)

    const { user } = userAccount;
    console.log("userddd",user);
    


    return (
        <div className="bg-white border mb-4 border-gray-100 rounded-xl overflow-hidden max-w-2xl mx-auto">
            {/* Cover */}
            {user.cover
                ? <img src={user.cover} alt="cover" className="w-full h-44 object-cover" />
                : <div className="w-full h-44 bg-linear-to-br from-violet-100 to-blue-100" />
            }

            <div className="px-5 pb-5">
                {/* Avatar + Follow btn */}
                <div className="flex items-end justify-between -mt-9 mb-3">
                    <img
                        src={user.photo}
                        alt={user.name}
                        className="w-20 h-20 rounded-full border-[3px] border-white object-cover shrink-0"
                    />
                    <FollowButton userId={user._id} />
                </div>

                {/* Name */}
                <p className="text-[17px] font-medium text-gray-900">{user.name}</p>
                <p className="text-[13px] text-gray-400 mb-3">@{user.username}</p>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {user.gender && (
                        <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                            <i className="ti ti-gender-male text-[15px]" aria-hidden="true" />
                            {user.gender}
                        </span>
                    )}
                    {user.dateOfBirth && (
                        <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                            <i className="ti ti-cake text-[15px]" aria-hidden="true" />
                            {new Date(user.dateOfBirth).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                    )}
                    {user.createdAt && (
                        <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                            <i className="ti ti-calendar text-[15px]" aria-hidden="true" />
                            Joined {new Date(user.createdAt).toLocaleDateString("en", { month: "short", year: "numeric" })}
                        </span>
                    )}
                    {user.email && (
                        <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                            <i className="ti ti-mail text-[15px]" aria-hidden="true" />
                            {user.email}
                        </span>
                    )}
                </div>

                <div className="h-px bg-gray-100 mb-4" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setfollwers(!follwers)} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[18px] font-medium text-gray-900">{user.followersCount}</p>
                        <p className="text-[12px] text-gray-400">Followers</p>
                    </button>
                    <button onClick={() => setfollwering(!follwering)} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[18px] font-medium text-gray-900">{user.followingCount}</p>
                        <p className="text-[12px] text-gray-400">Following</p>
                    </button>
                </div>
                {follwers && (
                    <UsersListPopup title="Followers" users={user.followers} setisOpened={setfollwers} />
                )}
                {follwering && (
                    <UsersListPopup title="Following" users={user.following} setisOpened={setfollwering} />
                )}
            </div>
        </div>
    );
}
