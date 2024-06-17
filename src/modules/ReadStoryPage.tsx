import { useNavigate, useParams } from 'react-router-dom';
import { useGetSpecificStoryQuery, useDeleteStoryMutation } from '../redux/api/storyApi';
import { RootState, useAppSelector } from "../redux/store";
import toast from "react-hot-toast";

export function ReadStoryPage() {
    const {storyId} = useParams()
    const userId = useAppSelector((state: RootState) => state.user).user?.userId;
    const {data: story} = useGetSpecificStoryQuery(storyId ? storyId: "undefined")
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
                <p className="text-lg mb-6 whitespace-pre-line">{story.description}</p>
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
                  <div className="w-full">
                    {
                      story.chapters?.map((chapter) => (
                        <a href={`/read-chapter/${chapter.id}`} className="block dark:text-indigo-300" key={chapter.id}>
                          <div className="w-full flex flex-col  justify-center bg-gray-200 dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500 p-4 rounded-lg shadow-md mb-4">
                            <p>{chapter.order}. {chapter.title}</p>
                          </div>
                        </a>
                      ))
                    }
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4"></h1>
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
            <p className="text-lg mb-6 whitespace-pre-line">{story.description}</p>
            <h2 className="text-2xl font-semibold mb-3">Chapters</h2>
            <div className="flex flex-wrap gap-3 w-full py-5 px-4">
            <div className="w-full">
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
            </div>
        );
    } else {
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

