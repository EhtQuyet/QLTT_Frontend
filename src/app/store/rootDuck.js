import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import * as app from './ducks/app.duck';
import * as user from './ducks/user.duck';


export const rootReducer = combineReducers({
  app: app.reducer,
  user: user.reducer,

});

export function* rootSaga() {
  yield all([
    app.saga(),
    user.saga(),
  ]);
}
