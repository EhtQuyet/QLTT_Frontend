import axios from 'axios';
import { API } from '@api';
import { convertParam, renderMessageError } from '@app/common/functionCommons';

export function createLopThucTap(data) {
  return axios.post(API.LOP_THUC_TAP, data)
    .then(response => {
      if (response.status === 200) {
        return response?.data?.data;
      }
      return null;
    })
    .catch(err => {
      renderMessageError(err);
      return null;
    });
}


export function getAllLopThucTap(currentPage = 1, totalDocs = 0, query) {
  const params = convertParam(query, '&');
  return axios.get(`${API.LOP_THUC_TAP}?page=${currentPage}&limit=${totalDocs}${params}`)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateLopThucTap(data) {
  return axios.put(API.LOP_THUC_TAP_ID.format(data._id), data)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteLopThucTap(id) {
  return axios.delete(API.LOP_THUC_TAP_ID.format(id))
    .then(response => {
      if (response.status === 200) return response?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getLopThucTapByID(id) {
  return axios.get(API.LOP_THUC_TAP_ID.format(id))
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
