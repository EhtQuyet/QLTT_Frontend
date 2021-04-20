import axios from 'axios';
import { API } from '@api';
import { convertParam, renderMessageError } from '@app/common/functionCommons';


export function getNhomThucTapById(id) {
  return axios.get(API.NHOM_THUC_TAP_ID.format(id))
    .then(response => {
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      }
      return null;
    })
    .catch(err => {
      renderMessageError(err);
      return null;
    });
}
export function createNhomThucTap(data) {
  return axios.post(`${API.NHOM_THUC_TAP}`, data)
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllNhomThucTap(currentPage = 1, totalDocs = 0, query, loading = true) {
  const params = convertParam(query, '&');
  const config = { loading };
  return axios.get(`${API.NHOM_THUC_TAP}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then(response => {
      if (response.status === 200 && Array.isArray(response.data?.data?.docs)) return response.data.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllNhomThucTapChiTiet(currentPage = 1, totalDocs = 0, query, loading = true) {
  const params = convertParam(query, '&');
  const config = { loading };
  return axios.get(`${API.NHOM_THUC_TAP_CHI_TIET}?page=${currentPage}&limit=${totalDocs}${params}`, config)
    .then(response => {
      if (response.status === 200 && Array.isArray(response.data?.data?.docs)) return response.data.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateNhomThucTap(data) {
  return axios.put(API.NHOM_THUC_TAP_ID.format(data._id), data)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deletenhomThucTapById(detaiId) {
  return axios.delete(API.NHOM_THUC_TAP_ID.format(detaiId))
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
