import { put, takeLatest } from 'redux-saga/effects';

import { getAllTuKhoa } from '@app/services/TuKhoa/tuKhoa.service';

export const actionTypes = {
  GetTuKhoa: 'TuKhoa/GetTuKhoa',
  SetTuKhoa: 'TuKhoa/SetTuKhoa',
};

const initialAuthState = {
  tukhoaList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetTuKhoa: {
      dataUpdate.tukhoaList = action.payload.tukhoaList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getTuKhoa: () => ({ type: actionTypes.GetTuKhoa }),
  setTuKhoa: tukhoaList => ({ type: actionTypes.SetTuKhoa, payload: { tukhoaList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetTuKhoa, function* getTuKhoaSaga(data) {
    const dataResponse = yield getAllTuKhoa();

    if (dataResponse) {
      const tukhoaList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        name: doc.tu_khoa,
      }));
      yield put(actions.setTuKhoa(tukhoaList));
    }
  });
}
