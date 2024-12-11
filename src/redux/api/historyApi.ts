import { AllHistories, History } from "../types/history";
import { baseApi } from "./baseApi";

const HISTORY_API = import.meta.env.VITE_API_URL + "history";

export const historyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllHistories: builder.query<AllHistories, void>({
            query: () => ({
              url: HISTORY_API,
              method: "GET",
            }),
            providesTags: (result) => result ? result.map(({id}) => ({type: 'History', id: id})) : [{type: 'History'}],
        }),

        getHistoryForSpecificStory: builder.query<History, string>({
            query: (storyId) => ({
              url: HISTORY_API + `/${storyId}`,
              method: "GET",
            }),
            providesTags: (result) => [{ type: 'History', id: result?.id }],
        }),
    })
})

export const {
    useGetAllHistoriesQuery,
    useGetHistoryForSpecificStoryQuery
} = historyApi