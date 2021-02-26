import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import ThemSuaLopHoc from './ThemSuaLopHoc';
import {
  createLopHoc,
  deleteLopHoc,
  getAllLopHoc,
  updateLopHoc,
} from '@app/services/LopHoc/lopHocService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { connect } from 'react-redux';
import * as lophoc from '@app/store/ducks/lophoc.duck';

import Filter from '@components/Filter';
import Loading from '@components/Loading';

function LopHoc({ isLoading, classmateList, ...props }) {
  const [classmate, setClassMate] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {

    if (!props?.classmateList?.length) {
      props.getClass();
    }
    (async () => {
      await getDataClass();
    })();
  }, []);

  async function getDataClass(
    currentPage = classmate.currentPage,
    pageSize = classmate.pageSize,
    query = classmate.query,
  ) {
    const apiResponse = await getAllLopHoc(currentPage, pageSize, query);
    if (apiResponse) {
      setClassMate({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = classmate.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    tenLopHoc: data.ten_lop_hoc,
    maLopHoc: data.ma_lop_hoc,
  }));

  const columns = [
    columnIndex(classmate.pageSize, classmate.currentPage),

    {
      title: 'Tên lớp học',
      dataIndex: 'tenLopHoc',
      key: 'tenLopHoc',
      width: 300,
    },
    {
      title: 'Mã lớp học',
      dataIndex: 'maLopHoc',
      key: 'maLopHoc',
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
    const apiResponse = await deleteLopHoc(userSelected._id);
    if (apiResponse) {
      getDataClass();
      toast(CONSTANTS.SUCCESS, 'Xóa lớp học thành công');
      updateStoreClass(CONSTANTS.DELETE, apiResponse);
    }
  }

// function create or modify class
  async function createAndModifyClass(type, dataForm) {
    const { tenLopHoc, maLopHoc } = dataForm;
    const dataRequest = {
      ten_lop_hoc: tenLopHoc,
      ma_lop_hoc: maLopHoc,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createLopHoc(dataRequest);
      if (apiResponse) {
        getDataClass();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới bộ môn thành công');
        updateStoreClass(type, apiResponse);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateLopHoc(dataRequest);
      if (apiResponse) {
        const docs = classmate.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setClassMate(Object.assign({}, lophoc, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin lớp học thành công');
        updateStoreClass(type, apiResponse);
      }
    }
  }


  // Update store classmate
  function updateStoreClass(type, dataResponse) {
    if (!type || !dataResponse || !classmateList?.length) return;

    const dataChanged = {
      _id: dataResponse._id,
      name: dataResponse.ten_lop_hoc,
    };
    let classListUpdated = [];
    if (type === CONSTANTS.UPDATE) {
      classListUpdated = classmateList.map(classmate => {
        if (classmate._id === dataChanged._id) {
          return dataChanged;
        }
        return classmate;
      });
    }

    if (type === CONSTANTS.DELETE) {
      classListUpdated = classmateList.filter(classmate => {
        return classmate._id !== dataChanged._id;
      });
    }

    if (type === CONSTANTS.CREATE) {
      classListUpdated = [...classmateList, dataChanged];
    }

    props.setBoMon(classListUpdated);
  }

  function handleChangePagination(current, pageSize) {
    getDataClass(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = classmate.currentPage;
  pagination.total = classmate.totalDocs;
  pagination.pageSize = classmate.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_lop_hoc', label: 'Tên lớp học', type: CONSTANTS.TEXT },
          { name: 'ma_lop_hoc', label: 'Mã lớp học ', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataClass(1, classmate.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <ThemSuaLopHoc
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyClass}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { classmateList } = store.lophoc;
  return { isLoading };
}

export default (connect(mapStateToProps, lophoc.actions)(LopHoc));
