import { useNavigate } from "react-router-dom";
import { useGetAllStoriesQuery } from "../redux/api/storyApi";

export function StoryListPage() {
  const navigate = useNavigate();

  const {data: stories} = useGetAllStoriesQuery()
  
  const handleBack = () => {
    navigate("/");
  };

  if (stories){
    return (
      <div>
        <div className="flex flex-wrap gap-3 w-full py-10">
          <h2 className="text-3xl md:text-5xl text-center w-full font-bold">
            All Stories
          </h2>
          <div className="flex flex-wrap gap-3 w-full py-5">
          
          </div>

          <div className="flex flex-wrap gap-3 w-full py-5 px-4">
            <div className="w-full">
              {
                stories?.map((story) => (
                  <a href={`/read-story/${story.id}`} className="block dark:text-indigo-300" key={story.id}>
                    <div className="w-full flex flex-col  justify-center bg-gray-200 dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500 p-4 rounded-lg shadow-md mb-4">
                      <p>Title: {story.title}</p>
                      <p>Author: {story.author.username}</p>
                    </div>
                  </a>
                ))
              }
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
  } else {
    return (
      <div>
        <div className="flex flex-wrap gap-3 w-full py-10">
          <h2 className="text-3xl md:text-5xl text-center w-full font-bold">
            All Stories
          </h2>
          <div className="flex flex-wrap gap-3 w-full py-5">
            {/* <button className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 px-4 py-2 w-1/5 duration-200 transition-all ease-in-out">
              <a href="/capture" className="text-white">
                Create Recording
              </a>
            </button> */}
          </div>

          <div className="flex flex-wrap gap-3 w-full py-5 px-4">
            <div className="w-full">
              <p> Loading ... </p>
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
  
} 