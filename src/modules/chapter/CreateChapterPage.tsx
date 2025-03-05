import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/common";
import { useCreateChapterMutation } from "../../redux/api/chapterApi";
import { useGetSpecificStoryQuery } from "../../redux/api/storyApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import {QuillToolbar, modules, formats } from "../../utils/quill";

export function CreateChapterPage() {
  const [title, setTitle] = useState(" ");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(1);
  const {storyId} = useParams()
  const [isLoading, setIsLoading] = useState(false);
  const [createChapter] = useCreateChapterMutation();
  const {data} = useGetSpecificStoryQuery(storyId? storyId : "undefined")
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      title: title,
      content: content,
      storyId: storyId? storyId : "undefined",
      order: order
    };
    await createChapter({ ...data }).then((res) => {
      if (res) {
        if ("data" in res) {
          toast.success("Create chapter success!");
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

  const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrder(Number(event.target.value));
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  useEffect(() => {
    if(data){
      setOrder(data.chapters.length > 0? data.chapters[data.chapters.length-1].order + 1 : 1)
    }
  }, [data])

  if (data && storyId){
    return (
      <div className="flex justify-center items-center w-full py-5 px-4 md:px-8">
        <div className="dark:bg-[#343434] bg-white p-8 rounded-lg shadow-md w-full">
          <h2 className="text-3xl font-bold mb-4">Create New Chapter</h2>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
              <label
                htmlFor="ChapterNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Chapter Number
              </label>
              <label
                htmlFor="ChapterNumber"
                className="block text-sm font-medium text-red-700 dark:text-red-200"
              >
                Latest Chapter Number: {data.chapters.length > 0? data.chapters[data.chapters.length-1].order : "No chapter yet."}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 p-2 border rounded-md w-full bg-white dark:bg-gray-800 text-black dark:text-white"
                placeholder="Enter the chapter's order"
                value={order}
                onChange={handleOrderChange}
                required
              />
            </div>
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
                placeholder="Enter the chapter's title"
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Content
              </label>
                <QuillToolbar />
                  <ReactQuill
                    value={content}
                    style={{ height: '200px', overflowY: 'auto' }}
                    onChange={handleContentChange}
                    className="bg-white dark:bg-gray-800 border"
                    placeholder="Enter the chapter's content"
                    modules={modules}
                    formats={formats}
                  />
            </div>
            <Button type="submit" loading={isLoading}>
              Create Chapter
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

  return (
    <div className="flex justify-center items-center py-5 px-4 md:px-8">
      <div className="dark:bg-[#343434] bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">Create New Chapter</h2>
        <div className="flex flex-wrap gap-3 w-full py-5 px-4">
            <div className="w-full">
              <p> Loading ... </p>
            </div>
          </div>
      </div>
    </div>
  );
}
