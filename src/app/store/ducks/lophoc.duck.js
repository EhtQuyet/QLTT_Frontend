import { put, takeLatest } from 'redux-saga/effects';

import { getAllLopHoc } from '@app/services/LopHoc/lopHocService';

export const actionTypes = {
  GetClass: 'LopHoc/GetClass',
  SetClass: 'LopHoc/SetClass',
};

const initialAuthState = {
  classmateList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetClass: {
      dataUpdate.classmateList = action.payload.classmateList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getClass: () => ({ type: actionTypes.GetClass }),
  setClass: classmateList => ({ type: actionTypes.SetClass, payload: { classmateList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetClass, function* getClassmateSaga(data) {
    const dataResponse = yield getAllLopHoc();

    if (dataResponse) {
      const classmateList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        name: doc.ten_lop_hoc,
      }));
      yield put(actions.setClass(classmateList));
    }
  });
}
