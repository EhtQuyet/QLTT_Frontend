import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import LinhVucDetail from './linhVucDetail';
import {
  createLinhVuc,
  deleteLinhVuc,
  getAllLinhVuc,
  updateLinhVuc,
} from '@app/services/LinhVuc/linhVuc.service';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';

function LinhVucManagernent({ isLoading,  ...props }) {
  const [linhvuc, setLinhVuc] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    (async () => {
      await getDataLinhVuc();
    })();
  }, []);

  async function getDataLinhVuc(
    currentPage = linhvuc.currentPage,
    pageSize = linhvuc.pageSize,
    query = linhvuc.query,
  ) {
    const apiResponse = await getAllLinhVuc(currentPage, pageSize, query);
    if (apiResponse) {
      setLinhVuc({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = linhvuc.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    linhVuc: data.ten_linh_vuc,
  }));

  const columns = [
    columnIndex(linhvuc.pageSize, linhvuc.currentPage),

    {
      title: 'Lĩnh vực',
      dataIndex: 'linhVuc',
      key: 'linhVuc',
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
    const apiResponse = await deleteLinhVuc(userSelected._id);
    if (apiResponse) {
      getDataLinhVuc();
      toast(CONSTANTS.SUCCESS, 'Xóa lĩnh vực thành công');    }
  }

// function create or modify
  async function createAndModifyLinhVuc(type, dataForm) {
    const { linhVuc } = dataForm;
    const dataRequest = {
      ten_linh_vuc: linhVuc,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createLinhVuc(dataRequest);
      if (apiResponse) {
        getDataLinhVuc();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới lĩnh vực thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateLinhVuc(dataRequest);
      if (apiResponse) {
        const docs = linhvuc.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setLinhVuc(Object.assign({}, linhvuc, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin lĩnh vực thành công');
      }
    }
  }


  function handleChangePagination(current, pageSize) {
    getDataLinhVuc(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = linhvuc.currentPage;
  pagination.total = linhvuc.totalDocs;
  pagination.pageSize = linhvuc.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_linh_vuc', label: 'Lĩnh vực', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataLinhVuc(1, linhvuc.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <LinhVucDetail
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyLinhVuc}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default (connect(mapStateToProps)(LinhVucManagernent));
