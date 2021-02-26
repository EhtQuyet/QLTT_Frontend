import { put, takeLatest } from 'redux-saga/effects';

import { getAllDetai } from '@app/services/DeTaiTTTN/DeTaiService';

export const actionTypes = {
  GetDeTai: 'DeTai/GetDeTai',
  SetDeTai: 'DeTai/SetDeTai',
};

const initialAuthState = {
  detaiList: [],
};

export const reducer = (state = initialAuthState, action) => {
  const dataUpdate = {};
  switch (action.type) {
    case actionTypes.SetDeTai: {
      dataUpdate.detaiList = action.payload.detaiList;
      break;
    }
    default:
      break;
  }
  return Object.assign({}, state, dataUpdate);
};

export const actions = {
  getDeTai: () => ({ type: actionTypes.GetDeTai }),
  setDeTai: detaiList => ({ type: actionTypes.SetDeTai, payload: { detaiList } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetDeTai, function* getDeTaiSaga(data) {
    const dataResponse = yield getAllDetai();

    if (dataResponse) {
      const detaiList = dataResponse.docs.map(doc => ({
        _id: doc._id,
        name: doc.ten_de_tai,
      }));
      yield put(actions.setDeTai(detaiList));
    }
  });
}
