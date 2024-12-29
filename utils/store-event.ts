import { getAllOngoingEvents } from '@/api/event-reg/api-event';
import { setEvent } from '@/store/eventSlice';
import { Dispatch } from 'redux';

export const fetchOngoingEventPhase = async (authCookie: string | undefined, dispatch: Dispatch) => {
    try {
        const ongoingEvent = await getAllOngoingEvents(authCookie);
        if (ongoingEvent.success) {
            dispatch(setEvent({ event: ongoingEvent.data.OnGoing[0].event_reg_phase_code }));
        }
    } catch (error: any) {
        console.error('Error fetching user profile:', error.message || error);
        return false;
    }
};
