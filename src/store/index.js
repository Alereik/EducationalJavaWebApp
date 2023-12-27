import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import account from './account'
import mazes from './mazes'
import error from './error'
import success from './success'
import mazeAttempts from './mazeAttempts'
const reducer = combineReducers({
  account,
  mazes,
  error,
  success,
  mazeAttempts
})
const store = configureStore({
  reducer,
})
export default store;