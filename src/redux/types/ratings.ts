export type RatingRequest = {
    rate: number
}

export type StoryRatingResponse = {
    _avg: {
        rate: number
    },
    _count: {
        rate: number
    },
    "_sum": {
        rate: number
    },
    "storyId": string
}

export type SpecificRatingResponse = {
    "id": string,
    "authorId": string,
    "storyId": string,
    "rate": number
}

export type SpecificUserRatingResponse = {
    "id"?: string,
    "authorId"?: string,
    "storyId"?: string,
    "rate"?: number,
    "message"?:string
}