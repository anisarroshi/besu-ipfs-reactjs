import { combineReducers } from 'redux'
import web3Reducer from './web3Reducer'
import petReducer from './petReducer'

export default combineReducers({
  web3: web3Reducer,
  pet: petReducer,
})
