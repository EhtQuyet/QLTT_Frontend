import { put, takeLatest } from 'redux-saga/effects';

import { getAllBoMon } from '@app/services/BoMon/boMonService';

export const actionTypes = {
  GetBoMon: 'BoMon/GetBoMon',
  SetBoMon: 'BoMon/SetBoMon',
};

const initialAuthState = {
  bomonList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetBoMon: {
      dataUpdate.bomonList = action.payload.bomonList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getBoMon: () => ({ type: actionTypes.GetBoMon }),
  setBoMon: bomonList => ({ type: actionTypes.SetBoMon, payload: { bomonList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetBoMon, function* getCalUnitSaga(data) {
    const dataResponse = yield getAllBoMon();

    if (dataResponse) {
      const bomonList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        name: doc.ten_bo_mon,
      }));
      yield put(actions.setBoMon(bomonList));
    }
  });
}
