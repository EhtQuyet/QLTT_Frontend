import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import NhatKyDetail from './nhatKyThucTapDetail';
import { Link } from 'react-router-dom';
import {
  createNhatKy,
  deleteNhatKy,
  getAllNhatKy,
  updateNhatKy,
} from '@app/services/NhatKyThucTap/nhatKyThucTap.service';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import { URL } from '@url';
import ThemSuaSinhVien from '@containers/QuanLyDanhMuc/QuanLySinhVienTTTN/ThemSuaSinhVien';

function NhatKyManagernent({ isLoading, ...props }) {
  const [nhatky, setNhatKy] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    (async () => {
      await getDataNhatKy();
    })();
  }, []);

  async function getDataNhatKy(
    currentPage = nhatky.currentPage,
    pageSize = nhatky.pageSize,
    query = nhatky.query,
  ) {
    const apiResponse = await getAllNhatKy(currentPage, pageSize, query);
    if (apiResponse) {
      setNhatKy({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = nhatky.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    maSinhVien: data.ma_sinh_vien,
    congViec: data.cong_viec,
    ngay: data.ngay,
    diaDiem: data.dia_diem,
    ketQua: data.ket_qua,
    nhanXet: data.nhan_xet,
    trangThai: data.trang_thai,
  }));

  const columns = [
    columnIndex(nhatky.pageSize, nhatky.currentPage),

    {
      title: 'Tên sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      render: value => value?.ten_sinh_vien,
      width: 300,
    },
    {
      title: 'Ngày tháng',
      dataIndex: 'ngay',
      key: 'ngay',
      width: 300,
    },
    {
      title: 'Công việc',
      dataIndex: 'congViec',
      key: 'congViec',
      width: 300,
    },
    {
      title: 'Kết quả',
      dataIndex: 'ketQua',
      key: 'ketQua',
      width: 300,
    },
    {
      title: 'Nhận xét',
      dataIndex: 'nhanXet',
      key: 'nhanXet',
      width: 300,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 200,
    },
    {
      align: 'center',
      render: (value) => <ActionCell value={value} handleEdit={handleEdit} handleDelete={handleDelete}/>,
      width: 200,
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
    const apiResponse = await deleteNhatKy(userSelected._id);
    if (apiResponse) {
      getDataNhatKy();
      toast(CONSTANTS.SUCCESS, 'Xóa kế hoạch thành công');
    }
  }

  async function createAndModifyNhatKy(type, dataForm) {
    const { maSinhVien, ngay, diaDiem, congViec, ketQua, nhanXet, trangThai } = dataForm;
    const dataRequest = {
      ma_sinh_vien: maSinhVien,
      ngay: ngay,
      dia_diem: diaDiem,
      cong_viec: congViec,
      ket_qua: ketQua,
      nhan_xet: nhanXet,
      trang_thai: trangThai,
    };
    console.log('dataRequest',dataRequest);
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createNhatKy(dataRequest);
      if (apiResponse) {
        getDataNhatKy();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới kế hoạch thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateNhatKy(dataRequest);
      if (apiResponse) {
        const docs = nhatky.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setNhatKy(Object.assign({}, nhatky, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin kế hoạch thành công');
      }
    }
  }


  function handleChangePagination(current, pageSize) {
    getDataNhatKy(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = nhatky.currentPage;
  pagination.total = nhatky.totalDocs;
  pagination.pageSize = nhatky.pageSize;
  return (
    <div>
      {/*<Filter*/}
      {/*  dataSearch={[*/}
      {/*    { name: 'ma_sinh_vien', label: 'Sinh viên', type: CONSTANTS.TEXT },*/}
      {/*  ]}*/}
      {/*  handleFilter={(query) => getDataNhatKy(1, nhatky.pageSize, query)}/>*/}

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <NhatKyDetail
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyNhatKy}
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

export default (connect(mapStateToProps)(NhatKyManagernent));
