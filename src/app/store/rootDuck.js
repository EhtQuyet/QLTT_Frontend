import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import * as app from './ducks/app.duck';
import * as user from './ducks/user.duck';
import * as bomon from './ducks/bomon.duck';
import * as lophoc from './ducks/lophoc.duck';
import * as giaovien from './ducks/giaovien.duck';
import * as detai from './ducks/detai.reduck';
import * as namhoc from './ducks/namhoc.duck';
import * as sinhvien from './ducks/sinhvien.duck';
import * as diadiem  from './ducks/diadiem.duck';
import * as dotthuctap from './ducks/dotthuctap.duck'
import * as dkthuctap from './ducks/dkthuctap.duck'


export const rootReducer = combineReducers({
  app: app.reducer,
  user: user.reducer,
  bomon: bomon.reducer,
  lophoc: lophoc.reducer,
  giaovien: giaovien.reducer,
  detai: detai.reducer,
  namhoc: namhoc.reducer,
  sinhvien: sinhvien.reducer,
  diadiem : diadiem.reducer,
  dotthuctap: dotthuctap.reducer,
  dkthuctap: dkthuctap.reducer

});

export function* rootSaga() {
  yield all([
    app.saga(),
    user.saga(),
    bomon.saga(),
    lophoc.saga(),
    giaovien.saga(),
    detai.saga(),
    namhoc.saga(),
    sinhvien.saga(),
    diadiem.saga(),
    dotthuctap.saga(),
    dkthuctap.saga(),
  ]);
}
