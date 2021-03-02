import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import ThemSuaDanhSachThucTap from './ThemSuaDanhSachThucTap';
import {
  createDanhSachThucTap,
  deleteDanhSachThucTap,
  getAllDanhSachThucTap,
  updateDanhSachThucTap,
} from '@app/services/ThucTap/danhsachthuctapService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import * as namhoc from '@app/store/ducks/namhoc.duck';


function DanhSachThucTap({ isLoading, namhocList, ...props }) {
  const [danhsachthuctap, setDanhsachthuctap] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    if (!props?.namhocList?.length) {
      props.getNamHoc();
    }
    (async () => {
      await getDataDanhSachThucTap();
    })();
  }, []);

  async function getDataDanhSachThucTap(
    currentPage = danhsachthuctap.currentPage,
    pageSize = danhsachthuctap.pageSize,
    query = danhsachthuctap.query,
  ) {
    const apiResponse = await getAllDanhSachThucTap(currentPage, pageSize, query);
    if (apiResponse) {
      setDanhsachthuctap({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = danhsachthuctap.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    tenThuctap: data.ten_thuc_tap,
    ghiChu: data.ghi_chu,
    namHoc: data.namhoc_id,
    thoiGianBatDau: data.thoi_gian_bat_dau,
  }));

  const columns = [
    columnIndex(danhsachthuctap.pageSize, danhsachthuctap.currentPage),

    {
      title: 'Đợt thực tập',
      dataIndex: 'tenThuctap',
      key: 'tenThuctap',
      width: 300,
    },
    {
      title: 'Năm học',
      dataIndex: 'namHoc',
      key: 'namHoc',
      render: value => value?.nam_hoc,
      width: 300,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      key: 'thoiGianBatDau',
      render: value => value ? moment(value).format('DD/MM/YYYY') : '',
      width: 300,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
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
    const apiResponse = await deleteDanhSachThucTap(userSelected._id);
    if (apiResponse) {
      getDataDanhSachThucTap();
      toast(CONSTANTS.SUCCESS, 'Xóa đợt thực tập thành công');    }
  }

// function create or modify
  async function createAndModifyDanhSachThucTap(type, dataForm) {
    const { tenThuctap, ghiChu, thoiGianBatDau, namHoc } = dataForm;
    const dataRequest = {
      ten_thuc_tap: tenThuctap,
      namhoc_id: namHoc,
      thoi_gian_bat_dau: thoiGianBatDau? thoiGianBatDau.toString() : null,
      ghi_chu: ghiChu,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createDanhSachThucTap(dataRequest);
      if (apiResponse) {
        getDataDanhSachThucTap();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới đợt thực tập thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateDanhSachThucTap(dataRequest);
      if (apiResponse) {
        const docs = danhsachthuctap.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setDanhsachthuctap(Object.assign({}, danhsachthuctap, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin đợt thực tập thành công');
      }
    }
  }


  function handleChangePagination(current, pageSize) {
    getDataDanhSachThucTap(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = danhsachthuctap.currentPage;
  pagination.total = danhsachthuctap.totalDocs;
  pagination.pageSize = danhsachthuctap.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_thuc_tap', label: 'đợt thực tập', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataDanhSachThucTap(1, danhsachthuctap.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <ThemSuaDanhSachThucTap
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyDanhSachThucTap}
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

export default (connect(mapStateToProps, namhoc.actions)(DanhSachThucTap));
