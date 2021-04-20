import { put, takeLatest } from 'redux-saga/effects';

import { getAllDotThucTap } from '@app/services/ThucTap/DotThucTap/dotthuctapService';

export const actionTypes = {
  GetDotThucTap: 'DotThucTap/GetDotThucTap',
  SetDotThucTap: 'DotThucTap/SetDotThucTap',
};

const initialAuthState = {
  dotthuctapList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetDotThucTap: {
      dataUpdate.dotthuctapList = action.payload.dotthuctapList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getDotThucTap: () => ({ type: actionTypes.GetDotThucTap }),
  setDotThucTap: dotthuctapList => ({ type: actionTypes.SetDotThucTap, payload: { dotthuctapList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetDotThucTap, function* getCalUnitSaga(data) {
    const dataResponse = yield getAllDotThucTap();

    if (dataResponse) {
      const dotthuctapList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        name: doc.ten_dot,
        namhoc: doc.namhoc,
        trang_thai: doc.trang_thai
      }));
      yield put(actions.setDotThucTap(dotthuctapList));
    }
  });
}
