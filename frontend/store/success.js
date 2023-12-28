import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
    name: 'success',
    initialState: {
        displaySuccess: false,
        message: null
    },
    reducers: {
        setMessage: (state, action) => {
            state.displaySuccess = true;
            state.message = action.payload;
        },
        clearMessage: (state) => {
            state.displaySuccess = false;
            state.message = null;
        },
    },
});
export default slice.reducer

const { setMessage, clearMessage } = slice.actions
export const showSuccess = (message) => dispatch => {
    dispatch(setMessage(message))
}
export const hideSuccess = () => dispatch => {
    dispatch(clearMessage())
}