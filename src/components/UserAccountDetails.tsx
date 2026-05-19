import { useContext, useMemo, useState } from "react";
import { FaCamera } from "react-icons/fa";
import FollowButton from "./FollowButton";
import type { dataTypeOfGetUserProfile } from "./UserData";
import UsersListPopup from "./UsersListPopup";
import ChangeCover from "./ChangeCover";
import ChangePhoto from "./ChangePhoto";
import { Cake, CalendarDays, Mail, UserRound } from "lucide-react";
import { profilephotoContext } from "../contrext/photoContext";

export default function UserAccountDetails({ userAccount }: { userAccount: dataTypeOfGetUserProfile }) {
    const [follwers, setfollwers] = useState(false)
    const [follwering, setfollwering] = useState(false)
    const [photoChange, setphotoChange] = useState(false)
    const [coverChange, setcoverChange] = useState(false)
    const [coverphoto, setcoverphoto] = useState<string | null>(null)

    const { profilePicture } = useContext(profilephotoContext)

    const userId = useMemo<string>(() => {
        try { return JSON.parse(localStorage.getItem("loggedUser") ?? "{}")._id ?? ""; }
        catch { return ""; }
    }, []);

    const { user } = userAccount;
    console.log("userddd", user);



    return (
        <div className="bg-white border mb-5 border-white/80 rounded-2xl overflow-hidden max-w-2xl mx-auto shadow-sm shadow-slate-200/80">
            {/* Cover */}
            <div className="flex relative group">

                {userId == user._id ? <img src={coverphoto ?? user.cover} alt="cover" className="w-full h-56 object-cover" /> :
                    <>
                        {
                            user.cover
                                ? <img src={user.cover} alt="cover" className="w-full h-56 object-cover" />
                                : <div className="w-full h-56 bg-linear-to-br from-sky-100 via-white to-blue-100" />
                        }
                    </>}

                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/35 to-transparent" />
                {userId == user._id && <button onClick={() => setcoverChange(!coverChange)} className="absolute bottom-4 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200 cursor-pointer transition hover:scale-105"><FaCamera /></button>}
            </div>
            {coverChange && <ChangeCover setcoverphoto={setcoverphoto} />}


            <div className="px-5 pb-5">
                {/* Avatar + Follow btn */}
                <div className="flex items-end justify-between -mt-12 mb-3 relative">
                    <div className="relative">
                        {userId == user._id ? <img
                            // @ts-ignore
                            src={profilePicture ?? user.photo}
                            alt={user.name}
                            className="w-24 h-24 rounded-full border-4 border-white object-cover shrink-0 shadow-lg shadow-slate-900/10"
                        /> : <img
                            src={user.photo}
                            alt={user.name}
                            className="w-24 h-24 rounded-full border-4 border-white object-cover shrink-0 shadow-lg shadow-slate-900/10"
                        />}

                        {userId == user._id && <button onClick={() => setphotoChange(!photoChange)} className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600 shadow-md ring-1 ring-slate-200 cursor-pointer transition hover:scale-105"><FaCamera /></button>}
                    </div>
                    <FollowButton userId={user._id} />
                </div>
                {photoChange && <ChangePhoto />}
                {userId == user._id && <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">My profile</div>}

                {/* Name */}
                <p className="text-2xl font-bold tracking-tight text-slate-950">{user.name}</p>
                <p className="text-[13px] font-medium text-slate-400 mb-4">@{user.username}</p>

                {/* Meta */}
                <div className="flex flex-wrap gap-2.5 mb-4">
                    {user.gender && (
                        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-slate-600">
                            <UserRound size={15} />
                            {user.gender}
                        </span>
                    )}
                    {user.dateOfBirth && (
                        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-slate-600">
                            <Cake size={15} />
                            {new Date(user.dateOfBirth).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                    )}
                    {user.createdAt && (
                        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-slate-600">
                            <CalendarDays size={15} />
                            Joined {new Date(user.createdAt).toLocaleDateString("en", { month: "short", year: "numeric" })}
                        </span>
                    )}
                    {user.email && (
                        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-slate-600">
                            <Mail size={15} />
                            {user.email}
                        </span>
                    )}
                </div>

                <div className="h-px bg-slate-100 mb-4" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setfollwers(!follwers)} className="bg-slate-50 hover:bg-blue-50 rounded-2xl p-4 transition text-left">
                        <p className="text-2xl font-bold text-slate-900">{user.followersCount}</p>
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Followers</p>
                    </button>
                    <button onClick={() => setfollwering(!follwering)} className="bg-slate-50 hover:bg-blue-50 rounded-2xl p-4 transition text-left">
                        <p className="text-2xl font-bold text-slate-900">{user.followingCount}</p>
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Following</p>
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
