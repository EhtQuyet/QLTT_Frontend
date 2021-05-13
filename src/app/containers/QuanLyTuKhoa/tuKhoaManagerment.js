import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import TuKhoaDetail from './tuKhoaDetail';
import {
  createTuKhoa,
  deleteTuKhoa,
  getAllTuKhoa,
  updateTuKhoa,
} from '@app/services/TuKhoa/tuKhoa.service';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import * as tukhoa from '@app/store/ducks/tukhoa.duck';

function TuKhoaManagernent({ isLoading,  ...props }) {
  const [tukhoa, setTuKhoa] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    // if (!props?.tukhoaList?.length) {
    //   props.getTuKhoa();
    // }
    (async () => {
      await getDataTuKhoa();
    })();
  }, []);

  async function getDataTuKhoa(
    currentPage = tukhoa.currentPage,
    pageSize = tukhoa.pageSize,
    query = tukhoa.query,
  ) {
    const apiResponse = await getAllTuKhoa(currentPage, pageSize, query);
    if (apiResponse) {
      setTuKhoa({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = tukhoa.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    tuKhoa: data.tu_khoa,
  }));

  const columns = [
    columnIndex(tukhoa.pageSize, tukhoa.currentPage),

    {
      title: 'Từ khóa',
      dataIndex: 'tuKhoa',
      key: 'tuKhoa',
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
    const apiResponse = await deleteTuKhoa(userSelected._id);
    if (apiResponse) {
      getDataTuKhoa();
      toast(CONSTANTS.SUCCESS, 'Xóa từ khóa thành công');    }
  }

// function create or modify
  async function createAndModifyTuKhoa(type, dataForm) {
    const { tuKhoa } = dataForm;
    const dataRequest = {
      tu_khoa: tuKhoa,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createTuKhoa(dataRequest);
      if (apiResponse) {
        getDataTuKhoa();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới từ khóa thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateTuKhoa(dataRequest);
      if (apiResponse) {
        const docs = tukhoa.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setTuKhoa(Object.assign({}, tukhoa, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin từ khóa thành công');
      }
    }
  }


  function handleChangePagination(current, pageSize) {
    getDataTuKhoa(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = tukhoa.currentPage;
  pagination.total = tukhoa.totalDocs;
  pagination.pageSize = tukhoa.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'tu_khoa', label: 'Từ khóa', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataTuKhoa(1, tukhoa.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <TuKhoaDetail
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyTuKhoa}
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

export default (connect(mapStateToProps)(TuKhoaManagernent));
