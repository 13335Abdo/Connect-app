import { X } from "lucide-react";
import FollowButton from "./FollowButton";
import { Link } from "react-router-dom";

interface UserItem {
    _id: string;
    name: string;
    username: string;
    photo: string;
}

interface Props {
    title: string;
    users: UserItem[];
    setisOpened: (x: boolean) => void;
}

export default function UsersListPopup({ title, users, setisOpened }: Props) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setisOpened(false)}
        >
            <div className="bg-white rounded-xl w-full max-w-[380px] overflow-hidden border border-gray-100 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                    <span className="text-[15px] font-medium text-gray-900">{title}</span>
                    <button
                        onClick={() => setisOpened(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Empty state */}
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 gap-2">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                            <i className="ti ti-users text-[24px] text-gray-400" aria-hidden="true" />
                        </div>
                        <p className="text-[14px] font-medium text-gray-700">
                            {title === "Followers" ? "No followers yet" : "Not following anyone"}
                        </p>
                        <p className="text-[13px] text-gray-400 text-center">
                            {title === "Followers"
                                ? "When someone follows this user, they'll appear here."
                                : "When this user follows someone, they'll appear here."}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col max-h-[360px] overflow-y-auto py-1.5">
                        {users.map((user) => (
                            <div key={user._id} className="flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                <Link to={`/userData/${user._id}`} className="flex gap-3 items-center">
                                    <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-[14px] font-medium text-gray-900 truncate">{user.name}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}