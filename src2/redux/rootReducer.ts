import { combineReducers } from 'redux'
import persistedReducer from './persisted/reducer'
import consentsReducer from './consents/reducer'
const rootReducer = combineReducers({
  persisted: persistedReducer,
  consents: consentsReducer,
})

export default rootReducer
