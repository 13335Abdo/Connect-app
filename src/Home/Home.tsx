import { useQuery } from "@tanstack/react-query";
import PostDesign from "../components/PostDesign";
import axiosInstance from "../lib/axios";
import Loading from "../components/Loading";

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
  _id: string,
}

export interface PostType {
  user: UserType
  _id: string,
  body: string,
  image: string,
  privacy: string,
  sharedPost: string,
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




  function allposts(): Promise<ApiResponseType | null> {

    return axiosInstance.get("/posts")

  }



  const { data, isLoading, error } = useQuery({
    queryKey: ["allposts"],
    queryFn: allposts
  })

  const posts = data?.data?.data.posts

  if (isLoading) {

    return <Loading />

  }
  if (error) {

    return null

  }




  return (
    <>

      <div className="w-1/2 m-auto mt-2">


        {posts?.map((post) => <PostDesign key={post._id} post={post} />)}


      </div>

    </>
  )
}
