import { AllCommentResponse } from "./comment"

export type Story = {
    id: string,
    title: string,
    description: string,
    dateCreated: string,
    authorId: string,
    isprivate: boolean
}


export type Author = {
    username: string
}

export type StoryWithAuthorName = Story & {author: Author}
export type allStoriesResponse = StoryWithAuthorName[]

export type createStoryData = {
    title: string
    description: string
}

export type Chapter = {
    id: string,
    title: string,
    content: string,
    dateCreated: string,
    storyId: string,
    order: number,
    chapterComments: AllCommentResponse
}

export type Message = {
    message: string
}

export type specificStoryResponse = {
    id: string,
    title: string,
    description: string,
    dateCreated: string,
    authorId: string
    isprivate: boolean
    chapters: Chapter[]
    storyComments: AllCommentResponse
}