import { TimelineResponseType } from '../../types/api/timeline'
import { ID } from '../../types/misc'
import client from '../client'

// eslint-disable-next-line import/prefer-default-export
export const getTimeline = async (): Promise<TimelineResponseType> => {
    const response = await client.post('/timeline/generatetimeline').catch(() => ({ status: 404, data: { success: false, error: 404 } }))
    if (response.status === 401) {
        return { success: false, error: 401 }
    }
    return response.data as TimelineResponseType
}
