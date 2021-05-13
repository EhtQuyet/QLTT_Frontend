import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import NgachGVDetail from './ngachGVDetail';
import {
  createNgachGV,
  deleteNgachGV,
  getAllNgachGV,
  updateNgachGV,
} from '@app/services/NgachGV/ngachGV.service';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';

function NgachGVManagernent({ isLoading, ...props }) {
  const [ngachgv, setNgachGV] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    (async () => {
      await getDataNgachGV();
    })();
  }, []);

  async function getDataNgachGV(
    currentPage = ngachgv.currentPage,
    pageSize = ngachgv.pageSize,
    query = ngachgv.query,
  ) {
    const apiResponse = await getAllNgachGV(currentPage, pageSize, query);
    if (apiResponse) {
      setNgachGV({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = ngachgv.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    maNgach: data.ma_ngach,
    tenNgach: data.ten_ngach,
    moTa: data.mo_ta,
  }));

  const columns = [
    columnIndex(ngachgv.pageSize, ngachgv.currentPage),

    {
      title: 'Mã ngạch',
      dataIndex: 'maNgach',
      key: 'maNgach',
      width: 300,
    },
    {
      title: 'Tên ngạch',
      dataIndex: 'tenNgach',
      key: 'tenNgach',
      width: 300,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
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
    const apiResponse = await deleteNgachGV(userSelected._id);
    if (apiResponse) {
      getDataNgachGV();
      toast(CONSTANTS.SUCCESS, 'Xóa ngạch giảng viên thành công');
    }
  }

  async function createAndModifyNgachGV(type, dataForm) {
    const { maNgach, tenNgach, moTa } = dataForm;
    const dataRequest = {
      ma_ngach: maNgach,
      ten_ngach: tenNgach,
      mo_ta: moTa,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createNgachGV(dataRequest);
      if (apiResponse) {
        getDataNgachGV();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới từ khóa thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateNgachGV(dataRequest);
      if (apiResponse) {
        const docs = ngachgv.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setNgachGV(Object.assign({}, ngachgv, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin ngạch giảng viên thành công');
      }
    }
  }


  function handleChangePagination(current, pageSize) {
    getDataNgachGV(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = ngachgv.currentPage;
  pagination.total = ngachgv.totalDocs;
  pagination.pageSize = ngachgv.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_ngach', label: 'ngạch giảng viên', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataNgachGV(1, ngachgv.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <NgachGVDetail
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyNgachGV}
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

export default (connect(mapStateToProps)(NgachGVManagernent));
