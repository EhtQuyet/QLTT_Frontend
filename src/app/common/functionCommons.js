import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import React from 'react';
import moment from 'moment';
import { isEqual, isObject, transform } from 'lodash';
import * as toastify from 'react-toastify';

import { CONSTANTS, TOAST_MESSAGE } from '@constants';

export function cloneObj(input) {
  return JSON.parse(JSON.stringify(input))
}

function renderQuery(queryInput, queryAdd, firstCharacter) {
  let queryOutput = queryInput ? '&' : firstCharacter;
  queryOutput += queryAdd;
  return queryOutput;
}

export function convertParam(queryObj, firstCharacter = '?') {
  if (typeof queryObj !== 'object') return '';
  let query = '';
  const sortable = Object.fromEntries(
    Object.entries(queryObj).sort(([, a], [, b]) => a - b),
  );
  Object.entries(sortable).forEach(([key, value]) => {
    if (value) {
      if (typeof value === 'string' || Array.isArray(value)) {
        query += query ? '&' : firstCharacter || '';
        if (!key.includes(CONSTANTS.HIDDEN)) {
          query += `${key}=${value}`;
        } else {
          query += value;
        }
      } else if (typeof value === 'object') {
        if (value.hasOwnProperty('lt')) {
          query += renderQuery(query, `${key}<${value.lt}`, firstCharacter);
        }
        if (value.hasOwnProperty('lte')) {
          query += renderQuery(query, `${key}<=${value.lte}`, firstCharacter);
        }
        if (value.hasOwnProperty('gt')) {
          query += renderQuery(query, `${key}>${value.gt}`, firstCharacter);
        }
        if (value.hasOwnProperty('gte')) {
          query += renderQuery(query, `${key}>=${value.gte}`, firstCharacter);
        }
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

export function checkTokenExp(authToken) {
  if (!authToken) return;

  const exp = jwtDecode(authToken).exp;
  const now = Date.now().valueOf() / 1000;
  return now < exp;
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
export function toast(type, label = '', requiredId = false) {
  if (!type) return;

  const toastifyOptions = {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  };

  if (requiredId) {
    toastifyOptions.toastId = label;
  }

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

export function formatDate(dateTime) {
  return dateTime ? moment(dateTime).format('DD/MM/YYYY') : '';
}

export function formatDateTime(dateTime) {
  return dateTime ? moment(dateTime).format('DD/MM/YYYY HH:mm') : '';
}

export function renderRowData(label, value, labelWidth = '100px') {
  return <div className='clearfix' style={{ lineHeight: '20px' }}>
    <strong style={{ fontSize: '12px', fontStyle: 'italic', width: labelWidth }} className='float-left'>
      {label}:
    </strong>
    <div>{value}</div>
  </div>;
}

export function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatQueryOneDay(time) {
  const gte = moment(time).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const lt = moment(gte).add({ days: 1 });
  return { gte: gte.toISOString(), lt: lt.toISOString() };
}
