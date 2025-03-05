import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common";
import { useCreateStoryMutation } from "../../redux/api/storyApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import {QuillToolbar, modules, formats } from "../../utils/quill";

export function CreateStoryPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [CreateStory] = useCreateStoryMutation();

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      title: title,
      description: description,
      isprivate: isPrivate,
    };
    await CreateStory({ ...data }).then((res) => {
      if (res) {
        if ("data" in res) {
          toast.success("Create story success!");
          navigate("/your-story");
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
    <div className="flex justify-center items-center">
      <div className="dark:bg-[#343434] bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">Create New Story</h2>
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
              className="mt-1 p-2 border rounded-md w-full"
              placeholder="Enter the story's title"
              value={title}
              onChange={handleTitleChange}
              required
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
            Create Story
          </Button>
        </form>
      </div>
    </div>
  );
}
