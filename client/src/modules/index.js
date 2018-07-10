import { combineReducers } from 'redux'
import counter from './counter'
import { apolloReducer } from 'apollo-cache-redux';

export default combineReducers({
  counter,
  apollo: apolloReducer
})
