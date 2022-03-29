import { BaseResponseType } from '.';
import { ID } from '../misc';

export interface TimelineResponseType extends BaseResponseType {
    data?: ID[]
}
