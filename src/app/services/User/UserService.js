import axios from 'axios';
import { API } from '@api';
import { convertParam, renderMessageError } from '@app/common/functionCommons';

export function login(data) {
  return axios.post(`${API.LOGIN}`, data)
    .then(response => {
      if (response.status === 200) return response.data?.token;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getRoleList() {
  return axios.get(API.ROLE)
    .then(response => {
      if (response.status === 200) return response.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllUser(currentPage = 1, totalDocs = 0, query) {
  const params = convertParam(query, '&');
  return axios.get(`${API.USERS}?page=${currentPage}&limit=${totalDocs}${params}`)
    .then(response => {
      if (response.status === 200) return response.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
//
// export function getAllUser(currentPage = 1, totalDocs = 0, query, loading = true) {
//   const params = convertParam(query, '&');
//   const config = { loading };
//   return axios.get(`${API.USERS}?page=${currentPage}&limit=${totalDocs}${params}`, config)
//     .then(response => {
//       if (response.status === 200 && Array.isArray(response.data?.data?.docs)) return response.data.data;
//       return null;
//     })
//     .catch((err) => {
//       renderMessageError(err);
//       return null;
//     });
// }
export function getUserByToken() {
  return axios.get(API.MY_INFO);
}

export function updateMyInfo(dataUpdate) {
  return axios.put(API.UPDATE_MY_INFO, dataUpdate)
    .then(response => {
      if (response?.status === 200) return response?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function createUser(data) {
  return axios.post(`${API.USERS}`, data)
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateUserById(data) {
  return axios.put(API.USER_ID.format(data._id), data)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteUserById(userId) {
  return axios.delete(API.USER_ID.format(userId))
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
