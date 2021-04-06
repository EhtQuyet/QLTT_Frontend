import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import CreateAndModify from './CreateAndModify';
import {
  createDKTT,
  deleteDKTT,
  getAllDKTT,
  updateDKTT,
  getFindOne,
} from '@app/services/DKThucTap/DKThucTapService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { connect } from 'react-redux';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import * as giaovien from '@app/store/ducks/giaovien.duck';
import * as diadiem from '@app/store/ducks/diadiem.duck';
import * as user from '@app/store/ducks/user.duck';
import * as dotthuctap from '@app/store/ducks/dotthuctap.duck';


function DangKyThucTap({ isLoading, myInfo,dotthuctapList, teacherList, diadiemList, ...props }) {
  const [dkthuctap, setDkthuctap] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const [isSig, setIsSig] = useState(null)
  useEffect(() => {
    if (!props?.teacherList?.length) {
      props.getTeacher();
    }
    if (!props?.diadiemList?.length) {
      props.getDiaDiem();
    }
    if (!props?.dotthuctapList?.length) {
      props.getDotThucTap();
    }
    (async () => {
      await getData();
      await getDataInfo();
    })();
  }, []);

  async function getDataInfo() {
    const apiResponse = await getFindOne(myInfo._id);
    if(apiResponse)
      setIsSig(apiResponse)
  }

  async function getData(
    currentPage = dkthuctap.currentPage,
    pageSize = dkthuctap.pageSize,
    query = dkthuctap.query,
  ) {
    const apiResponse = await getAllDKTT(currentPage, pageSize, query);
    console.log('apiResponse.docs',apiResponse.docs);
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
    dot_thuc_tap: data.dot_thuc_tap,
    giaoien_huongdan: data.giao_vien_huong_dan,
    sinhVien: data.sinh_vien,
    diadiem_thuctap: data.dia_diem_thuc_tap,
    diemTichLuy: data.diem_tbtl,
    tinchi_tichluy: data.so_tctl,
  }));

  const columns = [
    columnIndex(dkthuctap.pageSize, dkthuctap.currentPage),
    {
      title: 'Đợt thực tập',
      dataIndex: 'dot_thuc_tap',
      render: value => value?.ten_dot,
      width: 300,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'sinhVien',
      render: value => value?.full_name,
      width: 200,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'sinhVien',
      render: value => value?.username,
      width: 200,
    },
    {
      title: 'Tên giáo viên',
      dataIndex: 'giaoien_huongdan',
      render: value => value?.ten_giao_vien,
      width: 300,
    },
    {
      title: 'Địa điểm thực tập',
      dataIndex: 'diadiem_thuctap',
      render: value => value?.ten_dia_diem,
      width: 300,
    },
    {
      title: 'Điểm TB tích lũy',
      dataIndex: 'diemTichLuy',
      width: 200,
    },
    {
      title: 'Tín chỉ tích lũy',
      dataIndex: 'tinchi_tichluy',
      width: 200,
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
    const apiResponse = await deleteDKTT(userSelected._id);
    if (apiResponse) {
      getData();
      toast(CONSTANTS.SUCCESS, 'Xóa đăng kí thực tập thành công');
    }
  }

// function create or modify
  async function createAndModify(type, dataForm) {
    const { giaoVien, diemTichLuy, tinchi_tichluy, diaDiem , dot_thuc_tap} = dataForm;
    const dataRequest = {
      giao_vien_huong_dan: giaoVien,
      dia_diem_thuc_tap: diaDiem,
      diem_tbtl: diemTichLuy,
      so_tctl: tinchi_tichluy,
      dot_thuc_tap: dot_thuc_tap
      // sinh_vien: myInfo._id,
    };
    if (type === CONSTANTS.CREATE) {
      dataRequest.sinh_vien = myInfo._id;
      const apiResponse = await createDKTT(dataRequest);
      if (apiResponse) {
        getData();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới đăng kí thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateDKTT(dataRequest);
      if (apiResponse) {
        const docs = dkthuctap.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setDkthuctap(Object.assign({}, dkthuctap, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin đăng kí thành công');
      }
    }
  }

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
      {/*<Filter*/}
      {/*  dataSearch={[*/}
      {/*    { name: 'ten_giao_vien', label: 'Tên giáo viên', type: CONSTANTS.TEXT },*/}
      {/*    { name: 'ma_giao_vien', label: 'Mã giáo viên ', type: CONSTANTS.TEXT },*/}
      {/*  ]}*/}
      {/*  handleFilter={(query) => getDataGiaoVien(1, giaovien.pageSize, query)}/>*/}

      {isSig === null && <AddNewButton label='Đăng ký' onClick={() => handleShowModal(true)} disabled={isLoading}/>}

      {isSig !== null && <AddNewButton label='Chọn nhóm' onClick={() => handleShowModal(true)} disabled={isLoading}/>}

      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <CreateAndModify
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModify}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  const { teacherList } = store.giaovien;
  const { diadiemList } = store.diadiem;
  const { dotthuctapList } = store.dotthuctap;

  return { isLoading, teacherList, myInfo, diadiemList , dotthuctapList};
}

export default (connect(mapStateToProps, { ...user.actions, ...giaovien.actions, ...diadiem.actions ,...dotthuctap.actions})(DangKyThucTap));
