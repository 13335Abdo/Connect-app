import { useQuery } from "@tanstack/react-query";
import PostDesign from "../components/PostDesign";
import axiosInstance from "../lib/axios";
import Loading from "../components/Loading";
import { useContext, useMemo, useState } from "react";
import CreatePostPopup from "../components/CreatePostPopup";
import { Spinner } from "@heroui/react";
import FollowButton from "../components/FollowButton";
import { Link } from "react-router-dom";
import { ImagePlus, Search, Sparkles } from "lucide-react";
import { profilephotoContext } from "../contrext/photoContext";

interface FollowData {
  _id: string,
  username: string,
  photo: string,
  name: string,
  mutualFollowersCount: number,
  followersCount: number,
}

export interface UserType {
  _id: string,
  name: string,
  username: string,
  photo: string,
}
interface CommentType {
  commentCreator: UserType,
  content: string,
  createdAt: string,
  likes: string[],
  parentComment: string,
  post: string,
  image: string,
  _id: string,
}

export interface PostType {
  user: UserType
  _id: string,
  body: string,
  image: string,
  privacy: string,
  sharedPost: PostType,
  likes: string[],
  createdAt: string,
  commentsCount: number,
  sharesCount: number,
  likesCount: number,
  isShare: boolean,
  id: string,
  bookmarked: boolean,
  topComment: CommentType,
}
interface ApiResponseType {
  data: {

    data: { posts: PostType[] },
    success: boolean,
    message: string,
    meta: {
      pagination: MetaType
    }

  }
}
export interface MetaType {

  currentPage: number,
  limit: number,
  nextPage: number,
  numberOfPages: number,
  total: number,

}

export default function Home() {

  const [isOpened, setisOpened] = useState(false)
    const { profilePicture } = useContext(profilephotoContext)
  


  const userimage = useMemo<string>(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedUser") ?? "{}").photo ?? "";
    }
    catch { return ""; }
  }, []);
  const userName = useMemo<string>(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedUser") ?? "{}").username ?? "";
    }
    catch { return ""; }
  }, []);
  const { data: followData, isLoading: followIsLoading, error: followErorr } = useQuery({
    queryKey: ["getFollowSugest"],
    queryFn: getFollowSugest
  })

  function allposts(): Promise<ApiResponseType | null> {

    return axiosInstance.get("/posts")

  }



  const { data, isLoading, error } = useQuery({
    queryKey: ["allposts"],
    queryFn: allposts
  })
  console.log("postData", data);


  const posts = data?.data?.data.posts

  if (isLoading) {

    return <Loading />

  }
  if (error) {

    return null

  }
  async function getFollowSugest(): Promise<FollowData[]> {
    const follow = await axiosInstance.get(`/users/suggestions?limit=40`)
    return follow?.data.data.suggestions
  }

  console.log("followData", followData);

  if (followIsLoading) {

    return <Spinner />

  }
  if (followErorr) {

    return null

  }




  return (
    <>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(180px,1fr)_minmax(0,620px)_300px] gap-5 items-start">

          {/* Left Empty Space */}
          <aside className="hidden lg:block sticky top-24">
            <div className="rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm shadow-slate-200/70 backdrop-blur">
              <div className="flex items-center gap-3">
                 {/* @ts-ignore */}
                <img src={profilePicture??userimage} alt="user" className="h-11 w-11 rounded-full object-cover ring-2 ring-white" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{userName || "Welcome back"}</p>
                  <p className="text-xs text-slate-500">Your social space</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Feed */}
          <div className="min-w-0">
            <button
              onClick={() => setisOpened(!isOpened)}
              className="group mb-4 w-full cursor-pointer rounded-2xl border border-white/80 bg-white p-4 shadow-sm shadow-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80"
            >
              <div className="flex items-center gap-3">
                
                <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-slate-100">
                 {/* @ts-ignore */}
                  <img src={profilePicture??userimage} alt="user" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-left transition group-hover:border-blue-200 group-hover:bg-blue-50/50">
                  <p className="text-sm font-medium text-slate-500">
                    What's on your mind?
                  </p>
                </div>

                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm sm:flex">
                  <ImagePlus size={19} />
                </div>
              </div>
            </button>

            {isOpened && (
              <CreatePostPopup
                userimage={userimage}
                setisOpened={setisOpened}
                userName={userName}
              />
            )}

            {posts?.map((post) => (
              <PostDesign key={post._id} post={post} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="mt-1 shrink-0 hidden lg:block sticky top-24 h-[calc(100vh-7.5rem)]">
            <div className="bg-white/90 border border-white/80 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm shadow-slate-200/70 backdrop-blur">

              {/* Header */}
              <div className="px-4 py-3.5 border-b border-slate-100 shrink-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">
                    People you may know
                  </p>
                  <Sparkles size={16} className="text-blue-500" />
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400">
                  <Search size={15} />
                  <span className="text-xs font-medium">Discover friends</span>
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 py-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {followData?.map((follow) => (
                  <div
                    key={follow._id}
                    className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={follow.photo}
                      alt={follow.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm"
                    />

                    <Link
                      to={`/userData/${follow._id}`}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-[13px] font-semibold text-slate-900 truncate">
                        {follow.name}
                      </p>

                      <p className="text-[11px] text-slate-400 truncate">
                        {follow.mutualFollowersCount > 0
                          ? `${follow.mutualFollowersCount} mutual`
                          : `${follow.followersCount} followers`}
                      </p>
                    </Link>

                    <FollowButton userId={follow._id} />
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
