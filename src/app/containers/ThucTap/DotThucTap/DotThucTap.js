import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import CreateAndModify from './CreateAndModify';
import {
  createDotThucTap,
  deleteDotThucTap, getAllDotThucTap,
  updateDotThucTap,
} from '@app/services/ThucTap/dotthuctapService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { DOT_THUC_TAP } from '../../../../constants/contans';
import { columnIndex, renderRowData, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import { Typography, Space } from 'antd';

const { Text, Link } = Typography;

function DotThucTap({ isLoading, namhocList, ...props }) {
  const [dotthuctap, setDotthuctap] = useState(PAGINATION_INIT);
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
    currentPage = dotthuctap.currentPage,
    pageSize = dotthuctap.pageSize,
    query = dotthuctap.query,
  ) {
    const apiResponse = await getAllDotThucTap(currentPage, pageSize, query);
    if (apiResponse) {
      setDotthuctap({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = dotthuctap.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    namHoc: data.namhoc,
    ghiChu: data.ghi_chu,
    thoiGianBatDau: data.thoigian_batdau,
    thoiGianKetThuc: data.thoigian_ketthuc,
    dotThucTap: data.ten_dot,
    trangThai: data.trang_thai
  }));

  const columns = [
    columnIndex(dotthuctap.pageSize, dotthuctap.currentPage),

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
        {value === DOT_THUC_TAP.DANG_MO ? <Text type="success">Đang mở</Text>
          : value === DOT_THUC_TAP.DA_KHOA ? <Text type="warning"> Đã khóa</Text>
          : <Text type="danger">Đã kết thúc</Text>}
      </>,
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
        const docs = dotthuctap.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setDotthuctap(Object.assign({}, dotthuctap, { docs }));
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
  pagination.current = dotthuctap.currentPage;
  pagination.total = dotthuctap.totalDocs;
  pagination.pageSize = dotthuctap.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_dot', label: 'Tên đợt thực tập', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataDotThucTap(1, dotthuctap.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <CreateAndModify
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyDotThucTap}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { namhocList } = store.namhoc;
  return { isLoading, namhocList };
}

export default (connect(mapStateToProps, { ...namhoc.actions })(DotThucTap));
