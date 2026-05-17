import { useQuery } from "@tanstack/react-query";
import PostDesign from "../components/PostDesign";
import axiosInstance from "../lib/axios";
import Loading from "../components/Loading";
import { useMemo, useState } from "react";
import CreatePostPopup from "../components/CreatePostPopup";
import { Spinner } from "@heroui/react";
import FollowButton from "../components/FollowButton";
import { Link } from "react-router-dom";

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
      <div className="max-w-7xl mx-auto mt-2 px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_50%_260px] gap-5 items-start">

          {/* Left Empty Space */}
          <div className="hidden lg:block"></div>

          {/* Feed */}
          <div className="min-w-0">
            <button
              onClick={() => setisOpened(!isOpened)}
              className="bg-white border my-3 cursor-pointer border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 w-full"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img src={userimage} alt="user" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                <p className="text-sm text-gray-400 text-left">
                  What's on your mind?
                </p>
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
          <div className="w-64 mt-10 shrink-0 hidden lg:block sticky top-4 h-[50vh]">
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col h-full">

              {/* Header */}
              <div className="px-3.5 py-2.5 border-b border-gray-100 shrink-0">
                <p className="text-[13px] font-medium text-gray-900">
                  People you may know
                </p>
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {followData?.map((follow) => (
                  <div
                    key={follow._id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={follow.photo}
                      alt={follow.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />

                    <Link
                      to={`/userData/${follow._id}`}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-[12px] font-medium text-gray-900 truncate">
                        {follow.name}
                      </p>

                      <p className="text-[11px] text-gray-400 truncate">
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
