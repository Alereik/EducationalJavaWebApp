import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
    name: 'error',
    initialState: {
        displayError: false,
        message: null
    },
    reducers: {
        setError: (state, action) => {
            state.displayError = true;
            state.message = action.payload;
        },
        clearError: (state) => {
            state.displayError = false;
            state.message = null;
        },
    },
});
export default slice.reducer

const { setError, clearError } = slice.actions
export const showError = (message) => dispatch => {
    dispatch(setError(message))
}
export const hideError = () => dispatch => {
    dispatch(clearError())
}