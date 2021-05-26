import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import {  getDKDotThucTap, getAllDotThucTap} from '@app/services/ThucTap/DotThucTap/dotthuctapService';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { DOT_THUC_TAP, ROLE } from '../../../constants/contans';
import { columnIndex, renderRowData, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import { Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { URL } from '@url';
import { Link } from 'react-router-dom';


function DotThucTap({ isLoading, myInfo, namhocList, ...props }) {
  const [dangkythuctap, setDangKyThucTap] = useState([]);
  const giangVienId =  props.maGiangVien;
  console.log('giangVienId',giangVienId);
  useEffect(() => {
    if (!props?.namhocList?.length) {
      props.getNamHoc();
    }
    (async () => {
      await getDataDotThucTap();
    })();
  }, []);
  async function getDataDotThucTap() {
    const apiResponse = await getAllDotThucTap(1,0,{trang_thai: DOT_THUC_TAP.DA_KHOA});
    if (apiResponse) {
      setDangKyThucTap(apiResponse);
    }
  }

  const dataSource = dangkythuctap.docs?.map((data, index) => ({
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
    columnIndex(10, 1),

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
      render: (value) =>

        <Link to={URL.MENU.KIEM_DUYET_NHAT_KY_ID.format(value._id)}>
          <Tag color='cyan' className='tag-action'>
            <EyeOutlined/><span className='ml-1'>Chi tiết</span>
          </Tag>
        </Link>,
      width: 300,
    },
  ];


  const isAdmin = myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);


  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_dot', label: 'Tên đợt thực tập', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataDotThucTap(1, dangkythuctap.pageSize, query)}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={true} bordered/>
      </Loading>
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;

  const { myInfo } = store.user;
  const { namhocList } = store.namhoc;
  return { isLoading, namhocList, myInfo };
}

export default (connect(mapStateToProps, { ...namhoc.actions })(DotThucTap));
