import { put, takeLatest } from 'redux-saga/effects';
import Cookies from 'js-cookie';
import moment from 'moment';

import { login } from '@app/services/User/UserService';
import { TOKEN_EXP_TIME } from '@constants';

export const actionTypes = {
  ToggleLoading: 'App/ToggleLoading',
  ToggleSider: 'App/ToggleSider',
  ToggleBroken: 'App/ToggleBroken',
  Login: 'App/Login',
  SetToken: 'App/SetToken',
  GetToken: 'App/GetToken',
  ClearToken: 'App/ClearToken',
};

const initialAuthState = {
  siderCollapsed: false,
  isBroken: false,
  token: null,
};
export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.ToggleLoading: {
      const { isLoading } = action.payload;
      return Object.assign({}, state, { isLoading });
    }
    case actionTypes.ToggleSider: {
      const { siderCollapsed } = action.payload;
      return Object.assign({}, state, { siderCollapsed });
    }
    case actionTypes.ClearToken: {
      Cookies.remove('token');
      return Object.assign({}, state, { token: null });
    }
    case actionTypes.SetToken: {
      const { token } = action.payload;
      Cookies.set('token', token);
      return Object.assign({}, state, { token });
    }
    case actionTypes.GetToken: {
      const token = Cookies.get('token');
      return Object.assign({}, state, { token });
    }
    default:
      return state;
  }
};

export const actions = {
  toggleLoading: (isLoading) => ({ type: actionTypes.ToggleLoading, payload: { isLoading } }),
  toggleSider: (siderCollapsed) => ({ type: actionTypes.ToggleSider, payload: { siderCollapsed } }),
  login: data => ({ type: actionTypes.Login, payload: { data } }),
  getToken: token => ({ type: actionTypes.GetToken, payload: { token } }),
  setToken: token => ({ type: actionTypes.SetToken, payload: { token } }),
  clearToken: () => ({ type: actionTypes.ClearToken, payload: { token: null } }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga(data) {
    const dataResponse = yield login(data?.payload?.data);
    if (dataResponse) {
      yield put(actions.setToken(dataResponse));
    }
  });
}
