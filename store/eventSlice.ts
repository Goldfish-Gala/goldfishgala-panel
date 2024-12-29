import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventRedux {
    event_reg_phase: string | null;
}
const initialState: EventRedux = {
    event_reg_phase: null,
};

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setEvent: (state, action: PayloadAction<{ event: any }>) => {
            state.event_reg_phase = action.payload.event;
        },
    },
});

export const { setEvent } = eventSlice.actions;

export default eventSlice.reducer;
