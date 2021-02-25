import axios from 'axios';
import { API } from '@api';
import { message } from 'antd';
import { convertParam, getMessageError, renderMessageError } from '@app/common/functionCommons';
import { CONSTANTS } from '@constants';

export function createKhoaHoc(data) {
  return axios.post(`${API.KHOA_HOC}`, data)
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllKhoaHoc(currentPage = 1, totalDocs = 0, query, loading = true) {
  const params = convertParam(query, '&');
  const config = { loading };
  return axios.get(`${API.KHOA_HOC}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then(response => {
      if (response.status === 200 && Array.isArray(response.data?.data?.docs)) return response.data.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateKhoaHoc(data) {
  return axios.put(API.KHOA_HOC_ID.format(data._id), data)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteKhoaHoc(detaiId) {
  return axios.delete(API.KHOA_HOC_ID.format(detaiId))
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
