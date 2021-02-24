import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { isEqual, isObject, transform } from 'lodash';
import * as toastify from 'react-toastify';

import { CONSTANTS, TOAST_MESSAGE } from '@constants';
import { notification } from 'antd';
import React from 'react';

export function convertParam(queryObj, firstCharacter = '?') {
  if (typeof queryObj !== 'object') return '';
  let query = '';
  const sortable = Object.fromEntries(
    Object.entries(queryObj).sort(([, a], [, b]) => a - b),
  );
  Object.entries(sortable).forEach(([key, value]) => {
    if (value) {
      query += query ? '&' : firstCharacter || '';
      if (!key.includes(CONSTANTS.HIDDEN)) {
        query += `${key}=${value}`;
      } else {
        query += value;
      }
    }
  });
  return query;
}

export function convertFileName(str) {
  if (!str) return '';

  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
  str = str.replace(/[ìíịỉĩ]/g, 'i');
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
  str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
  str = str.replace(/[ỳýỵỷỹ]/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A');
  str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E');
  str = str.replace(/[ÌÍỊỈĨ]/g, 'I');
  str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O');
  str = str.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U');
  str = str.replace(/[ỲÝỴỶỸ]/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/\s+/g, ' ');
  str.trim();
  return str;
}


export function formatDateDMY(dateInput, characters = '/') {
  if (!dateInput) return '';
  dateInput = new Date(dateInput);
  const fullYear = dateInput.getFullYear();
  return `${('0' + dateInput.getDate()).slice(-2)}` + characters
    + `${('0' + (dateInput.getMonth() + 1)).slice(-2)}` + characters
    + `${('000' + fullYear).slice((fullYear.toString().length > 3) ? (fullYear.toString().length * (-1)) : -4)}`;
}

export function formatDateYMD(dateInput, characters = '/') {
  if (!dateInput) return '';
  dateInput = new Date(dateInput);
  const fullYear = dateInput.getFullYear();
  return `${('000' + fullYear).slice((fullYear.toString().length > 3) ? (fullYear.toString().length * (-1)) : -4)}` + characters
    + `${('0' + (dateInput.getMonth() + 1)).slice(-2)}` + characters
    + `${('0' + dateInput.getDate()).slice(-2)}`;
}

export function formatTime(dateInput) {
  if (!dateInput) return '';
  dateInput = new Date(dateInput);

  return `${('0' + dateInput.getHours()).slice(-2)}:${('0' + dateInput.getMinutes()).slice(-2)}:${('0' + dateInput.getSeconds()).slice(-2)}`;
}

export function findMax(data) {
  if (!Array.isArray(data) || !data.length) return null;
  let max = typeof data[0] === 'number'
    ? data[0]
    : Array.isArray(data[0]) && data[0][0] ? data[0][0] : 0;
  data.forEach(item => {
    if (typeof item === 'number') {
      max = max < item ? item : max;
    }
    if (Array.isArray(item)) {
      item.forEach(itemChild => {
        max = max < itemChild ? itemChild : max;
      });
    }
  });
  return max;
}

export function setCookieToken(authToken) {
  const tokenDecode = jwtDecode(authToken);
  if (tokenDecode.exp) {
    Cookies.set('token', authToken, { expires: new Date(new Date(tokenDecode.exp * 1000)) });
  }
}

export function removeCookieToken() {
  Cookies.remove('token');
}

export function checkToken(authToken) {
  const exp = jwtDecode(authToken).exp * 1000;
  const now = (new Date()).getTime();
  return now > exp;
}

export function hexToRgb(hex) {
  if (!hex) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return result ? `rgb(${r}, ${g}, ${b})` : null;
}

export function getMessageError(err, method) {
  if (err && err.message === CONSTANTS.CANCEL) return null;
  return (err && err.response && err.response.data && err.response.data.message)
    ? err.response.data.message
    : TOAST_MESSAGE.ERROR[method];
}

export function renderMessageError(err, method) {
  if (err && err.message === CONSTANTS.CANCEL) return null;
  const errorMethod = method || err?.response?.config?.method || CONSTANTS.DEFAULT;
  const messageString = err?.response?.data?.message || TOAST_MESSAGE.ERROR[errorMethod];
  // message.destroy(messageString);
  // message.error({ content: messageString, key: messageString });
  toast(CONSTANTS.ERROR, messageString, TOAST_MESSAGE.ERROR.DESCRIPTION);
}

//
export function toast(type, label = '', message = '') {
  if (!type) return;
  if (type === CONSTANTS.DESTROY) {
    notification.destroy();
  } else {
    const toastifyOptions = {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    };

    const toastMessage = <>
      {TOAST_MESSAGE.ICON[type]}
      <div
        className='float-left d-flex'
        style={{
          width: '246px',
          paddingLeft: '10px',
          minHeight: '24px',
        }}>
        <label className='my-auto'>{label}</label>
      </div>
    </>;
    toastify.toast[type.toLowerCase()](toastMessage, toastifyOptions);
  }
}

export function columnIndex(pageSize, currentPage) {
  return {
    title: 'STT',
    align: 'center',
    render: (value, row, index) => (index + 1) + (pageSize * (currentPage - 1)),
    width: 50,
  };
}

export function difference(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
    }
  });
}
