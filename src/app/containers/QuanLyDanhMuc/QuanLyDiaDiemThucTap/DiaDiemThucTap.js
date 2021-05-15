import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import ThemSuaDiaDiemThucTap from './ThemSuaDiaDiemThucTap';
import {
  createDiaDiemThucTap,
  deleteDiaDiemThucTap,
  getAllDiaDiemThucTap,
  updateDiaDiemThucTap,
} from '@app/services/DiaDiemThucTap/diadiemthuctapService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import { DIA_DIEM_THUC_TAP } from '@src/constants/contans';
import { Typography, Space, Tag } from 'antd';
const { Text, Link } = Typography;

function DiaDiemThucTap({ isLoading, ...props }) {
  const [diadiemthuctap, setDiadiemthuctap] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {

    (async () => {
      await getDataDiaDiemThucTap();
    })();
  }, []);

  async function getDataDiaDiemThucTap(
    currentPage = diadiemthuctap.currentPage,
    pageSize = diadiemthuctap.pageSize,
    query = diadiemthuctap.query,
  ) {
    const apiResponse = await getAllDiaDiemThucTap(currentPage, pageSize, query);
    if (apiResponse) {
      setDiadiemthuctap({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = diadiemthuctap.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    tenDiaDiemThucTap: data.ten_dia_diem,
    diaChi: data.dia_chi,
    nguoiDaiDien: data.nguoi_dai_dien,
    dienThoai: data.dien_thoai,
    trangThai: data.trang_thai,
  }));

  const columns = [
    columnIndex(diadiemthuctap.pageSize, diadiemthuctap.currentPage),

    {
      title: 'Tên địa điểm',
      dataIndex: 'tenDiaDiemThucTap',
      key: 'tenDiaDiemThucTap',
      width: 300,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      width: 300,
    },
    {
      title: 'Thông tin',
      dataIndex: 'nguoiDaiDien',
      key: 'nguoiDaiDien',
      render: (text, record, index) => <div>
        Giám đốc: <b>{record?.nguoiDaiDien}</b><br/>
        Điện thoại: <b>{record?.dienThoai}</b><br/>
      </div>,
      width: 300,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: value => <>
        {value === DIA_DIEM_THUC_TAP.DA_XAC_NHAN ? <Tag color='green'>Đã xác nhận</Tag>
          : value === DIA_DIEM_THUC_TAP.TU_CHOI ? <Tag color='red'>Từ chối</Tag> : <Tag color='gold'> Chưa xác nhận</Tag>
            }
      </>,
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
    const apiResponse = await deleteDiaDiemThucTap(userSelected._id);
    if (apiResponse) {
      getDataDiaDiemThucTap();
      toast(CONSTANTS.SUCCESS, 'Xóa địa điểm thành công');
    }
  }

// function create or modify
  async function createAndModifyDiaDiemThucTap(type, dataForm) {
    const { tenDiaDiemThucTap, diaChi, nguoiDaiDien, dienThoai, trangThai } = dataForm;
    const dataRequest = {
      ten_dia_diem: tenDiaDiemThucTap,
      dia_chi: diaChi,
      nguoi_dai_dien: nguoiDaiDien,
      dien_thoai: dienThoai,
      trang_thai: trangThai,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createDiaDiemThucTap(dataRequest);
      if (apiResponse) {
        getDataDiaDiemThucTap();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới địa điểm thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateDiaDiemThucTap(dataRequest);
      if (apiResponse) {
        const docs = diadiemthuctap.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setDiadiemthuctap(Object.assign({}, diadiemthuctap, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin địa điểm thành công');
      }
    }
  }


  function handleChangePagination(current, pageSize) {
    getDataDiaDiemThucTap(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = diadiemthuctap.currentPage;
  pagination.total = diadiemthuctap.totalDocs;
  pagination.pageSize = diadiemthuctap.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_dia_diem', label: 'Tên địa điểm', type: CONSTANTS.TEXT },
          { name: 'dia_chi', label: 'Địa chỉ ', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataDiaDiemThucTap(1, diadiemthuctap.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <ThemSuaDiaDiemThucTap
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyDiaDiemThucTap}
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

export default (connect(mapStateToProps)(DiaDiemThucTap));
