import { put, takeLatest } from 'redux-saga/effects';

import { getUserByToken, updateMyInfo } from '@app/services/User/UserService';
import { toast } from '@app/common/functionCommons';
import { CONSTANTS } from '@constants';

export const actionTypes = {
  RequestUser: 'User/RequestUser',
  UserLoaded: 'User/UserLoaded',
  UpdateMyInfo: 'User/UpdateMyInfo',
};

const initialAuthState = {
  myInfo: {},
};
export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.UserLoaded: {
      const { myInfo } = action.payload;
      return { ...state, myInfo };
    }
    default:
      return state;
  }
};

export const actions = {
  requestUser: () => ({ type: actionTypes.RequestUser }),
  userLoaded: myInfo => ({ type: actionTypes.UserLoaded, payload: { myInfo } }),
  updateMyInfo: myInfo => ({ type: actionTypes.UpdateMyInfo, payload: { myInfo } }),
};

export function* saga() {
  yield takeLatest(actionTypes.RequestUser, function* requestUserSaga() {
    const dataResponse = yield getUserByToken();
    const myInfo = dataResponse?.data;

    yield put(actions.userLoaded(myInfo));
  });
  yield takeLatest(actionTypes.UpdateMyInfo, function* updateMyInfoSaga(data) {
    const dataResponse = yield updateMyInfo(data?.payload?.myInfo);
    if (dataResponse) {
      yield put(actions.userLoaded(dataResponse));
      toast(CONSTANTS.SUCCESS, 'Cập nhật thông tin thành công');
    }
  });
}
