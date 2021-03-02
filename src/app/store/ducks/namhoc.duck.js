import { put, takeLatest } from 'redux-saga/effects';

import { getAllNamHoc } from '@app/services/NamHoc/namhocService';

export const actionTypes = {
  GetNamHoc: 'NamHoc/GetNamHoc',
  SetNamHoc: 'NamHoc/SetNamHoc',
};

const initialAuthState = {
  namhocList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetNamHoc: {
      dataUpdate.namhocList = action.payload.namhocList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getNamHoc: () => ({ type: actionTypes.GetNamHoc }),
  setNamHoc: namhocList => ({ type: actionTypes.SetNamHoc, payload: { namhocList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetNamHoc, function* getNamHocSaga(data) {
    const dataResponse = yield getAllNamHoc();

    if (dataResponse) {
      const namhocList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        name: doc.nam_hoc,
      }));
      yield put(actions.setNamHoc(namhocList));
    }
  });
}
