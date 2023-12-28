import { createSlice } from '@reduxjs/toolkit'
import { MAZE_ATTEMPT_BASE_URL } from './baseUrls';
import axios from 'axios';
import { format } from 'date-fns';
import { showSuccess } from './success'
import { showError } from './error'

const slice = createSlice({
    name: 'mazeAttempts',
    initialState: {
        bestAttempt: null,
        mostRecentAttempt: null,
        currentAnimatedAttempt: null,
        successMessage: null,
        failureMessage: null
    },
    reducers: {
        updateBestAttempt: (state, action) => {
            state.bestAttempt = action.payload;
        },
        updateMostRecentAttempt: (state, action) => {
            state.mostRecentAttempt = action.payload;
        },
        updateSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
            state.failureMessage = null;
        },
        updateFailureMessage: (state, action) => {
            state.failureMessage = action.payload;
            state.successMessage = null;
        },
        updateCurrentAnimatedAttempt: (state, action) => {
            state.currentAnimatedAttempt = action.payload;
        },
        emptyMazeAttempts: (state) => {
            state.bestAttempt = null;
            state.mostRecentAttempt = null;
            state.successMessage = null;
            state.failureMessage = null;
            state.currentAnimatedAttempt = null;
        },
    },
});
export default slice.reducer

// create the client to interact with the API
const client = axios.create({
    baseURL: MAZE_ATTEMPT_BASE_URL,
    timeout: 10000000
});

/**
 * This method formats the date from the backend to one easily readable by the
 * user.
 * 
 * @param {*} dateFromBackend - the date string returned from the database
 * @returns - a string representing the date as 'MMMM DD, YYYY'
 */
const getFormattedAttemptDate = (dateFromBackend) => {
    const attemptDate = new Date(dateFromBackend)
    attemptDate.setDate(attemptDate.getDate() + 1)
    return format(attemptDate, 'MMMM do, yyyy')
}

const { updateBestAttempt,
    emptyMazeAttempts,
    updateMostRecentAttempt,
    updateSuccessMessage,
    updateFailureMessage,
    updateCurrentAnimatedAttempt } = slice.actions
export const getBestAttempt = (mazeId) => async dispatch => {
    const token = localStorage.getItem('token');
    client.get(`/best?` +
        `userToken=${token}&` +
        `mazeId=${mazeId}&`)
        .then((response) => {
            dispatch(updateBestAttempt(response.data))
        })
        .catch(error => {
            console.log(error)
        })
}
export const getMostRecentAttempt = (mazeId) => async dispatch => {
    const token = localStorage.getItem('token');
    client.get(`/mostRecent?` +
        `userToken=${token}&` +
        `mazeId=${mazeId}&`)
        .then((response) => {
            dispatch(updateMostRecentAttempt(response.data))
        })
        .catch(error => {
            console.log(error)
        })
}
export const createMazeAttempt = (userCode, mazeId) => async dispatch => {
    const token = localStorage.getItem('token');
    client.post(`/attemptMaze?` +
        `token=${token}&` +
        `mazeId=${mazeId}&`,
        { userCode })
        .then((response) => {
            dispatch(setCurrentAnimatedAttempt(response.data))
            dispatch(getBestAttempt(mazeId))
            dispatch(getMostRecentAttempt(mazeId))
            dispatch(showSuccess("Code saved and compiled!"))
        })
        .catch(error => {
            dispatch(showError("Code failed to save."))
        })
}
export const testMazeAttempt = (userCode, mazeId) => async dispatch => {
    const token = localStorage.getItem('token');
    client.post(`/testAttempt?` +
        `token=${token}&` +
        `mazeId=${mazeId}&`,
        { userCode })
        .then((response) => {
            dispatch(setCurrentAnimatedAttempt(response.data))
            dispatch(showSuccess("Code compiled!"))
        })
        .catch(error => {
            dispatch(showError("Code failed to compile."))
        })
}
export const setSuccessMessage = (numMoves, date, test) => dispatch => {
    dispatch(updateSuccessMessage(
        [`Hooray, this code works! I reached my exit grid in ` +
            `${numMoves} move` +
            (numMoves === 1 ? '' : 's') +
            `! This code was submitted on ${getFormattedAttemptDate(date)}.` +
            (test ? ' This was only a compilation, so be sure to hit save!' :
                ' To test your code\'s strength, try using it on other mazes!')]
    ))
}
export const setFailMessage = (numMoves, date) => dispatch => {
    dispatch(updateFailureMessage(
        [`Ope! It looks like this method doesn't quite work. Your code helped me move ` +
            `${numMoves} time` +
            (numMoves === 1 ? '' : 's') +
            ` before failing! The attempt was saved on ` +
            `${getFormattedAttemptDate(date)}. Try again and remember to hover over me to see my ` +
            `available methods!`]
    ));
}
export const setCurrentAnimatedAttempt = (attempt) => dispatch => {
    dispatch(updateCurrentAnimatedAttempt(attempt))
}
export const clearMazeAttempts = () => dispatch => {
    dispatch(emptyMazeAttempts());
}