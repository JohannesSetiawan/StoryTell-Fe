export type History = {
    id: string,
    userId: string,
    storyId: string,
    chapterId: null,
    date: string,
    story: {
        title: string
    },
    chapter?: {
        title: string,
        order: number
    }
}

export type AllHistories = History[]