import axios from 'axios';
import { API } from '@api';
import { message } from 'antd';
import { convertParam, getMessageError, renderMessageError } from '@app/common/functionCommons';
import { CONSTANTS } from '@constants';

export function createGiaoVien(data) {
  return axios.post(`${API.GIAO_VIEN}`, data)
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllGiaoVien(currentPage = 1, totalDocs = 0, query, loading = true) {
  const params = convertParam(query, '&');
  const config = { loading };
  return axios.get(`${API.GIAO_VIEN}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then(response => {
      if (response.status === 200 && Array.isArray(response.data?.data?.docs)) return response.data.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateGiaoVien(data) {
  return axios.put(API.GIAO_VIEN_ID.format(data._id), data)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteGiaoVien(detaiId) {
  return axios.delete(API.GIAO_VIEN_ID.format(detaiId))
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
