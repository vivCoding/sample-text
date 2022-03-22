export interface BaseResponseType {
    success: boolean
    error?: number,
    errorMessage?: string,
}

export interface GeneralResponseType extends BaseResponseType {
    data?: any,
}

// unused SWR stuff, ignore
export interface FetcherResponseType {
    status: number,
    data?: any
}
