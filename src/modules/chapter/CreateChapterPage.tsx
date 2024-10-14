import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/common";
import { useCreateChapterMutation } from "../../redux/api/chapterApi";
import { useGetSpecificStoryQuery } from "../../redux/api/storyApi";
// import ReactMarkdown from 'react-markdown';

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

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  if (data && storyId){
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="dark:bg-[#343434] bg-white p-8 rounded-lg shadow-md">
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
                Latest Chapter Number: {data.chapters[data.chapters.length-1].order}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 p-2 border rounded-md w-full"
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
                className="mt-1 p-2 border rounded-md w-full"
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
              <textarea
                id="content"
                name="content"
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="Enter the chapter's content"
                value={content}
                onChange={handleContentChange}
                required
              />
            </div>
            {/* <div className="flex mb-4">
            <label
              htmlFor="isPrivate"
              className="mr-2 p-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Preview Content
            </label>
            </div>
            <div className="flex mb-4 border p-4">
              <div className="text-lg mb-6 whitespace-pre-line">
                      <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div> */}
            <Button type="submit" loading={isLoading}>
              Create Chapter
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
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
