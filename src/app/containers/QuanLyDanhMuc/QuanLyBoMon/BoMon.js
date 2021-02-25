import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import ThemSuaBoMon from './ThemSuaBoMon';
import {
  createBoMon,
  deleteBoMon,
  getAllBoMon,
  updateBoMon,
} from '@app/services/BoMon/boMonService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { connect } from 'react-redux';
import * as bomon from '@app/store/ducks/bomon.duck';

import Filter from '@components/Filter';
import Loading from '@components/Loading';

function BoMon({ isLoading, bomonList, ...props }) {
  const [bomon, setBomon] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {

    if (!props?.bomonList?.length) {
      props.getBoMon();
    }
    (async () => {
      await getDataBoMon();
    })();
  }, []);

  async function getDataBoMon(
    currentPage = bomon.currentPage,
    pageSize = bomon.pageSize,
    query = bomon.query,
  ) {
    const apiResponse = await getAllBoMon(currentPage, pageSize, query);
    if (apiResponse) {
      setBomon({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = bomon.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    tenBoMon: data.ten_bo_mon,
    maBoMon: data.ma_bo_mon,
  }));

  const columns = [
    columnIndex(bomon.pageSize, bomon.currentPage),

    {
      title: 'Tên bộ môn',
      dataIndex: 'tenBoMon',
      key: 'tenBoMon',
      width: 300,
    },
    {
      title: 'Mã bộ môn',
      dataIndex: 'maBoMon',
      key: 'maBoMon',
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
    const apiResponse = await deleteBoMon(userSelected._id);
    if (apiResponse) {
      getDataBoMon();
      toast(CONSTANTS.SUCCESS, 'Xóa bộ môn thành công');
      updateStoreBoMon(CONSTANTS.DELETE,apiResponse);
    }
  }

// function create or modify
  async function createAndModifyBoMon(type, dataForm) {
    const { tenBoMon, maBoMon } = dataForm;
    const dataRequest = {
      ten_bo_mon: tenBoMon,
      ma_bo_mon: maBoMon,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createBoMon(dataRequest);
      if (apiResponse) {
        getDataBoMon();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới bộ môn thành công');
        updateStoreBoMon(type,apiResponse);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateBoMon(dataRequest);
      if (apiResponse) {
        const docs = bomon.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setBomon(Object.assign({}, bomon, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin bộ môn thành công');
        updateStoreBoMon(type,apiResponse);
      }
    }
  }
  function updateStoreBoMon(type, dataResponse) {
    if (!type || !dataResponse || !bomonList.length) return;

    const dataChanged = {
      id_vattu: dataResponse._id,
      name: dataResponse.ten_bo_mon,
    };
    let bomonListUpdated = [];
    if (type === CONSTANTS.UPDATE) {
      bomonListUpdated = bomonList.map(bomon => {
        if (bomon._id === dataChanged._id) {
          return dataChanged;
        }
        return bomon;
      });
    }

    if (type === CONSTANTS.DELETE) {
      bomonListUpdated = bomonList.filter(bomon => {
        return bomon._id !== dataChanged._id;
      });
    }

    if (type === CONSTANTS.CREATE) {
      bomonListUpdated = [...bomonList, dataChanged];
    }

    props.setBoMon(bomonListUpdated);
  }

  function handleChangePagination(current, pageSize) {
    getDataBoMon(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = bomon.currentPage;
  pagination.total = bomon.totalDocs;
  pagination.pageSize = bomon.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_bo_mon', label: 'Tên bộ môn', type: CONSTANTS.TEXT },
          { name: 'ma_bo_mon', label: 'Mã bộ môn ', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataBoMon(1, bomon.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <ThemSuaBoMon
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyBoMon}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { bomonList } = store.bomon;
  return { isLoading , bomonList};
}

export default (connect(mapStateToProps, bomon.actions)(BoMon));
