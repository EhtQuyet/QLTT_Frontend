import { put, takeLatest } from 'redux-saga/effects';

import { getAllDKTT } from '@app/services/ThucTap/DKThucTap/dangkythuctapService';

export const actionTypes = {
  GetDkThucTap: 'DkThucTap/GetDkThucTap',
  SetDkThucTap: 'DkThucTap/SetDkThucTap',
};

const initialAuthState = {
  dkthuctapList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetDkThucTap: {
      dataUpdate.dkthuctapList = action.payload.dkthuctapList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getDkThucTap: () => ({ type: actionTypes.GetDkThucTap }),
  setDkThucTap: dkthuctapList => ({ type: actionTypes.SetDkThucTap, payload: { dkthuctapList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetDkThucTap, function* getCalUnitSaga(data) {
    const dataResponse = yield getAllDKTT();
    console.log(dataResponse);
    if (dataResponse) {
      const dkthuctapList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        teacher: doc.giao_vien_huong_dan,
        teacherId: doc.giao_vien_huong_dan._id,
        dot_thuctap: doc.dot_thuc_tap,
        dot_thuctapId: doc.dot_thuc_tap._id,
        svID: doc.sinh_vien._id,
        sinhvien: doc.sinh_vien,
        so_tctl: doc.so_tctl,
        diem_tbtl: doc.diem_tbtl,
        diadiem: doc.dia_diem_thuc_tap,
        diadiem_id: doc.dia_diem_thuc_tap._id
      }));
      yield put(actions.setDkThucTap(dkthuctapList));
    }
  });
}
