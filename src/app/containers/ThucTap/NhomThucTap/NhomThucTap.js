import { getAllNhomThucTap, deletenhomThucTapById } from '@app/services/ThucTap/NhomThucTap/nhomThucTapService';
import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { URL } from '@url';
import { CONSTANTS, PAGINATION_INIT, TRANG_THAI_LABEL } from '@constants';
import { connect } from 'react-redux';
import { columnIndex, formatDateTime, toast } from '@app/common/functionCommons';
import ActionCell from '@components/ActionCell';
import Loading from '@components/Loading';
import AddNewButton from '@AddNewButton';
import { getAllGiaoVien } from '@app/services/GiaoVienHD/giaoVienService';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import * as sinhvien from '@app/store/ducks/sinhvien.duck';
import * as dotthuctap from '@app/store/ducks/dotthuctap.duck';
import * as diadiem from '@app/store/ducks/diadiem.duck';
import * as giaovien from '@app/store/ducks/giaovien.duck';
import * as dkthuctap from '@app/store/ducks/dkthuctap.duck';

function NhomThucTap({ isLoading, namhocList, sinhVienList,
                       dotthuctapList, diadiemList, teacherList, dkthuctapList, ...props }) {

  const [listAllRecord, setAllRecord] = useState(PAGINATION_INIT);

  useEffect(() => {
    (async () => {
      await getDataAllRecord();
    })();
  }, []);

  useEffect(() => {
    if (!props?.namhocList?.length) {
      props.getNamHoc();
    }
    if (!props?.sinhVienList?.length) {
      props.getSinhVien();
    }
    if (!props?.dotthuctapList?.length) {
      props.getDotThucTap();
    }
    if (!props?.diadiemList?.length) {
      props.getDiaDiem();
    }
    if (!props?.teacherList?.length) {
      props.getTeacher();
    }
    if (!props?.dkthuctapList?.length) {
      props.getDkThucTap();
    }
  }, []);

  async function getDataAllRecord() {
    const apiResponse = await getAllNhomThucTap();
    if (apiResponse) {
      setAllRecord(apiResponse);
    }
  }

  const dataSource = listAllRecord.docs.map((item, index) => {
    item.key = item._id;
    item.dotThucTap = item.id_dotthuctap;
    item.giangVien = item.id_giangvien;
    item.diaDiem = item.dia_diem;
    item.namHoc = item.nam_hoc;
    return item;
  });

  const columns = [
    columnIndex(10, 1),
    {
      align: 'center',
      title: 'Năm học',
      dataIndex: 'namHoc',
      key: 'namHoc',
      render: (text) => <div style={{ textAlign: 'left' }}>{text?.nam_hoc}</div>,
      width: 200,
    },
    {
      align: 'center',
      title: 'Đợt thực tập',
      dataIndex: 'dotThucTap',
      key: 'dotThucTap',
      render: (text) => <div style={{ textAlign: 'left' }}>{text?.ten_dot}</div>,
      width: 200,
    },
    {
      align: 'center',
      title: 'Giảng viên hướng dẫn',
      dataIndex: 'giangVien',
      key: 'giangVien',
      render: (text) => <div style={{ textAlign: 'left' }}>{text?.ten_giao_vien}</div>,
      width: 200,
    },
    {
      align: 'center',
      title: 'Địa điểm',
      dataIndex: 'diaDiem',
      key: 'diaDiem',
      render: (text) => <div style={{ textAlign: 'left' }}>{text?.ten_dia_diem}</div>,
      width: 200,
    },
    {
      align: 'center',
      render: (text, record, index) => <>
        <ActionCell
          value={record}
          disabledDelete={isLoading}
          linkToEdit={URL.MENU.NHOM_THUC_TAP_CHI_TIET_ID.format(record._id)}
          handleDelete={handleDelete}
        />
      </>,
      width: 200,
    },
  ];

  async function handleDelete(userSelected) {
    const apiResponse = await deletenhomThucTapById(userSelected._id);
    if (apiResponse) {
      getDataAllRecord();
      toast(CONSTANTS.SUCCESS, 'Xóa nhóm thực tập thành công');
    }
  }

  return (
    <div>
      <AddNewButton
        disabled={isLoading}
        linkTo={URL.MENU.ADD_NHOM_THUC_TAP} label={'Thêm nhóm thực tập'}
      />
      <Loading active={isLoading}>
        <Table bordered size='small'
               dataSource={dataSource}
               columns={columns}
               expandable={{
                 expandedRowRender: (record) => {
                   console.log('record', record);
                 },
               }}
               scroll={{ x: 'max-content' }}
        />
      </Loading>
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { teacherList } = store.giaovien;
  const { sinhVienList } = store.sinhvien;
  const { namhocList } = store.namhoc;
  const { diadiemList } = store.diadiem;
  const { dotthuctapList } = store.dotthuctap;
  const { dkthuctapList } = store.dkthuctap;

  return { isLoading, dotthuctapList, diadiemList, namhocList, sinhVienList, teacherList, dkthuctapList };
}

const actions = {
  ...giaovien.actions,
  ...sinhvien.actions,
  ...namhoc.actions,
  ...diadiem.actions,
  ...dotthuctap.actions,
  ...dkthuctap.actions,
}
export default (connect(mapStateToProps, actions)(NhomThucTap));
