import { put, takeLatest } from 'redux-saga/effects';

import { getAllDiaDiemThucTap } from '@app/services/DiaDiemThucTap/diadiemthuctapService';

export const actionTypes = {
  GetDiaDiem: 'DiaDiem/GetDiaDiem',
  SetDiaDiem: 'DiaDiem/SetDiaDiem',
};

const initialAuthState = {
  diadiemList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetDiaDiem: {
      dataUpdate.diadiemList = action.payload.diadiemList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getDiaDiem: () => ({ type: actionTypes.GetDiaDiem }),
  setDiaDiem: diadiemList => ({ type: actionTypes.SetDiaDiem, payload: { diadiemList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetDiaDiem, function* getDeTaiSaga(data) {
    const dataResponse = yield getAllDiaDiemThucTap();

    if (dataResponse) {
      const diadiemList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        name: doc.ten_dia_diem,
      }));
      yield put(actions.setDiaDiem(diadiemList));
    }
  });
}
