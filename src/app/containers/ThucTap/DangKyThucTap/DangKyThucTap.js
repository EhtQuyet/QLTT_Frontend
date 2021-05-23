import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import CreateAndModify from './CreateAndModify';
import {
  createDotThucTap,
  deleteDotThucTap, getAllDotThucTap,
  getDKDotThucTap,
  updateDotThucTap,
} from '@app/services/ThucTap/DotThucTap/dotthuctapService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { DOT_THUC_TAP } from '../../../../constants/contans';
import { columnIndex, renderRowData, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import { Typography, Space, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { URL } from '@url';
import { Link } from 'react-router-dom';


function DangKyThucTap({ isLoading, namhocList, ...props }) {
  const [dangkythuctap, setDangKyThucTap] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    if (!props?.namhocList?.length) {
      props.getNamHoc();
    }
    (async () => {
      await getDataDotThucTap();
    })();
  }, []);

  async function getDataDotThucTap(
    currentPage = dangkythuctap.currentPage,
    pageSize = dangkythuctap.pageSize,
    query = dangkythuctap.query,
  ) {
    const apiResponse = await getDKDotThucTap(currentPage, pageSize, query);
    if (apiResponse) {
      setDangKyThucTap({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = dangkythuctap.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    namHoc: data.namhoc,
    ghiChu: data.ghi_chu,
    thoiGianBatDau: data.thoigian_batdau,
    thoiGianKetThuc: data.thoigian_ketthuc,
    dotThucTap: data.ten_dot,
    trangThai: data.trang_thai,
  }));

  const columns = [
    columnIndex(dangkythuctap.pageSize, dangkythuctap.currentPage),

    {
      title: 'Năm học',
      dataIndex: 'namHoc',
      render: value => value?.nam_hoc,
      width: 200,
    },
    {
      title: 'Tên đợt thực tập',
      dataIndex: 'dotThucTap',
      key: 'dotThucTap',
      width: 200,
    },
    {
      title: 'Thời gian thực tập',
      // dataIndex: 'thoiGianBatDau',
      render: (text, record, index) => <div>
        {renderRowData('Bắt đầu', record?.thoiGianBatDau ? moment(record.thoiGianBatDau).format('DD/MM/YYYY') : '', '70px')}
        {renderRowData('Kết thúc', record?.thoiGianKetThuc ? moment(record.thoiGianKetThuc).format('DD/MM/YYYY') : '', '70px')}
      </div>,
      align: 'center',
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      render: value => <>
        {value === DOT_THUC_TAP.DANG_MO ? <Tag color='green'>Đang mở</Tag>
          : value === DOT_THUC_TAP.DA_KHOA ? <Tag color='gold'> Đã khóa</Tag>
            : <Tag color='red'>Đã kết thúc</Tag>}
      </>,
      width: 200,
    },
    {
      align: 'center',
      render: (value) => <> {

        value.trangThai === DOT_THUC_TAP.DANG_MO ?
          <Link to={URL.MENU.DANG_KY_THUC_TAP_CHI_TIET_ID.format(value._id)}>
            <Tag color='cyan' className='tag-action'>
              <EditOutlined/><span className='ml-1'>Đăng ký</span>
            </Tag>
          </Link>
          : <></>
      }</>,
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
    const apiResponse = await deleteDotThucTap(userSelected._id);
    if (apiResponse) {
      getDataDotThucTap();
      toast(CONSTANTS.SUCCESS, 'Xóa đợt thực tập thành công');
    }
  }

// function create or modify
  async function createAndModifyDotThucTap(type, dataForm) {
    const { namHoc, ghiChu, thoiGianBatDau, thoiGianKetThuc, dotThucTap, trangThai } = dataForm;
    const dataRequest = {
      ten_dot: dotThucTap,
      thoigian_batdau: thoiGianBatDau ? thoiGianBatDau.toString() : null,
      thoigian_ketthuc: thoiGianKetThuc ? thoiGianKetThuc.toString() : null,
      namhoc: namHoc,
      ghi_chu: ghiChu,
      trang_thai: trangThai,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createDotThucTap(dataRequest);
      if (apiResponse) {
        getDataDotThucTap();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới đợt thực tập thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateDotThucTap(dataRequest);
      if (apiResponse) {
        const docs = dangkythuctap.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setDangKyThucTap(Object.assign({}, dangkythuctap, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin đợt thực thành công');
      }
    }
  }


  function handleChangePagination(current, pageSize) {
    getDataDotThucTap(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = dangkythuctap.currentPage;
  pagination.total = dangkythuctap.totalDocs;
  pagination.pageSize = dangkythuctap.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_dot', label: 'Tên đợt thực tập', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataDotThucTap(1, dangkythuctap.pageSize, query)}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      {/*<CreateAndModify*/}
      {/*  type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}*/}
      {/*  isModalVisible={state.isShowModal}*/}
      {/*  handleOk={createAndModifyDotThucTap}*/}
      {/*  handleCancel={() => handleShowModal(false)}*/}
      {/*  userSelected={state.userSelected}*/}
      {/*/>*/}
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { namhocList } = store.namhoc;
  return { isLoading, namhocList };
}

export default (connect(mapStateToProps, { ...namhoc.actions })(DangKyThucTap));
