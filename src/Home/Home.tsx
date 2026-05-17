import { useQuery } from "@tanstack/react-query";
import PostDesign from "../components/PostDesign";
import axiosInstance from "../lib/axios";
import Loading from "../components/Loading";
import { useMemo, useState } from "react";
import CreatePostPopup from "../components/CreatePostPopup";

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




  return (
    <>


      <div className="w-full max-w-2xl mx-auto mt-2 px-3 sm:px-4 relative">

        <button onClick={() => setisOpened(!isOpened)} className="bg-white border my-3 cursor-pointer border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
            <img src={userimage} alt="user" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 cursor-text">
            <input
              type="text"
              placeholder="What's on your mind?"
              className="w-full bg-transparent text-sm text-gray-500 outline-none"
            />
          </div>
        </button>

        {isOpened && <CreatePostPopup userimage={userimage} setisOpened={setisOpened} userName={userName} />}



        {posts?.map((post) => <PostDesign key={post._id} post={post} />)}


      </div>

    </>
  )
}
