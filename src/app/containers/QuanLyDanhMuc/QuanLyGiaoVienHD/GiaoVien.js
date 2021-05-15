import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import ThemSuaGiaoVien from './ThemSuaGiaoVien';
import {
  createGiaoVien,
  deleteGiaoVien,
  getAllGiaoVien,
  updateGiaoVien,
} from '@app/services/GiaoVienHD/giaoVienService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, renderRowData, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { connect } from 'react-redux';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import * as giaovien from '@app/store/ducks/giaovien.duck';
import * as bomon from '@app/store/ducks/bomon.duck';

function GiaoVien({ isLoading, bomonList, teacherList, ...props }) {
  const [giaovien, setGiaovien] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    if (!props?.bomonList?.length) {
      props.getBoMon();
    }
    if (!props?.teacherList?.length) {
      props.getTeacher();
    }
    (async () => {
      await getDataGiaoVien();
    })();
  }, []);

  async function getDataGiaoVien(
    currentPage = giaovien.currentPage,
    pageSize = giaovien.pageSize,
    query = giaovien.query,
  ) {
    const apiResponse = await getAllGiaoVien(currentPage, pageSize, query);
    if (apiResponse) {
      setGiaovien({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = giaovien.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    tenGiaoVien: data.ten_giao_vien,
    sdt: data.sdt,
    email: data.email,
    ngaySinh: data.ngay_sinh,
    diaChi: data.dia_chi,
    hocVi: data.hoc_vi,
    maGiaoVien: data.ma_giao_vien,
    maNgach: data.ma_ngach,
    gioiTinh: data.gioi_tinh,
    boMon: data.ma_bo_mon,
  }));

  const columns = [
    columnIndex(giaovien.pageSize, giaovien.currentPage),
    {
      title: 'Mã giảng viên',
      dataIndex: 'maGiaoVien',
      key: 'maGiaoVien',
      width: 200,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'tenGiaoVien',
      key: 'tenGiaoVien',
      render: (text, record, index) => <div>
        {renderRowData('Họ và tên', record?.tenGiaoVien, '70px')}
        {renderRowData('Ngày sinh', record?.ngaySinh ? moment(record.ngaySinh).format('DD/MM/YYYY') : '', '70px')}
        {renderRowData('Giới tính', record?.gioiTinh, '70px')}
      </div>,
      width: 300,
    },

    // {
    //   title: 'Số điện thoại',
    //   dataIndex: 'sdt',
    //   key: 'sdt',
    //   width: 200,
    // },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 300,
    },
    {
      title: 'Bộ môn',
      dataIndex: 'boMon',
      key: 'boMon',
      render: value => value?.ten_bo_mon,
      width: 300,
    },
    {
      title: 'Học vị',
      dataIndex: 'hocVi',
      key: 'hocVi',
      width: 200,
    },
    // {
    //   title: 'Địa chỉ',
    //   dataIndex: 'diaChi',
    //   key: 'diaChi',
    //   width: 200,
    // },
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
    const apiResponse = await deleteGiaoVien(userSelected._id);
    if (apiResponse) {
      getDataGiaoVien();
      toast(CONSTANTS.SUCCESS, 'Xóa giảng viên thành công');
    }
  }

// function create or modify
  async function createAndModifyGiaoVien(type, dataForm) {
    const { tenGiaoVien, hocVi, ngachGiangVien, ngaySinh, maGiaoVien, diaChi, sdt, email, gioiTinh, boMon } = dataForm;
    const dataRequest = {
      ten_giao_vien: tenGiaoVien,
      hoc_vi: hocVi,
      ngay_sinh: ngaySinh ? ngaySinh.toString() : null,
      ma_giao_vien: maGiaoVien,
      ma_ngach: ngachGiangVien,
      ma_bo_mon: boMon,
      dia_chi: diaChi,
      sdt: sdt,
      email: email,
      gioi_tinh: gioiTinh,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createGiaoVien(dataRequest);
      if (apiResponse) {
        getDataGiaoVien();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới giảng viên thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateGiaoVien(dataRequest);
      if (apiResponse) {
        const docs = giaovien.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setGiaovien(Object.assign({}, giaovien, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin giảng viên thành công');
      }
    }
  }

// update store redux
  function updateStoreTeacher(type, dataResponse) {
    if (!type || !dataResponse || !teacherList.length) return;

    const dataChanged = {
      _id: dataResponse._id,
      name: dataResponse.ten_giao_vien,
    };
    let teacherListUpdated = [];
    if (type === CONSTANTS.UPDATE) {
      teacherListUpdated = teacherList.map(teacher => {
        if (teacher._id === dataChanged._id) {
          return dataChanged;
        }
        return teacher;
      });
    }

    if (type === CONSTANTS.DELETE) {
      teacherListUpdated = teacherList.filter(teacher => {
        return teacher._id !== dataChanged._id;
      });
    }

    if (type === CONSTANTS.CREATE) {
      teacherListUpdated = [...teacherList, dataChanged];
    }

    props.setTeacher(teacherListUpdated);
  }

  function handleChangePagination(current, pageSize) {
    getDataGiaoVien(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = giaovien.currentPage;
  pagination.total = giaovien.totalDocs;
  pagination.pageSize = giaovien.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_giao_vien', label: 'Tên giảng viên', type: CONSTANTS.TEXT },
          { name: 'ma_giao_vien', label: 'Mã giảng viên ', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataGiaoVien(1, giaovien.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <ThemSuaGiaoVien
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyGiaoVien}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { bomonList } = store.bomon;
  const { teacherList } = store.giaovien;
  return { isLoading, bomonList, teacherList };
}

export default (connect(mapStateToProps, { ...bomon.actions, ...giaovien.actions })(GiaoVien));
