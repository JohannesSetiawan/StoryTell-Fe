import { useCreateCommentMutation, useDeleteCommentMutation } from "../../redux/api/commentApi";
import { AllCommentResponse, CommentWithAuthorName } from "../../redux/types/comment";
import { specificStoryResponse } from "../../redux/types/story";
import { useState } from "react";
import toast from "react-hot-toast";
import { RootState, useAppSelector } from "../../redux/store";

interface Story {
    story: specificStoryResponse
}

interface Comments {
    comment: CommentWithAuthorName
    allComments: AllCommentResponse
}

interface AddComment {
    parentId: string
    storyId: string
}

const Comment: React.FC<Comments> = ({ comment, allComments }) => {
    const replies = allComments.filter(reply => reply.parentId === comment.id);
    const [openCommentAdder, setOpenCommentAdder] = useState(false);
    const userId = useAppSelector((state: RootState) => state.user).user?.userId;
    const [deleteComment] = useDeleteCommentMutation()
    const storyId = comment.parentId
    
    const toggleAddComment = () => {
        setOpenCommentAdder(!openCommentAdder);
    };

    const handleDeleteComment = async () => {
        console.log(storyId, comment.id)
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
    }
  
    return (
      <div className="w-full flex flex-col justify-center bg-white-200 dark:bg-gray-600 p-4 rounded-lg mb-4">
        <p className="font-semibold">{comment.author.username}</p>
        <p>{comment.content}</p>
        <div className="flex flex-row items-center gap-4">
            <button
                className="rounded-lg flex flex-row bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-500 hover:dark:bg-gray-600 duration-200 transition-all ease-in-out px-4 py-2"
                onClick={toggleAddComment}
            > Reply </button>
            {
                comment.authorId === userId && (
                    <button
                        className="rounded-lg flex flex-row bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 hover:dark:bg-green-600 duration-200 transition-all ease-in-out px-4 py-2"
                        
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

    const topLevelComments = allComments.filter(comment => !comment.parentId);

    return (
        <div className="flex flex-wrap gap-3 w-full py-5 px-4">
        <div className="w-full h-60 overflow-y-auto">
            {topLevelComments.map(comment => (
            <Comment key={comment.id} comment={comment} allComments={allComments} />
            ))}
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
      console.log(newComment + " " + parentId)
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
    };
    
    return (
      <>
        <textarea onChange={handleChange} value={newComment} />
        <button onClick={handleSubmit}>Submit</button>
      </>
    );
};
  