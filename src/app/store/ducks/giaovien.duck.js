import { put, takeLatest } from 'redux-saga/effects';

import { getAllGiaoVien } from '@app/services/GiaoVienHD/giaoVienService';

export const actionTypes = {
  GetTeacher: 'GiaoVien/GetTeacher',
  SetTeacher: 'GiaoVien/SetTeacher',
};

const initialAuthState = {
  teacherList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetTeacher: {
      dataUpdate.teacherList = action.payload.teacherList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getTeacher: () => ({ type: actionTypes.GetTeacher }),
  setTeacher: teacherList => ({ type: actionTypes.SetTeacher, payload: { teacherList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetTeacher, function* getTeacherSaga(data) {
    const dataResponse = yield getAllGiaoVien();

    if (dataResponse) {
      const teacherList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        name: doc.ten_giao_vien,
      }));
      yield put(actions.setTeacher(teacherList));
    }
  });
}
