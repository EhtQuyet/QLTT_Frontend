import React, { useEffect, useState } from 'react';
import { Popconfirm, Table, Tag } from 'antd';
import AddNewButton from '@AddNewButton';
// import ChiTietDotThucTap from './ChiTietDotThucTap';
import {
  createDanhSachThucTap,
  deleteDanhSachThucTap,
  getAllDanhSachThucTap,
  updateDanhSachThucTap,
  getDotthuctapByID,
} from '@app/services/ThucTap/danhsachthuctapService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, TRANG_THAI } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import * as lophoc from '@app/store/ducks/lophoc.duck';
import { PlusCircleOutlined, SendOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL } from '@url';

function DanhSachThucTap({ isLoading, namhocList, classmateList, ...props }) {
  const [danhsachthuctap, setDanhsachthuctap] = useState(PAGINATION_INIT);

  useEffect(() => {
    if (!namhocList?.length) {
      props.getNamHoc();
    }
    if (!namhocList?.length) {
      props.getClass();
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
      width: 200,
    },
    {
      title: 'Năm học',
      dataIndex: 'namHoc',
      key: 'namHoc',
      render: value => value?.nam_hoc,
      width: 150,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      key: 'thoiGianBatDau',
      render: value => value ? moment(value).format('DD/MM/YYYY') : '',
      width: 150,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      width: 300,
    },

    {
      align: 'center',
      render: (text, record, index) => {
        return <>
         <div className='mt-2'>
            <Link to={URL.MENU.DOT_THUC_TAP_ID.format(record._id)}>
              <Tag color='blue' className='tag-action'>
                <EyeOutlined/><span className='ml-1'>Chi tiết</span>
              </Tag>
            </Link>
            <Popconfirm
              title='Bạn có chắc chắn xóa đợt thực tập không?'
              onConfirm={() => handleDelete(record)}
              cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
              <Tag color='red' className='tag-action'>
                <DeleteOutlined/><span className='ml-1'>Xóa</span>
              </Tag>
            </Popconfirm>
          </div>
        </>;
      },
      width: 300
    },
  ];


  async function handleDelete(userSelected) {
    const apiResponse = await deleteDanhSachThucTap(userSelected._id);
    if (apiResponse) {
      getDataDanhSachThucTap();
      toast(CONSTANTS.SUCCESS, 'Xóa đợt thực tập thành công');
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
      <AddNewButton
        disabled={isLoading}
        linkTo={URL.MENU.DOT_THUC_TAP_ADD} label={'Tạo đợt thực tập'}
      />
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { namhocList } = store.namhoc;
  const { classmateList } = store.lophoc;
  return { isLoading, namhocList, classmateList };
}

export default (connect(mapStateToProps, { ...namhoc.actions, ...lophoc.actions })(DanhSachThucTap));
