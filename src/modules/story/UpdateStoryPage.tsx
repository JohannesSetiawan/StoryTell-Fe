import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/common";
import { useUpdateStoryMutation, useGetSpecificStoryQuery } from "../../redux/api/storyApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import {QuillToolbar, modules, formats } from "../../utils/quill";

export function UpdateStoryPage() {
  const {storyId} = useParams()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateStory] = useUpdateStoryMutation();
  const {data: story} = useGetSpecificStoryQuery(storyId ? storyId : "undefined")

  useEffect(()=>{
    setDescription(story?.description ? story.description : "")
    setTitle(story?.title ? story.title : "")
    setIsPrivate(story?.isprivate ? story.isprivate : false)
  }, [story])

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      title: title,
      description: description,
      isprivate: isPrivate
    };
    await updateStory({ updateData: data, storyId: storyId? storyId : "undefined"}).then((res) => {
      if (res) {
        if ("data" in res) {
          toast.success("Update story success!");
          navigate(`/read-story/${storyId}`);
        } else if ("data" in res.error) {
          const errorData = res.error.data as { message: string };
          toast.error(errorData.message);
        } else {
          toast.error("Unknown error!");
        }
      }
    });
    setIsLoading(false);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value); // Update content with the rich text
  };

  const handleIsPrivateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  return (
    <div className="flex justify-center items-center py-5 px-4 md:px-8">
      <div className="dark:bg-[#343434] bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">Update Story</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="Title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 p-2 border rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white"
              placeholder="Enter the story's title"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Description
            </label>
            <QuillToolbar />
            <ReactQuill
              value={description}
              style={{ height: '200px', overflowY: 'auto' }}
              onChange={handleDescriptionChange}
              className="bg-white dark:bg-gray-800 border"
              placeholder="Enter the chapter's content"
              modules={modules}  // Pass custom modules that include the toolbar
              formats={formats}
            />
          </div>
          <div className="flex mb-4">
            <label
              htmlFor="isPrivate"
              className="mr-2 p-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Private Story ?
            </label>
            <input
              id="isPrivate"
              name="isPrivate"
              type="checkbox"
              checked={isPrivate}
              onChange={handleIsPrivateChange}
            />
          </div>
          <Button type="submit" loading={isLoading}>
            Update Story
          </Button>
        </form>
        <div className="py-5">
              <button
                onClick={() => navigate(-1)}
                className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 justify-center focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 inline-flex items-center w-full"
              >
                Back
              </button>
            </div>
      </div>
    </div>
  );
}
