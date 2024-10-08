import { useNavigate, useParams } from 'react-router-dom';
import { useGetSpecificStoryQuery } from '../../redux/api/storyApi';
import { useGetSpecificChapterQuery, useDeleteChapterMutation } from '../../redux/api/chapterApi';
import { RootState, useAppSelector } from "../../redux/store";
import toast from "react-hot-toast";
import { Chapter } from '../../redux/types/story';
import ReactMarkdown from 'react-markdown';


export function ReadChapterPage() {
    const {chapterId} = useParams()
    const userId = useAppSelector((state: RootState) => state.user).user?.userId;
    const {data: chapter} = useGetSpecificChapterQuery(chapterId ? chapterId: "undefined")
    const {data: story} = useGetSpecificStoryQuery(chapter?.storyId ? chapter?.storyId: "undefined")
    const [deleteChapter] = useDeleteChapterMutation()
    

    const navigate = useNavigate()

    const handleBack = () => {
        navigate(`/read-story/${chapter?.storyId}`);
    };

    const handleUpdateChapter = () => {
        navigate(`/update-chapter/${chapterId}`);
    };

    const handleNextChapter = (nextChapter: Chapter) => {
        if (nextChapter){
            navigate(`/read-chapter/${nextChapter.id}`);
        } else{
            navigate(`/read-story/${chapter?.storyId}`)
        }
        ;
    };

    const handlePrevChapter = (prevChapter: Chapter) => {
        if (prevChapter){
            navigate(`/read-chapter/${prevChapter.id}`);
        } else {
            navigate(`/read-story/${chapter?.storyId}`);
        }
        
    };

    const handleDeleteChapter = async () => {
        await deleteChapter(chapterId ? chapterId: "undefined").then((res) => {
            if (res) {
              if ("data" in res) {
                toast.success("Delete chapter success!");
                navigate(`/read-story/${chapter?.storyId}`);
              } else if ("data" in res.error) {
                const errorData = res.error.data as { message: string };
                toast.error(errorData.message);
              } else {
                toast.error("Unknown error!");
              }
            }
        })
        // navigate(`/your-story`);
    };

    if (chapter && chapterId && story){
        const chapterList = story.chapters
        const currChapIdx = chapterList.findIndex((chapter) => chapter.id === chapterId)
        const nextChap = chapterList[currChapIdx+1]
        const prevChap = chapterList[currChapIdx-1]

        if (story.authorId === userId){

            return (
                <div className="p-4 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Chapter {chapter.order}</h1>
                <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>
                <div className="text-lg mb-6 whitespace-pre-line">
                    <ReactMarkdown>{chapter.content}</ReactMarkdown>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <button
                        onClick={handleUpdateChapter}
                        className="rounded-lg flex flex-row items-center gap-2 justify-center bg-green-500 text-white hover:bg-green-600 dark:bg-gray-500 hover:dark:bg-green-600 duration-200 transition-all ease-in-out px-4 py-2"
                        >
                        Update Chapter
                    </button>
                    <button
                        onClick={handleDeleteChapter}
                        className="rounded-lg flex flex-row items-center gap-2 justify-center bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 hover:dark:bg-red-600 duration-200 transition-all ease-in-out px-4 py-2"
                        >
                        Delete Chapter
                    </button>
                </div>
                
                <h1 className="text-3xl font-bold mb-4"></h1>
                <div className="flex flex-row items-center gap-4">
                    {
                        prevChap ? 
                            <button
                            onClick={() => handlePrevChapter(prevChap)}
                            className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                            >
                                Previous
                            </button> :  
                            <button
                            onClick={() => handlePrevChapter(prevChap)}
                            disabled={true}
                            className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-800 text-white cursor-not-allowed dark:bg-gray-800 duration-200 transition-all ease-in-out px-4 py-2"
                            >
                                Previous
                            </button>
                    }
                    {
                        nextChap ? 
                            <button
                            onClick={() => handleNextChapter(nextChap)}
                            className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                            >
                                Next
                            </button> :  
                            <button
                            onClick={() => handleNextChapter(nextChap)}
                            disabled={true}
                            className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-800 text-white cursor-not-allowed dark:bg-gray-800 duration-200 transition-all ease-in-out px-4 py-2"
                            >
                                Next
                            </button>
                    }
                </div>
                
                <h1 className="text-3xl font-bold mb-4"></h1>
                <button
                    onClick={handleBack}
                    className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                    >
                    Back to Story Page
                </button>
                </div>
            );
        }
        return (
            <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Chapter {chapter.order}</h1>
            <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>
            <p className="text-lg mb-6 whitespace-pre-line">{chapter.content}</p>
            <div className="flex flex-row items-center gap-4">
                    {
                        prevChap ? 
                            <button
                            onClick={() => handlePrevChapter(prevChap)}
                            className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                            >
                                Previous
                            </button> :  
                            <button
                            onClick={() => handlePrevChapter(prevChap)}
                            disabled={true}
                            className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-800 text-white cursor-not-allowed dark:bg-gray-800 duration-200 transition-all ease-in-out px-4 py-2"
                            >
                                Previous
                            </button>
                    }
                    {
                        nextChap ? 
                            <button
                            onClick={() => handleNextChapter(nextChap)}
                            className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                            >
                                Next
                            </button> :  
                            <button
                            onClick={() => handleNextChapter(nextChap)}
                            disabled={true}
                            className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-800 text-white cursor-not-allowed dark:bg-gray-800 duration-200 transition-all ease-in-out px-4 py-2"
                            >
                                Next
                            </button>
                    }
                </div>
                
                <h1 className="text-3xl font-bold mb-4"></h1>
                <button
                    onClick={handleBack}
                    className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                    >
                    Back to Story Page
                </button>
            </div>
        );
    } 
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
    
};

