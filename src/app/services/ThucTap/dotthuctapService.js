import axios from 'axios';
import { API } from '@api';
import { message } from 'antd';
import { convertParam, getMessageError, renderMessageError } from '@app/common/functionCommons';
import { CONSTANTS } from '@constants';

export function createDotThucTap(data) {
  return axios.post(`${API.DOT_THUC_TAP}`, data)
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllDotThucTap(currentPage = 1, totalDocs = 0, query, loading = true) {
  const params = convertParam(query, '&');
  const config = { loading };
  return axios.get(`${API.DOT_THUC_TAP}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then(response => {
      if (response.status === 200 && Array.isArray(response.data?.data?.docs)) return response.data.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateDotThucTap(data) {
  return axios.put(API.DOT_THUC_TAP_ID.format(data._id), data)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteDotThucTap(detaiId) {
  return axios.delete(API.DOT_THUC_TAP_ID.format(detaiId))
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
