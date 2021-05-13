import axios from 'axios';
import { API } from '@api';
import { convertParam, renderMessageError } from '@app/common/functionCommons';

export function createNgachGV(data) {
  return axios.post(`${API.NGACH_GV}`, data)
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllNgachGV(currentPage = 1, totalDocs = 0, query, loading = true) {
  const params = convertParam(query, '&');
  const config = { loading };
  return axios.get(`${API.NGACH_GV}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then(response => {
      if (response.status === 200 && Array.isArray(response.data?.data?.docs)) return response.data.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateNgachGV(data) {
  return axios.put(API.NGACH_GV_ID.format(data._id), data)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteNgachGV(detaiId) {
  return axios.delete(API.NGACH_GV_ID.format(detaiId))
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
