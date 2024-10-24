import { useNavigate, useParams } from 'react-router-dom';
import { useGetSpecificStoryQuery, useDeleteStoryMutation } from '../../redux/api/storyApi';
import { RootState, useAppSelector } from "../../redux/store";
import toast from "react-hot-toast";
import { CommentsList } from '../comment/Comment';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";


export function ReadStoryPage() {
    const {storyId} = useParams()
    const userId = useAppSelector((state: RootState) => state.user).user?.userId;
    const {data: story, error} = useGetSpecificStoryQuery(storyId ? storyId: "undefined")
    const [deleteStory] = useDeleteStoryMutation()

    

    const navigate = useNavigate()

    const handleBack = () => {
        navigate("/read");
    };

    const handleCreateChapter = () => {
        navigate(`/create-chapter/${storyId}`);
    };

    const handleUpdateStory = () => {
        navigate(`/update-story/${storyId}`);
    };

    const handleDeleteStory = async () => {
        await deleteStory(storyId ? storyId: "undefined").then((res) => {
            if (res) {
              if ("data" in res) {
                toast.success("Delete story success!");
                navigate("/");
              } else if ("data" in res.error) {
                const errorData = res.error.data as { message: string };
                toast.error(errorData.message);
              } else {
                toast.error("Unknown error!");
              }
            }
        })
        navigate(`/your-story`);
    };

    if (story && storyId){
    
        if (story.authorId === userId){
            return (
                <div className="p-4 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
                <div className="text-lg mb-6 whitespace-pre-line">
                <ReactQuill
                        value={story.description}
                        readOnly={true}
                        theme={"bubble"}
                />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <button
                      onClick={handleUpdateStory}
                      className="rounded-lg flex flex-row items-center gap-2 justify-center bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 hover:dark:bg-green-600 duration-200 transition-all ease-in-out px-4 py-2"
                      >
                      Update Story
                  </button>
                  <button
                      onClick={handleDeleteStory}
                      className="rounded-lg flex flex-row items-center gap-2 justify-center bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 hover:dark:bg-red-600 duration-200 transition-all ease-in-out px-4 py-2"
                      >
                      Delete Story
                  </button>
                </div>
                <h1 className="text-3xl font-bold mb-4"></h1>
                <h2 className="text-2xl font-semibold mb-3">Chapters</h2>
                <button
                    onClick={handleCreateChapter}
                    className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                    >
                    Create Chapter
                </button>
                <h1 className="text-3xl font-bold mb-4"></h1>
                <div className="flex flex-wrap gap-3 w-full py-5 px-4">
                  <div className="w-full h-60 overflow-y-auto">
                    {
                      story.chapters?.map((chapter) => (
                        <a href={`/read-chapter/${chapter.id}`} className="block dark:text-indigo-300" key={chapter.id}>
                          <div className="w-full flex flex-col  justify-center bg-gray-200 dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500 p-4 rounded-lg shadow-md mb-4">
                            <p>Chapter {chapter.order}. {chapter.title}</p>
                          </div>
                        </a>
                      ))
                    }
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-3">Comments</h2>
                <CommentsList story={story}></CommentsList>
                <button
                    onClick={handleBack}
                    className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                    >
                    Back
                </button>
                </div>
            );
        }
        return (
            <div className="p-4 max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
              <div className="text-lg mb-6 whitespace-pre-line">
              <ReactQuill
                        value={story.description}
                        readOnly={true}
                        theme={"bubble"}
                />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Chapters</h2>
              <div className="flex flex-wrap gap-3 w-full py-5 px-4">
                <div className="w-full h-80 overflow-y-auto">
                  {
                    story.chapters?.map((chapter) => (
                      <a href={`/read-chapter/${chapter.id}`} className="block dark:text-indigo-300" key={chapter.id}>
                        <div className="w-full flex flex-col  justify-center bg-gray-200 dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500 p-4 rounded-lg shadow-md mb-4">
                          <p>Chapter {chapter.order}. {chapter.title}</p>
                        </div>
                      </a>
                    ))
                  }
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Comments</h2>
              <CommentsList story={story}></CommentsList>
              <button
                    onClick={handleBack}
                    className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                    >
                    Back
              </button>
            </div>
        );
    } else {
      if (error){
        return (
          <div>
            <div className="flex flex-wrap gap-3 w-full py-10">
              <div className="flex flex-wrap gap-3 w-full py-5 font-bold">
                
              </div>
  
              <div className="flex flex-wrap gap-3 w-full py-5 px-4">
                <div className="w-full">
                  <p className='font-bold'> You don't have permission to access this page! </p>
                </div>
              </div>

              <button
                    onClick={handleBack}
                    className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                    >
                    Back
              </button>
            </div>
          </div>
        )
      }
      console.log("masuk")
      return (
        <div>
          <div className="flex flex-wrap gap-3 w-full py-10">
            <div className="flex flex-wrap gap-3 w-full py-5">
              
            </div>

            <div className="flex flex-wrap gap-3 w-full py-5 px-4">
              <div className="w-full">
                <p> Loading ... </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
};

