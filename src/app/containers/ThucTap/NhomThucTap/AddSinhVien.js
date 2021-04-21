import React, { useEffect, useState, useRef } from 'react';
import { Form, Checkbox, Modal, Table, Input, Button, Space } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import { getAllSinhVien } from '@app/services/SinhVienTTTN/sinhVienTTService';
import { columnIndex } from '@app/common/functionCommons';
import { SearchOutlined } from '@ant-design/icons';
import Filter from '@components/Filter';
import { getAllDKTT } from '@app/services/ThucTap/DKThucTap/dangkythuctapService';
import * as dkthuctap from '@app/store/ducks/dkthuctap.duck';

function AddSinhVien({ isLoading, isModalVisible, handleOk, handleCancel, userSelected, gvhd, dotTT, dkthuctapList, ...props }) {

  const [studentsData, setStudentsData] = useState([]);
  const [studentsSelectedId, setStudentsSelectedId] = useState([]);
  const [studentsSelected, setStudentsSelected] = useState([]);
  useEffect(() => {
    if (isModalVisible) {
      (async () => {
        await getStudentData();
      })();
    } else {
      setStudentsSelectedId([]);
      setStudentsSelected([]);
      setTimeout(() => {
        setStudentsData([]);
      }, 300);
    }
  }, [isModalVisible]);

  async function getStudentData() {
    console.log('teacher', props.teacher);
    console.log('address', props.address);
    console.log('detailStudentsList', props.detailStudentsList);

    const apiResponse = dkthuctapList.filter(item => {
      if (item.teacherId === props.teacher && item.diadiem_id === props.address) return item;
    });
    console.log('apiResponse', apiResponse);
    if (apiResponse) {
      let studentsIdList = [];
      props.detailStudentsList.forEach(item => {
        console.log(item);
        if (!item.isDeleted)
          studentsIdList = [...studentsIdList, item.tenSinhVien._id];
      });
      const filterer = apiResponse.filter(item => !studentsIdList.includes(item.sinhvien._id));
      console.log('filterer', filterer);
      setStudentsData(filterer);
    }
  }

  function handleSelectStudents(valueSelected) {
    let studentsListNew = [...studentsSelected];
    let studentsListIdNew = [...studentsSelectedId];

    if (studentsListIdNew.includes(valueSelected.tenSinhVien)) {
      const index = studentsListIdNew.indexOf(valueSelected.tenSinhVien);
      studentsListNew.splice(index, 1);
      studentsListIdNew.splice(index, 1);
    } else {
      studentsListNew = [...studentsListNew, valueSelected];
      studentsListIdNew = [...studentsListIdNew, valueSelected.tenSinhVien];
    }
    setStudentsSelected(studentsListNew);
    setStudentsSelectedId(studentsListIdNew);
  }

  function onFinish() {
    if (isLoading) return;
    handleOk(studentsSelected);
  }

  function handleChangePagination(current, pageSize) {
    getStudentData(current, pageSize);
  }

  const dataSource = studentsData.map((item, index) => ({
    key: item?._id,
    tenSinhVien: item?.sinhvien,
    maSinhVien: item?.sinhvien.ma_sinh_vien,
    so_tctl: item.so_tctl,
    diem_tbtl: item.diem_tbtl,
  }));

  const columns = [
    columnIndex(0, 1),
    {
      title: 'Mã sinh viên', dataIndex: 'maSinhVien', key: 'maSinhVien',
      width: 200,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'tenSinhVien',
      key: 'tenSinhVien',
      render: value => value?.ten_sinh_vien,
      width: 200,
    },
    {
      title: 'Số tín chỉ tích lũy',
      dataIndex: 'so_tctl',
      key: 'so_tctl',
      width: 200,
    },

    { title: 'Điểm TB tích lỹ', dataIndex: 'diem_tbtl', key: 'diem_tbtl', width: 200 },
    {
      align: 'center',
      render: (value, row) => <Checkbox
        checked={studentsSelectedId.includes(row.tenSinhVien)}
        onChange={() => handleSelectStudents(row)}/>,
      width: 80,
    },
  ];

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = studentsData.currentPage;
  pagination.total = studentsData.totalDocs;
  pagination.pageSize = studentsData.pageSize;

  if (!isModalVisible) return null;
  return (
    <Modal
      width='1000px' maskClosable={false}
      bodyStyle={{ paddingTop: '8px', paddingBottom: '8px' }}
      closeIcon={<i className='fa fa-times'/>}
      title='Chọn sinh viên'
      visible={isModalVisible} onCancel={isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={isLoading}
        isDisabledClose={isLoading}
        submitType={CONSTANTS.CONFIRM}
      />}
      forceRender
    >
      <Form id="formModal" size='default' onFinish={onFinish}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns}
               pagination={pagination}
               bordered/>
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { dkthuctapList } = store.dkthuctap;
  return { isLoading, dkthuctapList };
}

export default (connect(mapStateToProps)(AddSinhVien));

