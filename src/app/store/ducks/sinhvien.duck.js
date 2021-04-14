import { put, takeLatest } from 'redux-saga/effects';

import { getAllSinhVien } from '@app/services/SinhVienTTTN/sinhVienTTService';

export const actionTypes = {
  GetSinhVien: 'SinhVien/GetSinhVien',
  SetSinhVien: 'SinhVien/SetSinhVien',
};

const initialAuthState = {
  sinhVienList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetSinhVien: {
      dataUpdate.sinhVienList = action.payload.sinhVienList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getSinhVien: () => ({ type: actionTypes.GetSinhVien }),
  setSinhVien: sinhVienList => ({ type: actionTypes.SetSinhVien, payload: { sinhVienList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetSinhVien, function* getSinhVienSaga(data) {
    const dataResponse = yield getAllSinhVien();

    if (dataResponse) {
      const sinhVienList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        name: doc.ten_sinh_vien,
        classmate: doc.ma_lop_hoc,
        code: doc.ma_sinh_vien,
        namecode: doc.ten_sinh_vien + ' (MSSV: ' + doc.ma_sinh_vien + ')'
      }));
      yield put(actions.setSinhVien(sinhVienList));
    }
  });
}
