import { useNavigate } from "react-router-dom";
import { useGetSpecificUserStoryQuery } from "../../redux/api/storyApi";
import { RootState, useAppSelector } from "../../redux/store";
import { useState } from "react";

export function UserStoryListPage() {
  const navigate = useNavigate();

  const userId = useAppSelector((state: RootState) => state.user).user?.userId;
  
  const {data: stories} = useGetSpecificUserStoryQuery(userId == undefined? "idSalah" : userId)
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleBack = () => {
    navigate("/");
  };

  if (stories && userId){
    if(stories.length === 0) {
      return (
        <div>
          <div className="flex flex-wrap gap-3 w-full py-10">
            <h2 className="text-3xl md:text-5xl text-center w-full font-bold">
              Your Stories
            </h2>
            <div className="flex flex-wrap gap-3 w-full py-5">
              <button className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 px-4 py-2 w-1/5 duration-200 transition-all ease-in-out">
                <a href="/create-story" className="text-white">
                  Create Story
                </a>
              </button>
            </div>
  
            <div className="flex flex-wrap gap-3 w-full py-5 px-4">
              <div className="w-full">
                <p> You haven't created any story yet! </p>
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
    return (
      <div>
        <div className="flex flex-wrap gap-3 w-full py-10">
          <h2 className="text-3xl md:text-5xl text-center w-full font-bold">
            Your Stories
          </h2>
          <div className="flex flex-wrap gap-3 w-full py-5">
            <button className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 px-4 py-2 w-1/5 duration-200 transition-all ease-in-out">
              <a href="/create-story" className="text-white">
                Create Story
              </a>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 w-full py-5">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by title..."
                className="w-full px-3 py-2 placeholder-gray-400 text-gray-700 bg-gray rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
          </div>

          <div className="flex flex-wrap gap-3 w-full py-5 px-4">
            <div className="w-full">
              {
                filteredStories?.map((story) => (
                  <a href={`/read-story/${story.id}`} className="block dark:text-indigo-300" key={story.id}>
                    <div className="w-full flex flex-col  justify-center bg-gray-200 dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500 p-4 rounded-lg shadow-md mb-4">
                      <p>Title: {story.title.length > 50 ? story.title.substring(0,50) + "..." : story.title} </p>
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
            Your Stories
          </h2>
          <div className="flex flex-wrap gap-3 w-full py-5">
            
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