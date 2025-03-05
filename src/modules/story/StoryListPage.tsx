import { useNavigate } from "react-router-dom";
import { useGetAllStoriesQuery } from "../../redux/api/storyApi";
import { useState } from "react";

export function StoryListPage() {
  const navigate = useNavigate();

  const {data: stories} = useGetAllStoriesQuery()
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

  if (stories){
    return (
      <div>
        <div className="flex flex-wrap gap-3 max-w-3xl mx-auto py-10">
          <h2 className="text-3xl md:text-5xl text-center w-full font-bold">
            All Stories
          </h2>
          <div className="flex flex-wrap gap-3 w-full py-5 px-4 md:px-8">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by title..."
                className="w-full px-3 py-2 placeholder-gray-400 text-gray-700 bg-gray rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
          </div>

          <div className="flex flex-wrap gap-3 w-full py-5 px-10">
            <div className="w-full">
              {
                filteredStories?.map((story) => (
                  <a href={`/read-story/${story.id}`} className="block dark:text-indigo-300" key={story.id}>
                    <div className="w-full flex flex-col  justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 p-4 rounded-lg shadow-md mb-4">
                      <p>Title: {story.title.length > 50 ? story.title.substring(0,50) + "..." : story.title}</p>
                      <p>Author: {story.author.username}</p>
                    </div>
                  </a>
                ))
              }
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full px-4 md:px-8 py-5">
            <button
              onClick={handleBack}
              className="rounded-lg flex flex-row justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out py-2 px-5 md:px-8 "
            >
              Back
            </button>
          </div>
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

          <div className="flex flex-wrap gap-3 w-full py-5 px-4 justify-center items-center">
            <div className="w-full text-center">
                <p className="text-xl md:text-2xl"> Loading ... </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full px-4 md:px-8 py-5">
            <button
              onClick={handleBack}
              className="rounded-lg flex flex-row justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out py-2 px-5 md:px-8 "
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )    
  }
  
} 