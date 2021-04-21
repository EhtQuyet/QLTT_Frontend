import axios from 'axios';
import { API } from '@api';
import { message } from 'antd';
import { convertParam, getMessageError, renderMessageError } from '@app/common/functionCommons';
import { CONSTANTS } from '@constants';


export function getThongKeSinhVien() {
  return axios.get(API.SINH_VIEN_THUC_TAP)
    .then(response => {
      if (response.status === 200 ) return response.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getThongKeSVTheoDiaDiem() {
  return axios.get(API.DIA_DIEM_SV_THUC_TAP)
    .then(response => {
      if (response.status === 200) return response.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
