import Cookies from 'js-cookie';
import { API } from '@api';
import * as app from '@app/store/ducks/app.duck';
import { checkToken, toast } from '@app/common/functionCommons';
import { CONSTANTS, TOAST_MESSAGE } from '@constants';

export function removeCSSClass(ele, cls) {
  const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
  ele.className = ele.className.replace(reg, ' ');
}

export const toAbsoluteUrl = pathname => process.env.PUBLIC_URL + pathname;

export function setupAxios(axios, store) {
  const { dispatch } = store;
  let countApiRequest = 0;
  let countApiResponse = 0;

  axios.interceptors.request.use(
    config => {
      countApiRequest++;

      let showLoading = true;
      if (config.hasOwnProperty('loading')) {
        showLoading = config.loading;
        delete config.loading;
      }

      const { app: { isLoading } } = store.getState();
      const authToken = Cookies.get('token');
      if (!authToken) {
        return config;
        throw new axios.Cancel(CONSTANTS.CANCEL);
      }
      if (checkToken(authToken) && config.url !== API.LOGIN) {
        const jsToastTimeOut = document.getElementById('toastTimeOut');
        if (!jsToastTimeOut) {
          toast(CONSTANTS.WARNING, 'Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại');
        }
        dispatch(app.actions.clearToken());
        throw new axios.Cancel(CONSTANTS.CANCEL);
      }

      config.headers.Authorization = `Bearer ${authToken}`;
      if (!isLoading && showLoading) {
        dispatch(app.actions.toggleLoading(true));
      }

      return config;
    },
    err => Promise.reject(err),
  );

  try {
    axios.interceptors.response.use(res => {
      countApiResponse++;
      if (countApiRequest === countApiResponse) {
        dispatch(app.actions.toggleLoading(false));
      }

      if (res.data.success === false) {
        toast(CONSTANTS.ERROR, TOAST_MESSAGE.ERROR.DEFAULT, res.data.message);
        res.data = null;
      }
      return res;
    }, error => {
      countApiResponse++;
      if (countApiRequest === countApiResponse) {
        dispatch(app.actions.toggleLoading(false));
      }
      if (error?.response?.status === 401) {
        dispatch(app.actions.clearToken());
        return Promise.reject(error);
      }
      return Promise.reject(error);
    });
  } catch (error) {
    countApiResponse++;
    if (countApiRequest === countApiResponse) {
      dispatch(app.actions.toggleLoading(false));
    }
  }


}

/*  removeStorage: removes a key from localStorage and its sibling expiracy key
    params:
        key <string>     : localStorage key to remove
    returns:
        <boolean> : telling if operation succeeded
 */
export function removeStorage(key) {
  try {
    localStorage.setItem(key, '');
    localStorage.setItem(key + '_expiresIn', '');
  } catch (e) {
    console.log(
      'removeStorage: Error removing key [' +
      key +
      '] from localStorage: ' +
      JSON.stringify(e),
    );
    return false;
  }
  return true;
}

/*  getStorage: retrieves a key from localStorage previously set with setStorage().
    params:
        key <string> : localStorage key
    returns:
        <string> : value of localStorage key
        null : in case of expired key or failure
 */
export function getStorage(key) {
  const now = Date.now(); //epoch time, lets deal only with integer
  // set expiration for storage
  let expiresIn = localStorage.getItem(key + '_expiresIn');
  if (expiresIn === undefined || expiresIn === null) {
    expiresIn = 0;
  }

  expiresIn = Math.abs(expiresIn);
  if (expiresIn < now) {
    // Expired
    removeStorage(key);
    return null;
  } else {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.log(
        'getStorage: Error reading key [' +
        key +
        '] from localStorage: ' +
        JSON.stringify(e),
      );
      return null;
    }
  }
}

/*  setStorage: writes a key into localStorage setting a expire time
    params:
        key <string>     : localStorage key
        value <string>   : localStorage value
        expires <number> : number of seconds from now to expire the key
    returns:
        <boolean> : telling if operation succeeded
 */
export function setStorage(key, value, expires) {
  ``;
  if (expires === undefined || expires === null) {
    expires = 24 * 60 * 60; // default: seconds for 1 day
  }

  const now = Date.now(); //millisecs since epoch time, lets deal only with integer
  const schedule = now + expires * 1000;

  try {
    localStorage.setItem(key, value);
    localStorage.setItem(key + '_expiresIn', schedule);
  } catch (e) {
    console.log(
      'setStorage: Error setting key [' +
      key +
      '] in localStorage: ' +
      JSON.stringify(e),
    );
    return false;
  }
  return true;
}
