import { useGetAllHistoriesQuery } from "../redux/api/historyApi";
import { RootState, useAppSelector } from "../redux/store";
import { dateToString } from "../utils/utils";

export function LandingPage() {
  const userId = useAppSelector((state: RootState) => state.user).user?.userId;

  if(userId){
    const {data: historyData} = useGetAllHistoriesQuery()
    if(historyData){
      return (
        <div>
          <div className="mt-8 mb-4">
            <div className="flex justify-center">
              <div className="text-6xl font-bold">StoryTell</div>
            </div>
          </div>

          <div className="mt-8 mb-4">
            <div className="flex justify-center">
              <div className="text-3xl font-bold">
                Create and read story to your heart content!
              </div>
            </div>
          </div>

          <div className="py-10">
            <div className="container mx-auto w-4/5">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 dark:text-gray-200">
                Your Reading History
              </h2>
              <div className="flex flex-row flex-wrap gap-8 justify-center">
                {historyData?.map((history) => (
                  <a href={`/read-story/${history.storyId}`} key={history.id}>
                    <div className="flex flex-col justify-center items-center border border-gray-300 rounded-lg p-4 hover:scale-110 duration-200 ease-in-out transition-all">
                      <div className="rounded-full h-4 w-4 md:h-6 md:w-6 drop-shadow-xl text-start dark:bg-gray-200 dark:text-gray-800 flex items-center justify-center bg-gray-800 text-white">
                        {historyData.findIndex((items) => (items.id == history.id)) + 1}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                        {history.story.title.length > 50 ? history.story.title.substring(0,50) + "..." : history.story.title}
                      </h3>
                      <p className="text-gray-600 mt-2 text-center dark:text-gray-400">
                        {dateToString(history.date)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="mt-8 mb-4">
            <div className="flex justify-center">
              <div className="text-6xl font-bold">StoryTell</div>
            </div>
          </div>

          <div className="mt-8 mb-4">
            <div className="flex justify-center">
              <div className="text-3xl font-bold">
                Create and read story to your heart content!
              </div>
            </div>
          </div>

          <div className="py-10">
            <div className="container mx-auto w-4/5">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 dark:text-gray-200">
                Your Reading History
              </h2>
              <div className="flex flex-row flex-wrap gap-8 justify-center">
                <p className="text-2xl md:text-2xl font-bold text-blue-800 text-center mb-12 dark:text-gray-200">
                  Loading ...
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
  } else {
    return (
      <div>
        <div className="mt-8 mb-4">
          <div className="flex justify-center">
            <div className="text-6xl font-bold">StoryTell</div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <div className="flex justify-center">
            <div className="text-3xl font-bold">
              Create and read story to your heart content!
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <div className="flex justify-center">
            <div className="text-2xl font-bold">
              Please Login or Register to enjoy Storytell.
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}
