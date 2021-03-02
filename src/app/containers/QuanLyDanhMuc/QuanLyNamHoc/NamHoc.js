import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import ThemSuaNamHoc from './ThemSuaNamHoc';
import {
  createNamHoc,
  deleteNamHoc,
  getAllNamHoc,
  updateNamHoc,
} from '@app/services/NamHoc/namhocService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import * as namhoc from '@app/store/ducks/namhoc.duck';

function NamHoc({ isLoading, namhocList, ...props }) {
  const [namhoc, setNamhoc] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    if (!props?.namhocList?.length) {
      props.getNamHoc();
    }
    (async () => {
      await getDataNamHoc();
    })();
  }, []);

  async function getDataNamHoc(
    currentPage = namhoc.currentPage,
    pageSize = namhoc.pageSize,
    query = namhoc.query,
  ) {
    const apiResponse = await getAllNamHoc(currentPage, pageSize, query);
    if (apiResponse) {
      setNamhoc({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = namhoc.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    namHoc: data.nam_hoc,
    thuTu: data.thu_tu,
  }));

  const columns = [
    columnIndex(namhoc.pageSize, namhoc.currentPage),

    {
      title: 'Năm học',
      dataIndex: 'namHoc',
      key: 'namHoc',
      width: 300,
    },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'thuTu',
      key: 'thuTu',
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
    const apiResponse = await deleteNamHoc(userSelected._id);
    if (apiResponse) {
      getDataNamHoc();
      toast(CONSTANTS.SUCCESS, 'Xóa Năm học thành công');    }
  }

// function create or modify
  async function createAndModifyNamHoc(type, dataForm) {
    const { namHoc, thuTu } = dataForm;
    const dataRequest = {
      nam_hoc: namHoc,
      thu_tu: thuTu,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createNamHoc(dataRequest);
      if (apiResponse) {
        getDataNamHoc();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới Năm học thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateNamHoc(dataRequest);
      if (apiResponse) {
        const docs = namhoc.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setNamhoc(Object.assign({}, namhoc, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin Năm học thành công');
      }
    }
  }


  function handleChangePagination(current, pageSize) {
    getDataNamHoc(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = namhoc.currentPage;
  pagination.total = namhoc.totalDocs;
  pagination.pageSize = namhoc.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'nam_hoc', label: 'Năm học', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataNamHoc(1, namhoc.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <ThemSuaNamHoc
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyNamHoc}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { namhocList } = store.namhoc;
  return { isLoading };
}

export default (connect(mapStateToProps, namhoc.actions)(NamHoc));
