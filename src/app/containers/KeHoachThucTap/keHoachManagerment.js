import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import KeHoachDetail from './keHoachDetail';
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

function KeHoachManagernent({ isLoading,  ...props }) {
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
    const apiResponse = await getAllKeHoach(currentPage, pageSize, query);
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
    maSinhVien: data.ma_sinh_vien,
    keHoach: data.ke_hoach,
    ghiChu: data.ghi_chu,
    trangThai: data.trang_thai,
  }));

  const columns = [
    columnIndex(kehoach.pageSize, kehoach.currentPage),

    {
      title: 'Tên sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
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
      key: 'trangThai',
      width: 300,
    },
    {
      align: 'center',
      render: (value) => <ActionCell value={value} handleEdit={handleEdit} handleDelete={handleDelete}/>,
      width: 300,
    },
  ];

  function handleShowModal(isShowModal, userSelected = null) {
    setState({
      isShowModal,
      userSelected,
    });
  }

  function handleEdit(userSelected) {
    setState({ isShowModal: true, userSelected });
  }

  async function handleDelete(userSelected) {
    const apiResponse = await deleteKeHoach(userSelected._id);
    if (apiResponse) {
      getDataKeHoach();
      toast(CONSTANTS.SUCCESS, 'Xóa kế hoạch thành công');    }
  }

// function create or modify
  async function createAndModifyKeHoach(type, dataForm) {
    const { maSinhVien, keHoach, ghiChu, trangThai } = dataForm;
    const dataRequest = {
      ma_sinh_vien: maSinhVien,
      ke_hoach: keHoach,
      ghi_chu: ghiChu,
      trang_thai: trangThai,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createKeHoach(dataRequest);
      if (apiResponse) {
        getDataKeHoach();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới kế hoạch thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateKeHoach(dataRequest);
      if (apiResponse) {
        const docs = kehoach.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setKeHoach(Object.assign({}, kehoach, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin kế hoạch thành công');
      }
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

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      {/*<KeHoachDetail*/}
      {/*  type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}*/}
      {/*  isModalVisible={state.isShowModal}*/}
      {/*  handleOk={createAndModifyKeHoach}*/}
      {/*  handleCancel={() => handleShowModal(false)}*/}
      {/*  userSelected={state.userSelected}*/}
      {/*/>*/}
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default (connect(mapStateToProps)(KeHoachManagernent));
