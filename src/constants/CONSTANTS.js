import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';

export const CONSTANTS = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  LOGIN: 'LOGIN',
  DEFAULT: 'DEFAULT',
  DELETE: 'DELETE',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  SAVE: 'SAVE',
  CONFIRM: 'CONFIRM',
  CANCEL: 'CANCEL',
  CLOSE: 'CLOSE',

  TEXT: 'TEXT',
  DATE: 'DATE',
  INPUT: 'INPUT',
  CHECK_BOX: 'CHECK_BOX',
  SELECT: 'SELECT',
  MULTI_SELECT: 'MULTI_SELECT',
  TEXT_AREA: 'TEXT_AREA',
  SELECT_MULTI: 'SELECT_MULTI',
  PASSWORD: 'PASSWORD',
  SWITCH: 'SWITCH',
  LABEL: 'LABEL',

  DESTROY: 'DESTROY',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  INFO: 'INFO',
  WARNING: 'WARNING',
};

export const PAGINATION_INIT = Object.assign({}, {
  docs: [],
  currentPage: 1,
  pageSize: 10,
  totalDocs: 0,
  query: {},
});
export const TOKEN_EXP_TIME = 1000 * 5 * 60;

export const GENDER_OPTIONS = [
  { label: 'Nam', value: 'Nam' },
  { label: 'Nữ', value: 'Nữ' },
  { label: 'Khác', value: 'Khác' },
];

export const TOAST_MESSAGE = {
  SUCCESS: {
    DEFAULT: 'Thành công',
  },
  ERROR: {
    DEFAULT: 'Có lỗi xảy ra',
    LOGIN: 'Có lỗi trong quá trình đăng nhập',
    GET: 'Có lỗi trong quá trình lấy dữ liệu',
    POST: 'Có lỗi trong quá trình tạo mới',
    PUT: 'Có lỗi trong quá trình cập nhật',
    DELETE: 'Có lỗi trong quá trình xoá dữ liệu',
    DESCRIPTION: 'Vui lòng kiểm tra và thử lại',
  },
  ICON: {
    SUCCESS: <CheckCircleOutlined className='float-left' style={{ fontSize: '24px', color: '#fff' }}/>,
    ERROR: <CloseCircleOutlined className='float-left' style={{ fontSize: '24px', color: '#fff' }}/>,
    INFO: <InfoCircleOutlined className='float-left' style={{ fontSize: '24px', color: '#fff' }}/>,
    WARNING: <WarningOutlined className='float-left' style={{ fontSize: '24px', color: '#fff' }}/>,
  },
};

export const RULES = {
  REQUIRED: { required: true, message: 'Không được để trống' },
  UNREQUIRED: { required: false },
  NUMBER: { pattern: '^[0-9]+$', message: 'Không phải là số' },
  PHONE: { pattern: '^[0-9]+$', len: 10, message: 'Số điện thoại không hợp lệ' },
  EMAIL: { type: 'email', message: 'Email không hợp lệ' },
  NUMBER_FLOAT: {
    pattern: new RegExp('^[- +]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$'),
    message: 'Không phải là số',
  },
  PASSWORD_FORMAT: {
    pattern: new RegExp('^(?=.*[a-z])(?=.*[0-9])(?!.* )(?=.{6,14})'),
    message: 'Mật khẩu phải có ít nhất một chữ cái và một chữ số, độ dài 6 đến 14 ký tự và không có khoảng trắng',
  },
  USERNAME_RANGER: {
    pattern: new RegExp('^([a-zA-Z0-9_-]){6,14}$'),
    message: 'Tên tài khoản chỉ chấp nhận chữ cái và số độ dài 6 đến 14 ký tự',
  },
};

export const PAGINATION_CONFIG = {
  pageSizeOptions: ['1', '10', '20', '50'],
  showSizeChanger: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`,
};

export const TRANSFER_TYPE = {
  YEU_CAU_DIEU_CHUYEN: 'YeuCauDieuChuyen',
  BIEN_BAN_DIEU_CHUYEN: 'BienBanDieuChuyen',
};
