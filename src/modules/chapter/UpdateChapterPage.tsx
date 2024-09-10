import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/common";
import { useUpdateChapterMutation, useGetSpecificChapterQuery } from "../../redux/api/chapterApi";
// import ReactMarkdown from 'react-markdown';

export function UpdateChapterPage() {
  const {chapterId} = useParams()
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [updateChapter] = useUpdateChapterMutation();
  const {data: chapter} = useGetSpecificChapterQuery(chapterId?chapterId:"undefined")

  const navigate = useNavigate();

  useEffect(()=>{
    setContent(chapter?.content ? chapter.content : "")
    setTitle(chapter?.title ? chapter.title : "")
    setOrder(chapter?.order ? chapter.order : 1)
  }, [chapter])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      title: title,
      content: content,
      order: order,
      storyId : chapter?.storyId ? chapter.storyId : "undefined"
    };
    await updateChapter({ updateData: data, chapterId: chapterId? chapterId : "undefined"}).then((res) => {
      if (res) {
        if ("data" in res) {
          toast.success("Update chapter success!");
          navigate(`/read-chapter/${chapterId}`);
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

  if(chapter){
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="dark:bg-[#343434] bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4">Update Chapter</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label
                    htmlFor="ChapterNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                    Chapter Number
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
                    required
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
                {/* <div className="max-w-3/4">
                  <div className="flex mb-4">
                  <label
                    htmlFor="isPrivate"
                    className="mr-2 p-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Preview Content
                  </label>
                  </div>
                  <div className="flex mb-4 border p-4 overflow-auto max-h-60">
                    <div className="mb-4 whitespace-pre-line">
                            <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  </div>
                </div> */}
                
                <Button type="submit" loading={isLoading}>
                Update Chapter
                </Button>
                
            </form>
            </div>
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
  
}