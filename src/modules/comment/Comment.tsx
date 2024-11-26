import { useCreateChapterCommentMutation, useCreateCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation } from "../../redux/api/commentApi";
import { AllCommentResponse, CommentWithAuthorName } from "../../redux/types/comment";
import { Chapter, specificStoryResponse } from "../../redux/types/story";
import { useState } from "react";
import toast from "react-hot-toast";
import { RootState, useAppSelector } from "../../redux/store";
import { dateToString } from "./commentUtils";
import { Spacer } from "../../components/common/Spacer";

interface Story {
    story: specificStoryResponse
}

interface ChapterComment {
  chapter: Chapter
}

interface Comments {
    comment: CommentWithAuthorName
    allComments: AllCommentResponse
}

interface AddComment {
    parentId?: string
    storyId: string
}

interface AddChapterComment {
  parentId?: string
  storyId: string
  chapterId: string
}

interface UpdateComment {
  content: string
  commentId: string
  storyId: string
  parentId: string
}

const Comment: React.FC<Comments> = ({ comment, allComments }) => {
    const replies = allComments.filter(reply => reply.parentId === comment.id);
    const [openCommentAdder, setOpenCommentAdder] = useState(false);
    const [openCommentUpdater, setOpenCommentUpdater] = useState(false);
    const userId = useAppSelector((state: RootState) => state.user).user?.userId;
    const [deleteComment] = useDeleteCommentMutation()
    const storyId = comment.storyId
    
    const handleAddComment = () => {
        setOpenCommentAdder(!openCommentAdder);
        setOpenCommentUpdater(false)
    };

    const handleUpdateComment = () => {
      setOpenCommentUpdater(!openCommentUpdater)
      setOpenCommentAdder(false)
    }

    const handleDeleteComment = async () => {
        console.log(storyId + " id komen:" + comment.id)
        await deleteComment({storyId, commentId: comment.id}).then((res) => {
            if (res) {
              if ("data" in res) {
                toast.success("Delete comment success!");
              } else if ("data" in res.error) {
                const errorData = res.error.data as { message: string };
                toast.error(errorData.message);
              } else {
                toast.error("Unknown error!");
              }
            }
        })
        window.location.reload();
    }
  
    return (
      <div className="w-full flex flex-col justify-center bg-white-200 dark:bg-gray-600 p-4 rounded-lg mb-4">
        <p className="font-semibold">{comment.author.username}</p>
        <p>{dateToString(comment.dateCreated)}</p>
        <Spacer height={10}/>
        <p>{comment.content}</p>
        <Spacer height={10}/>
        <div className="flex flex-row items-center gap-4">
            <button
                className="rounded-lg flex flex-row bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                onClick={handleAddComment}
            > Reply </button>
            {
                comment.authorId === userId && (
                    <button
                        className="rounded-lg flex flex-row bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 hover:dark:bg-green-600 duration-200 transition-all ease-in-out px-4 py-2"
                        onClick={handleUpdateComment}
                    > Update </button>
                )
            }
            {
                comment.authorId === userId && (
                    <button
                        className="rounded-lg flex flex-row bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 hover:dark:bg-red-600 duration-200 transition-all ease-in-out px-4 py-2"
                        onClick={handleDeleteComment}
                    > Delete </button>
                )
            }  
        </div>
        
        {openCommentAdder && <AddComment parentId={comment.id} storyId={comment.storyId}/>}

        {openCommentUpdater && <UpdateComment 
                                commentId={comment.id} 
                                storyId={comment.storyId}
                                content={comment.content}
                                parentId={comment.parentId} />}

        {replies.length > 0 && (
          <div className="ml-6 mt-2">
            {replies.map(reply => (
              <Comment key={reply.id} comment={reply} allComments={allComments} />
            ))}
          </div>
        )}
        
      </div>
    );
};
  
export const CommentsList: React.FC<Story> = ({ story }) => {
    const allComments = story.storyComments || [];
    const storyId = story.id

    const topLevelComments = allComments.filter(comment => !comment.parentId);

    return (
      <div>
        <div className="w-full flex flex-col justify-center bg-white-200 dark:bg-gray-600 p-4 rounded-lg">
          <AddComment parentId={undefined} storyId={storyId}/>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full py-5 px-4">
        <div className="w-full h-60 overflow-y-auto">
          
          {topLevelComments.map(comment => (
            <Comment key={comment.id} comment={comment} allComments={allComments} />
          ))}
        </div>
        </div>
      </div>
        
    );
};

export const ChapterCommentsList: React.FC<ChapterComment> = ({ chapter }) => {
  const allComments = chapter.chapterComments || [];
  const storyId = chapter.storyId
  const chapterId = chapter.id

  const topLevelComments = allComments.filter(comment => !comment.parentId);

  return (
    <div>
      <div className="w-full flex flex-col justify-center bg-white-200 dark:bg-gray-600 p-4 rounded-lg">
        <AddChapterComment parentId={undefined} storyId={storyId} chapterId={chapterId}/>
      </div>
      
      <div className="flex flex-wrap gap-3 w-full py-5 px-4">
      <div className="w-full h-60 overflow-y-auto">
        
        {topLevelComments.map(comment => (
          <Comment key={comment.id} comment={comment} allComments={allComments} />
        ))}
      </div>
      </div>
    </div>
      
  );
};

const AddComment: React.FC<AddComment> = (parent) => {
    const [ createCommment ] = useCreateCommentMutation()
    const [newComment, setNewComment] = useState("");
    const parentId = parent.parentId
    const storyId = parent.storyId
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      if (value) setNewComment(value);
    };
  
    const handleSubmit = async () => {
      const data = {content: newComment, parentId: parentId}
      setNewComment("");
      await createCommment({ data, storyId: storyId? storyId : "undefined"}).then((res) => {
        if (res) {
          if ("data" in res) {
            toast.success("Create comment success!");
          } else if ("data" in res.error) {
            const errorData = res.error.data as { message: string };
            toast.error(errorData.message);
          } else {
            toast.error("Unknown error!");
          }
        }
      });
      window.location.reload();
    };
    
    return (
      <>
        <textarea 
          className="border-2 border-black-400 dark:border-gray-500 p-4 rounded-lg" 
          placeholder="Enter your new comment"
          onChange={handleChange} value={newComment} />
        <button 
        onClick={handleSubmit}>Submit</button>
      </>
    );
};

const AddChapterComment: React.FC<AddChapterComment> = (parent) => {
  const [ createCommment ] = useCreateChapterCommentMutation()
  const [newComment, setNewComment] = useState("");
  const parentId = parent.parentId
  const storyId = parent.storyId
  const chapterId = parent.chapterId
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    if (value) setNewComment(value);
  };

  const handleSubmit = async () => {
    const data = {content: newComment, parentId: parentId}
    setNewComment("");
    await createCommment({ data, storyId: storyId? storyId : "undefined", chapterId: chapterId? chapterId : "undefined"}).then((res) => {
      if (res) {
        if ("data" in res) {
          toast.success("Create comment success!");
        } else if ("data" in res.error) {
          const errorData = res.error.data as { message: string };
          toast.error(errorData.message);
        } else {
          toast.error("Unknown error!");
        }
      }
    });
    window.location.reload();
  };
  
  return (
    <>
      <textarea 
        className="border-2 border-black-400 dark:border-gray-500 p-4 rounded-lg" 
        placeholder="Enter your new comment"
        onChange={handleChange} value={newComment} />
      <button 
      onClick={handleSubmit}>Submit</button>
    </>
  );
};

const UpdateComment: React.FC<UpdateComment> = (comment) => {
  const [ updateComment ] = useUpdateCommentMutation()
  const [newComment, setNewComment] = useState(comment.content);
  const commentId = comment.commentId
  const parentId = comment.parentId
  const storyId = comment.storyId
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    if (value) setNewComment(value);
  };

  const handleSubmit = async () => {
    const data = {content: newComment, parentId: parentId}
    
    await updateComment({ data, storyId: storyId? storyId : "undefined", commentId}).then((res) => {
      if (res) {
        if ("data" in res) {
          toast.success("Update comment success!");
        } else if ("data" in res.error) {
          const errorData = res.error.data as { message: string };
          toast.error(errorData.message);
        } else {
          toast.error("Unknown error!");
        }
      }
    });
    
    setNewComment("");
    window.location.reload();
  };
  
  return (
    <>
      <textarea 
        className="border-2 border-black-400 dark:border-gray-500 p-4 rounded-lg" 
        onChange={handleChange} value={newComment} />
      <button className="" onClick={handleSubmit}>Submit</button>
    </>
  );
};
  