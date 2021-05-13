import axios from 'axios';
import { API } from '@api';
import { convertParam, renderMessageError } from '@app/common/functionCommons';

export function createLinhVuc(data) {
  return axios.post(`${API.LINH_VUC}`, data)
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllLinhVuc(currentPage = 1, totalDocs = 0, query, loading = true) {
  const params = convertParam(query, '&');
  const config = { loading };
  return axios.get(`${API.LINH_VUC}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then(response => {
      if (response.status === 200 && Array.isArray(response.data?.data?.docs)) return response.data.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateLinhVuc(data) {
  return axios.put(API.LINH_VUC_ID.format(data._id), data)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteLinhVuc(detaiId) {
  return axios.delete(API.LINH_VUC_ID.format(detaiId))
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
