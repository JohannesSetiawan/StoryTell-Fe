import { useNavigate, useParams } from 'react-router-dom';
import { SetStateAction, useState } from "react";
import { useGetSpecificStoryQuery, useDeleteStoryMutation } from '../../redux/api/storyApi';
import { RootState, useAppSelector } from "../../redux/store";
import toast from "react-hot-toast";
import { CommentsList } from '../comment/Comment';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { useGetRatingsForSpecificStoryQuery, useGetSpecificUserRatingForStoryQuery } from '../../redux/api/ratingApi';
import { Spacer } from '../../components/common/Spacer';
import RatingModal from '../rating/RatingModal';
import useToggle from '../../components/hooks/useToggle'
import { useGetHistoryForSpecificStoryQuery } from '../../redux/api/historyApi';
import { dateToString } from '../../utils/utils';


export function ReadStoryPage() {
    const { on, toggler } = useToggle();
    const {storyId} = useParams()
    const userId = useAppSelector((state: RootState) => state.user).user?.userId;
    const {data: story, error} = useGetSpecificStoryQuery(storyId ? storyId: "undefined")
    const {data: rating} = useGetRatingsForSpecificStoryQuery(storyId ? storyId: "undefined")
    const {data: userRating} = useGetSpecificUserRatingForStoryQuery(storyId ? storyId: "undefined")
    const {data: history} = useGetHistoryForSpecificStoryQuery(storyId ? storyId: "undefined")
    const [deleteStory] = useDeleteStoryMutation()
    const [openComments, setOpenComments] = useState(false)

    const [searchQuery, setSearchQuery] = useState("");

    const [selectedOption, setSelectedOption] = useState('title')

    const filteredChapter = story?.chapters?.filter(chapter => {
      if(selectedOption === "title"){
        return chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
      } else if (selectedOption === "number"){
        return chapter.order >= Number(searchQuery.toLowerCase())
      } else if (selectedOption === "content"){
        return chapter.content.toLowerCase().includes(searchQuery.toLowerCase())
      } else{
        return chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
      }
    }).sort((a, b) => b.order - a.order);
    

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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    };

    const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
      setSelectedOption(event.target.value);
    };

    const handleShowComment = () => {
      setOpenComments(!openComments)
    }

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

    if (story && storyId && rating && userRating){
      if(history){
        if (story.authorId === userId){
            return (
                <div className="p-4 max-w-3xl mx-auto" style={{ width: '80%', margin: '0 auto' }}>
                  <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
                  <div className="text-lg mb-6 whitespace-pre-line">
                    <ReactQuill
                            value={story.description}
                            readOnly={true}
                            theme={"bubble"}
                    />
                  </div>
                  <Spacer height={10}/>
                  {!story.isprivate && <div> 
                      <p className="text-1xl font-bold mb-4">Rating: {String(rating._avg.rate)}/10</p>
                      <p className="text-1xl mb-4">{String(rating._count.rate)} voters</p>
                    </div>}
                  <Spacer height={10}/>
                    <p className="text-1xl mb-4">Last read: {dateToString(history.date)}</p>
                    <span>Last chapter read: </span> 
                    {
                      history.chapterId ? (
                        <a className="text-1xl mb-4" href={`/read-chapter/${history.chapterId}`}>Chapter {history.chapter?.order}. {history.chapter?.title}</a>
                      ) : (
                        <a className="text-1xl mb-4">None</a>
                      )
                    }
                  <Spacer height={10}/>
                  <div className="flex flex-row items-center gap-4">
                    <button
                        onClick={handleUpdateStory}
                        className="rounded-lg flex flex-row items-center gap-2 justify-center bg-green-400 text-white hover:bg-green-600 dark:bg-green-600 hover:dark:bg-green-800 duration-200 transition-all ease-in-out px-4 py-2"
                        >
                        Update Story
                    </button>
                    <button
                        onClick={handleDeleteStory}
                        className="rounded-lg flex flex-row items-center gap-2 justify-center bg-red-400 text-white hover:bg-red-600 dark:bg-red-600 hover:dark:bg-red-800 duration-200 transition-all ease-in-out px-4 py-2"
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
                  <div className="flex flex-wrap gap-3 w-full py-5">
                    <label htmlFor="dropdown">Choose search method:</label>
                    <select id="dropdown" value={selectedOption} onChange={handleChange}>
                      <option value="title">Title</option>
                      <option value="number">Number</option>
                      <option value="content">Content</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full py-5">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search ..."
                        className="w-full px-3 py-2 placeholder-gray-400 text-gray-700 bg-gray rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                  </div>


                  <div className="flex flex-wrap gap-3 w-full py-5 px-4">
                    <div className="w-full h-60 overflow-y-auto">
                      {
                        filteredChapter?.map((chapter) => (
                          <a href={`/read-chapter/${chapter.id}`} className="block dark:text-indigo-300" key={chapter.id}>
                            <div className="w-full flex flex-col  justify-center bg-gray-200 dark:bg-gray-600 border-2 border-gray-400 dark:border-gray-500 p-4 rounded-lg shadow-md mb-4">
                              <p>Chapter {chapter.order}. {chapter.title}</p>
                            </div>
                          </a>
                        ))
                      }
                    </div>
                  </div>
                  {story.isprivate && <div> 
                    <button
                      onClick={handleShowComment}
                      className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                      >
                      {openComments ? "Hide Comments" : "Show Comments"}
                    </button>
                    </div>
                  }
                  {(!story.isprivate || openComments) && <div> 
                    <h2 className="text-2xl font-semibold mb-3">Comments</h2>
                    <CommentsList story={story}></CommentsList>
                    </div>}
                  <Spacer height={10}/>
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
            <div className="p-4 max-w-3xl mx-auto" style={{ width: '80%', margin: '0 auto' }}>
              <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
              <div className="text-lg mb-6 whitespace-pre-line">
              <ReactQuill
                        value={story.description}
                        readOnly={true}
                        theme={"bubble"}
                />
              </div>
              <Spacer height={10}/>
              <p className="text-1xl font-bold mb-4">Rating: {String(rating._avg.rate)}/10</p>
                <p className="text-1xl mb-4">{String(rating._count.rate)} voters</p>
                <p className="text-1xl mb-4">Your Rating: {userRating.rate ? String(userRating.rate) : userRating.message }</p>
                <button 
                className="rounded-lg flex flex-row items-center gap-2 justify-center bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                onClick={() => toggler()}>Rate</button>
                {on && <RatingModal toggler={toggler} storyId={storyId} prevRating={userRating.id? userRating.id : "undefined"} />}
              <Spacer height={10}/>
              <Spacer height={10}/>
                <p className="text-1xl mb-4">Last read: {dateToString(history.date)}</p>
                <span>Last chapter read: </span> 
                {
                  history.chapterId ? (
                    <a className="text-1xl mb-4" href={`/read-chapter/${history.chapterId}`}>Chapter {history.chapter?.order}. {history.chapter?.title}</a>
                  ) : (
                    <a className="text-1xl mb-4">None</a>
                  )
                }
              <Spacer height={10}/>
              <h2 className="text-2xl font-semibold mb-3">Chapters</h2>
              <div className="flex flex-wrap gap-3 w-full py-5">
                  <label htmlFor="dropdown">Choose search method:</label>
                  <select id="dropdown" value={selectedOption} onChange={handleChange}>
                    <option value="title">Title</option>
                    <option value="number">Number</option>
                    <option value="content">Content</option>
                  </select>
              </div>
              <div className="flex flex-wrap gap-3 w-full py-5">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search ..."
                    className="w-full px-3 py-2 placeholder-gray-400 text-gray-700 bg-gray rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
              </div>

              <div className="flex flex-wrap gap-3 w-full py-5 px-4">
                <div className="w-full h-80 overflow-y-auto">
                  {
                    filteredChapter?.map((chapter) => (
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
        window.location.reload()
      }
        
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

