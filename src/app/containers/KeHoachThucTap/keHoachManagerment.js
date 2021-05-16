import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import KeHoachDetail from './keHoachDetail';
import { Link } from 'react-router-dom';
import {
  createKeHoach,
  deleteKeHoach,
  getAllKeHoach,
  updateKeHoach,
} from '@app/services/KeHoach/keHoach.service';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import { URL } from '@url';

function keHoachManagerment({ isLoading, ...props }) {
  const [kehoach, setKeHoach] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    (async () => {
      await getDataKeHoach();
    })();
  }, []);

  async function getDataKeHoach(
    currentPage = kehoach.currentPage,
    pageSize = kehoach.pageSize,
    query = kehoach.query,
  ) {
    const apiResponse = await getAllKeHoach(currentPage, pageSize, query)
    console.log('apiResponse', apiResponse);
    if (apiResponse) {
      setKeHoach({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = kehoach.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    tenSinhVien: data.id_sinhvien,
    keHoach: data.ke_hoach,
    ghiChu: data.ghi_chu,
    trangThai: data.trang_thai,
  }));

  const columns = [
    columnIndex(kehoach.pageSize, kehoach.currentPage),

    {
      title: 'Tên sinh viên',
      dataIndex: 'tenSinhVien',
      key: 'tenSinhVien',
      render: value => value?.ten_sinh_vien,
      width: 300,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      width: 300,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      render: value => {
        if(value === 'DANG_XU_LY'){
          return 'Đã xử lý'
        }
        return 'Chưa xử lý'
      },
      key: 'trangThai',
      width: 300,
    },
    {
      align: 'center',
      render: (text, record, index) => <>
        <ActionCell
          value={record}
          disabledDelete={isLoading}
          linkToEdit={URL.MENU.KE_HOACH_CHI_TIET_ID.format(record._id)}
          handleDelete={handleDelete}
        />
      </>,
      width: 300,
    },
  ];



  async function handleDelete(userSelected) {
    const apiResponse = await deleteKeHoach(userSelected._id);
    if (apiResponse) {
      getDataKeHoach();
      toast(CONSTANTS.SUCCESS, 'Xóa kế hoạch thành công');
    }
  }

  function handleChangePagination(current, pageSize) {
    getDataKeHoach(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = kehoach.currentPage;
  pagination.total = kehoach.totalDocs;
  pagination.pageSize = kehoach.pageSize;
  return (
    <div>
      {/*<Filter*/}
      {/*  dataSearch={[*/}
      {/*    { name: 'ma_sinh_vien', label: 'Sinh viên', type: CONSTANTS.TEXT },*/}
      {/*  ]}*/}
      {/*  handleFilter={(query) => getDataKeHoach(1, kehoach.pageSize, query)}/>*/}

      <AddNewButton
        disabled={isLoading}
        linkTo={URL.MENU.THEM_KE_HOACH} label={'Thêm nhóm thực tập'}
      />
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default (connect(mapStateToProps)(keHoachManagerment));
