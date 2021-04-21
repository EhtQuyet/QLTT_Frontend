import React, { useEffect, useState } from 'react';
import { Table, Button} from 'antd';
import AddNewButton from '@AddNewButton';
import ThemSuaSinhVien from './ThemSuaSinhVien';
import ThemFile from './ThemFile';
import {
  createSinhVien,
  deleteSinhVien,
  getAllSinhVien,
  updateSinhVien,
} from '@app/services/SinhVienTTTN/sinhVienTTService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, renderRowData, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as lophoc from '@app/store/ducks/lophoc.duck';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { URL } from '@url';

function SinhVien({ isLoading, classmateList, ...props }) {
  const [sinhvien, setSinhVien] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    if (!props?.classmateList?.length) {
      props.getClass();
    }
    (async () => {
      await getDataSinhVien();
    })();
  }, []);

  async function getDataSinhVien(
    currentPage = sinhvien.currentPage,
    pageSize = sinhvien.pageSize,
    query = sinhvien.query,
  ) {
    const apiResponse = await getAllSinhVien(currentPage, pageSize, query);
    if (apiResponse) {
      setSinhVien({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = sinhvien.docs.map((data, index) => ({
    key: data._id,
    tenSinhVien: data.ten_sinh_vien,
    sdt: data.sdt,
    email: data.email,
    ngaySinh: data.ngay_sinh,
    diaChi: data.dia_chi,
    maLop: data.ma_lop_hoc,
    maSinhVien: data.ma_sinh_vien,
    gioiTinh: data.gioi_tinh,
    _id: data._id,
  }));

  const columns = [
    columnIndex(sinhvien.pageSize, sinhvien.currentPage),
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 200,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'tenSinhVien',
      key: 'tenSinhVien',
      render: (text, record, index) => <div>
        {renderRowData('Họ và tên', record?.tenSinhVien, '70px')}
        {renderRowData('Ngày sinh', record?.ngaySinh ? moment(record.ngaySinh).format('DD/MM/YYYY') : '', '70px')}
        {renderRowData('Giới tính', record?.gioiTinh, '70px')}
      </div>,
      width: 300,
    },
    {
      title: 'Mã lớp',
      dataIndex: 'maLop',
      key: 'maLop',
      render: value => value?.ten_lop_hoc,
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 300,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'sdt',
      key: 'sdt',
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
    const apiResponse = await deleteSinhVien(userSelected._id);
    if (apiResponse) {
      getDataSinhVien();
      toast(CONSTANTS.SUCCESS, 'Xóa sinh viên thành công');
    }
  }


  async function createAndModifySinhVien(type, dataForm) {

    const dataRequest = {
      ten_sinh_vien: dataForm.tenSinhVien,
      ma_lop_hoc: dataForm.maLop,
      ngay_sinh: dataForm.ngaySinh ? dataForm.ngaySinh.toString() : null,
      ma_sinh_vien: dataForm.maSinhVien,
      dia_chi: dataForm.diaChi,
      sdt: dataForm.sdt,
      email: dataForm.email,
      gioi_tinh: dataForm.gioiTinh,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createSinhVien(dataRequest);
      if (apiResponse) {
        getDataSinhVien();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới sinh viên thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateSinhVien(dataRequest);
      if (apiResponse) {
        const docs = sinhvien.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setSinhVien(Object.assign({}, sinhvien, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin sinh viên thành công');
      }
    }
  }


  function handleChangePagination(current, pageSize) {
    getDataSinhVien(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = sinhvien.currentPage;
  pagination.total = sinhvien.totalDocs;
  pagination.pageSize = sinhvien.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_sinh_vien', label: 'Tên sinh viên', type: CONSTANTS.TEXT },
          { name: 'ma_sinh_vien', label: 'Mã sinh viên ', type: CONSTANTS.TEXT },
          {
            name: 'ma_lop_hoc', label: 'Lớp ', type: CONSTANTS.SELECT,
            options: { data: classmateList, valueString: '_id', labelString: 'name'}
          },
        ]}
        handleFilter={(query) => getDataSinhVien(1, sinhvien.pageSize, query)}/>

    <Link to={URL.FILE_SINH_VIEN} >
      <Button size='small' className='ant-btn-purple float-right mr-2' style={{marginLeft: '7px', marginRight: '7px'}}>
        <i className='fa fa-upload mr-1'/>Tải lên
      </Button>
    </Link>
      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>

      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <ThemSuaSinhVien
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifySinhVien}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { classmateList } = store.lophoc;
  return { isLoading, classmateList };
}
export default (connect(mapStateToProps, { ...lophoc.actions})(SinhVien));
