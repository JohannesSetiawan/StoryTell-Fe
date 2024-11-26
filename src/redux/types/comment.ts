export type CommentRequest = {
    content: string
    parentId?: string
}

export type CommentResponse = {
    id: string
    authorId: string
    storyId: string
    chapterId: string
    dateCreated: string
    content: string
    parentId: string
}

export type CommentWithAuthorName = CommentResponse & {author: {
    username: string
}}
export type AllCommentResponse = CommentWithAuthorName[]