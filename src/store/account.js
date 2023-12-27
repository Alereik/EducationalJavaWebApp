import { createSlice } from '@reduxjs/toolkit'
import { ACCOUNT_BASE_URL } from './baseUrls';
import axios from 'axios';
import { showError } from './error'
import { changeCurrPage } from './mazes';

const slice = createSlice({
    name: 'account',
    initialState: {
        username: null,
        isAdmin: null,
        accountId: null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.username = action.payload.username;
            state.isAdmin = action.payload.isAdmin;
            state.accountId = action.payload.accountId;
        },
        logoutSuccess: (state, action) => {
            state.username = null;
            state.isAdmin = null;
            state.accountId = null;
        },
    },
});
export default slice.reducer

// create the client to interact with the API
const client = axios.create({
    baseURL: ACCOUNT_BASE_URL,
    timeout: 10000
});

const { loginSuccess, logoutSuccess } = slice.actions
export const login = (username, password) => async dispatch => {
    client.post('/login', {
        username: username,
        password: password
    })
        .then((response) => {
            localStorage.setItem('token', response.data.token)
            dispatch(loginSuccess({
                username: username,
                accountId: response.data.id,
                isAdmin: response.data.isAdmin
            }));
        })
        .catch(() => {
            dispatch(showError("Username or password does not exist."))
        })
}
export const loginWithToken = (token) => async dispatch => {
    client.get(`/login?token=${token}`)
        .then((response) => {
            dispatch(loginSuccess({
                username: response.data.username,
                isAdmin: response.data.isAdmin,
                accountId: response.data.id
            }));
        })
        .catch((error) => {
            localStorage.removeItem('token')
        })
}
export const signup = (username, password, isAdmin) => async dispatch => {
    client.post('/signup', {
        username: username,
        password: password,
        isAdmin: isAdmin,
    })
        .then(() => {
            dispatch(login(username, password));
        })
        .catch((error) => {
            if (error.response.status === 409) {
                dispatch(showError("Username already taken."))
            } else if (error.response.status === 400) {
                dispatch(showError("Missing required fields."))
            } else {
                dispatch(showError("An unknown error occurred."))
            }
        })
}
export const logout = () => async dispatch => {
    const token = localStorage.getItem('token');
    client.get(`/logout?token=${token}`);
    dispatch(changeCurrPage(1));
    dispatch(logoutSuccess());
    localStorage.removeItem('token');
}
export const updateAccount = (accountId, username, password, isAdmin) => async dispatch => {
    const token = localStorage.getItem('token');
    client.put(`/updateAccount?token=${token}&accountId=${accountId}`, {
        username: username,
        password: password,
        isAdmin: isAdmin,
    })
        .then((response) => {
            dispatch(loginSuccess({
                username: username,
                accountId: response.id,
                isAdmin: response.isAdmin
            }));
        })
        .catch((error) => {
            console.log(error)
        })
}
export const deleteAccount = (accountId, thisAccountId) => async dispatch => {
    const token = localStorage.getItem('token');
    client.delete(`/deleteAccount?token=${token}&accountId=${accountId}`)
        .then(() => {
            if (thisAccountId === accountId) {
                dispatch(logoutSuccess());
            }
        })
        .catch((error) => {
            console.log(error)
        })
}