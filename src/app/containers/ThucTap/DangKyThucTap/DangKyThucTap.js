import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
// import ThemSuaBoMon from './ThemSuaBoMon';
// import {
//   createBoMon,
//   deleteBoMon,
//   getAllBoMon,
//   updateBoMon,
// } from '@app/services/BoMon/boMonService';
import {
  getAllDKThucTap,
  createDKThucTap,
  deleteDKThucTap,
  updateDKThucTap
} from '@app/services/DKThucTap/DKThucTapService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { connect } from 'react-redux';
import * as bomon  from '@app/store/ducks/bomon.duck';

import Filter from '@components/Filter';
import Loading from '@components/Loading';

function DKThucTap({ isLoading, bomonList, ...props }) {
  const [dkthuctap, setDkthuctap] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {

    // if (!props?.bomonList?.length) {
    //   props.getBoMon();
    // }
    (async () => {
      getData();
    })();
  }, []);

  async function getData(
    currentPage = dkthuctap.currentPage,
    pageSize = dkthuctap.pageSize,
    query = dkthuctap.query,
  ) {
    const apiResponse = await getAllDKThucTap(currentPage, pageSize, query);
    console.log('apiResponse',apiResponse);
    if (apiResponse) {
      setDkthuctap({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = dkthuctap.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
  }));

  const columns = [
    columnIndex(dkthuctap.pageSize, dkthuctap.currentPage),
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 300,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'tenSinhVien',
      key: 'tenSinhVien',
      width: 300,
    },
    {
      title: 'Giảng viên hướng dẫn',
      dataIndex: 'gvHuongDan',
      key: 'gvHuongDan',
      width: 300,
    },
    {
      align: 'center',
      render: (value) => <ActionCell value={value} handleEdit={handleEdit} handleDelete={handleDelete}/>,
      width: 300,
    },
  ];

  // function handleShowModal(isShowModal, userSelected = null) {
  //   setState({
  //     isShowModal,
  //     userSelected,
  //   });
  // }
  //
  function handleEdit(userSelected) {
    setState({ isShowModal: true, userSelected });
  }

  async function handleDelete(userSelected) {
    const apiResponse = await deleteBoMon(userSelected._id);
    if (apiResponse) {
      getData();
      toast(CONSTANTS.SUCCESS, 'Xóathành công');
      // updateStoreBoMon(CONSTANTS.DELETE,apiResponse);
    }
  }

// function create or modify
//   async function createAndModifyBoMon(type, dataForm) {
//     const { tenBoMon, maBoMon } = dataForm;
//     const dataRequest = {
//       ten_bo_mon: tenBoMon,
//       ma_bo_mon: maBoMon,
//     };
//     if (type === CONSTANTS.CREATE) {
//       const apiResponse = await createBoMon(dataRequest);
//       if (apiResponse) {
//         getDataBoMon();
//         handleShowModal(false);
//         toast(CONSTANTS.SUCCESS, 'Thêm mới bộ môn thành công');
//         updateStoreBoMon(type,apiResponse);
//       }
//     }
//
//     if (type === CONSTANTS.UPDATE) {
//       dataRequest._id = state.userSelected._id;
//       const apiResponse = await updateBoMon(dataRequest);
//       if (apiResponse) {
//         const docs = dkthuctap.docs.map(doc => {
//           if (doc._id === apiResponse._id) {
//             doc = apiResponse;
//           }
//           return doc;
//         });
//         setDkthuctap(Object.assign({}, dkthuctap, { docs }));
//         handleShowModal(false);
//         toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin bộ môn thành công');
//         updateStoreBoMon(type,apiResponse);
//       }
//     }
//   }
//   // update store redux
//   function updateStoreBoMon(type, dataResponse) {
//     if (!type || !dataResponse || !bomonList.length) return;
//
//     const dataChanged = {
//       _id: dataResponse._id,
//       name: dataResponse.ten_bo_mon,
//     };
//     let bomonListUpdated = [];
//     if (type === CONSTANTS.UPDATE) {
//       bomonListUpdated = bomonList.map(dkthuctap => {
//         if (dkthuctap._id === dataChanged._id) {
//           return dataChanged;
//         }
//         return dkthuctap;
//       });
//     }
//
//     if (type === CONSTANTS.DELETE) {
//       bomonListUpdated = bomonList.filter(dkthuctap => {
//         return dkthuctap._id !== dataChanged._id;
//       });
//     }
//
//     if (type === CONSTANTS.CREATE) {
//       bomonListUpdated = [...bomonList, dataChanged];
//     }
//
//     props.setBoMon(bomonListUpdated);
//   }
//
  function handleChangePagination(current, pageSize) {
    getData(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = dkthuctap.currentPage;
  pagination.total = dkthuctap.totalDocs;
  pagination.pageSize = dkthuctap.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_sinh_vien', label: 'Tên sinh viên', type: CONSTANTS.TEXT },
          { name: 'Ma_sinh_vien', label: 'Mã sinh viên', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getData(1, dkthuctap.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <ThemSuaBoMon
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        // isModalVisible={state.isShowModal}
        // handleOk={createAndModifyBoMon}
        // handleCancel={() => handleShowModal(false)}
        // userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { bomonList } = store.dkthuctap;
  return { isLoading , bomonList};
}

export default (connect(mapStateToProps, dkthuctap.actions)(DKThucTap));
