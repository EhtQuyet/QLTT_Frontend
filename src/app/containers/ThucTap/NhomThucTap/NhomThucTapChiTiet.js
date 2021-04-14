import {
  createNhomThucTap,
  getNhomThucTapById,
  updateNhomThucTap,
} from '@app/services/ThucTap/NhomThucTap/nhomThucTapService';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { debounce } from 'lodash';
import { Button, Divider, Form, Input, InputNumber, Popconfirm, Row, Col, Select, Switch, Table, Tooltip } from 'antd';
import { PlusCircleOutlined, SaveFilled } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { CONSTANTS, RULES, TOAST_MESSAGE, TRANG_THAI } from '@constants';
import { URL } from '@url';
import AddSinhVien from './AddSinhVien';
import ActionCell from '@components/ActionCell';
import CustomSkeleton from '@components/CustomSkeleton';
import { columnIndex, toast } from '@app/common/functionCommons';
import { getAllSinhVien } from '@app/services/SinhVienTTTN/sinhVienTTService';
import { getAllDotThucTap } from '@app/services/ThucTap/DotThucTap/dotthuctapService';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import * as sinhvien from '@app/store/ducks/sinhvien.duck';
import * as dotthuctap from '@app/store/ducks/dotthuctap.duck';
import * as diadiem from '@app/store/ducks/diadiem.duck';
import * as giaovien from '@app/store/ducks/giaovien.duck';
import * as dkthuctap from '@app/store/ducks/dkthuctap.duck';

import Loading from '@components/Loading';
import Dropzone from 'react-dropzone';


function NhomThucTapChiTiet({ isLoading, namhocList, sinhVienList,
                              dotthuctapList, diadiemList, teacherList, dkthuctapList, ...props }) {

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const recordId = useParams()?.id;

  const [form] = Form.useForm();
  const [isFormEdited, setFormEdited] = useState(false);
  const [detailStudentsList, setDetailStudentsList] = useState([]);
  const [isShowModal, toggleModal] = useState(false);
  const [isFinish, setFinish] = useState(false);
  const [gvId, setGVId] = useState(null);
  const [dotTTId, setDotTTId] = useState(null);
  const [dotThucTap, setDotThucTap] = useState([]);

  const [stateUpload, setStateUpload] = useState(false);

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
  console.log('dkthuctapList', dkthuctapList);


  useEffect(() => {
    (async () => {
      if (recordId) {
        await getDataRecord();
      } else {
      }
    })();
  }, []);

  async function getDataRecord() {
    const apiResponse = await getNhomThucTapById(recordId);
    if (apiResponse) {
      const namHoc = { value: apiResponse.nam_hoc._id, label: apiResponse.nam_hoc.nam_hoc };
      const diaDiem = { value: apiResponse.dia_diem._id, label: apiResponse.dia_diem.ten_dia_diem };
      const dotThucTap = { value: apiResponse.id_dotthuctap._id, label: apiResponse.id_dotthuctap.ten_dot };
      const giangVien = { value: apiResponse.id_giangvien._id, label: apiResponse.id_giangvien.ten_giao_vien };
      const truongNhom = { value: apiResponse.id_nhomtruong._id, label: apiResponse.id_nhomtruong.ten_sinh_vien };
      await form.setFieldsValue({
        namHoc, diaDiem, dotThucTap, truongNhom,
      });
      await handleChangeGiangVien(giangVien);
      await handleChangeNamHoc(namHoc);
      handleSetStudentsDetail(apiResponse);
      // setFinish(apiResponse.trang_thai === TRANG_THAI.THUC_HIEN_THANH_CONG);
    }
  }

  async function handleSetStudentsDetail(apiResponse) {
    // const { chitiet } = apiResponse;
    // if (!Array.isArray(chitiet)) return;
    //
    // const sinhvienObj = {};
    //
    // let studentIn = '';
    // chitiet.forEach(detail => studentIn += `&id_sinhvien=${detail?.id_sinhvien?._id}`);
    // const query = { idDonvi: `${form.getFieldsValue()?.donVi.value}${studentIn}` };
    // const inventoryResponse = await getInventoryByUnit(query);
    // inventoryResponse.forEach(item => inventoryObj[item?.id_vattu?._id] = item?.tonkho_dauky);
    //
    //
    // let listDataDetail = chitiet.map(detail => {
    //   const vatTuId = detail?.id_vattu?._id;
    //   return {
    //     key: detail?._id,
    //     _id: detail?._id,
    //     vatTuId,
    //     tenVatTu: detail?.id_vattu?.ten_vat_tu,
    //     serial: detail?.id_vattu?.serial,
    //     soLo: detail?.id_vattu?.so_lo,
    //     quanLyTheoSerial: detail?.id_vattu?.id_danh_diem?.quan_ly_theo_serial,
    //     tinhTrangId: detail?.id_tinhtrang,
    //     ghiChu: detail?.ghichu,
    //     soLuong: detail?.soluong,
    //     isDeleted: detail?.is_deleted,
    //     tonKho: inventoryObj[vatTuId],
    //   };
    // });
    // setDetailStudentsList(listDataDetail);
  }

  async function handleChangeGiangVien(giangVienSelected, resetStudentsList = false) {
    if (!giangVienSelected?.value) return;
  }

  async function handleChangeNamHoc(namhocSelected) {
    if (!namhocSelected) return;
    const apiResponse = await getAllDotThucTap(1, 0, { namhoc: namhocSelected ? namhocSelected : '' });
  }

  async function handleSaveData() {
    console.log('Q');
  }


  async function handleChangeDetail(key, value, index) {
    const studentsNew = [...detailStudentsList];
    studentsNew[index][key] = value;
    studentsNew[index].notEdited = false;

    setDetailStudentsList(studentsNew);
    if (!isFormEdited) {
      setFormEdited(true);
    }
  }

  function handleDeleteRow(index) {
    const studentsNew = detailStudentsList.map((studentsItem, studentsIndex) => {
      if (studentsIndex === index) {
        studentsItem.isDeleted = true;
      }
      return studentsItem;
    });
    setDetailStudentsList(studentsNew);
    if (!isFormEdited) {
      setFormEdited(true);
    }
  }


  function formatCellAction(value, row, index) {
    return <ActionCell
      value={row} labelDelete={null} confirmDelete={false}
      allowEdit={false}
      disabledDelete={isLoading  || !row.tenSinhVien}
      handleDelete={() => handleDeleteRow(row.keyIndex)}
    />;
  }

  const columns = [
    { title: 'Mã sinh viên', dataIndex: 'maSinhVien', width: 200 },
    { title: 'Tên sinh viên', dataIndex: 'tenSinhVien', render: value => value?.ten_sinh_vien, width: 200 },
    { title: 'Tín chỉ tích lũy', dataIndex: 'so_tctl', width: 200 },
    { title: 'Điểm TB tích lũy', dataIndex: 'diem_tbtl', width: 200 },
    { align: 'center', render: formatCellAction, width: 80 },
  ];

  let dataSource = [];
  detailStudentsList.forEach((item, index) => {
    if (!item.isDeleted) {
      const source = Object.assign({}, item);
      source.keyIndex = index;
      dataSource = [...dataSource, source];
    }
  });

  async function onValuesChange(changedValues, allValues) {
    if (changedValues.namHoc) {
      await handleChangeNamHoc(changedValues.namHoc);
    }
    if (changedValues.giangVien) {
      setGVId(changedValues.giangVien);
    }
    if (changedValues.dotThucTap) {
      setDotTTId(changedValues.dotThucTap);
    }
    if (!isFormEdited) {
      setFormEdited(true);
    }
  }

  function addGroupStudent(studentsListSelected) {
    let detailGroupStudentNew = [...detailStudentsList];

    studentsListSelected.forEach(students => {
      const dataPush = {
        isDeleted: false,
        key: detailGroupStudentNew.length,
        notEdited: true,
        maSinhVien: students.maSinhVien,
        tenSinhVien: students.tenSinhVien,
        so_tctl: students.so_tctl,
        diem_tbtl: students.diem_tbtl,
      };

      detailGroupStudentNew = [...detailGroupStudentNew, dataPush];
    });
    console.log('detailGroupStudentNew', detailGroupStudentNew);
    setDetailStudentsList(detailGroupStudentNew);
    toggleModal(false);
    if (!isFormEdited) {
      setFormEdited(true);
    }
  }

  // console.log(form.getFieldsValue()?.giangVien);
  return (
    <>
      <Form size='small' form={form} onFinish={handleSaveData} scrollToFirstError
            onValuesChange={onValuesChange}>
        <Row>
          <CustomSkeleton
            label="Năm học" name="namHoc"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24, lg: 15 }}
            layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 } }}

            rules={[RULES.REQUIRED]}
            options={{ data: namhocList, valueString: '_id', labelString: 'name' }}
            showSearch
            disabled={isLoading}
            showInputLabel={isFinish}
            labelLeft
            labelInValue
            fullLine
          />
          <CustomSkeleton
            label="Đợt thực tập" name="dotThucTap"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24, lg: 15 }}
            layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 } }}
            rules={[RULES.REQUIRED]}
            options={{ data: dotthuctapList, valueString: '_id', labelString: 'name' }}
            showSearch
            disabled={isLoading}
            showInputLabel={isFinish}
            labelLeft
            labelInValue
            fullLine
          />
          <CustomSkeleton
            label="Giảng viên hướng dẫn" name="giangVien"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24, lg: 15 }}
            layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 } }}
            rules={[RULES.REQUIRED]}
            options={{ data: teacherList, valueString: '_id', labelString: 'name' }}
            // onChange={(giangvienSelected) => handleChangeGiangVien(giangvienSelected)}
            showSearch
            disabled={isLoading}
            showInputLabel={isFinish}
            labelLeft
            labelInValue
            fullLine
          />
          <CustomSkeleton
            label='Địa điểm'
            name="diaDiem"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24, lg: 15 }}
            layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 } }}
            rules={[RULES.REQUIRED]}
            options={{ data: diadiemList, valueString: '_id', labelString: 'name' }}
            disabled={isLoading}
            showInputLabel={isFinish}
            labelLeft/>
          <CustomSkeleton
            label='Trưởng nhóm'
            name="truongNhom"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24, lg: 15 }}
            layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 } }}
            rules={[RULES.REQUIRED]}
            options={{ data: sinhVienList, valueString: '_id', labelString: 'namecode' }}
            disabled={isLoading}
            showInputLabel={isFinish}
            labelLeft/>

        </Row>
        <Divider orientation="left" plain={false} className='m-0'>
          {'Danh sách sinh viên nhóm'}
        </Divider>
        <div className='clearfix mb-3'>
          <Button
            className='float-right'
            type="primary"
            size='small'
            icon={<i className='fa fa-plus mr-1'/>}
            onClick={() => toggleModal(true)}
            disabled={isLoading || !form.getFieldsValue()?.giangVien || !form.getFieldsValue()?.dotThucTap}
          >
            Thêm sinh viên
          </Button>
        </div>

        <Loading active={isLoading}>
          <Table
            dataSource={dataSource}
            columns={columns}
            // pagination={false}
          />
        </Loading>

        <Row className='clearfix mt-2'>
          <CustomSkeleton
            layoutCol={{ xs: 24, lg: 15, xl: 8, xxl: 8 }}
            layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 15, xxl: 15 } }}
            labelLeft
          >

          </CustomSkeleton>

          {!isFinish && <Col xs={24} lg={9} xl={16}>
            <Button
              size='small' type='primary'
              htmlType='submit'
              className='pull-right'
              loading={isLoading}
              icon={<SaveFilled/>}
            >
              {recordId ? `Cập nhật nhóm thực tập` : `Tạo nhóm thực tập`}
            </Button>
          </Col>}
        </Row>
      </Form>
      <AddSinhVien
        isModalVisible={isShowModal}
        handleOk={(e) => addGroupStudent(e)}
        handleCancel={() => toggleModal(false)}
        detailStudentsList={detailStudentsList}
        dotTT={dotTTId}
        gvhd={gvId}
      />

    </>
  )
    ;
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { teacherList } = store.giaovien;
  const { sinhVienList } = store.sinhvien;
  const { namhocList } = store.namhoc;
  const { diadiemList } = store.diadiem;
  const { dotthuctapList } = store.dotthuctap;
  const { dkthuctapList } = store.dkthuctap;

  return { isLoading, dotthuctapList, diadiemList, namhocList, sinhVienList, teacherList , dkthuctapList};
}

const actions = {
  ...sinhvien.actions,
  ...namhoc.actions,
  ...giaovien.actions,
  ...diadiem.actions,
  ...dotthuctap.actions,
  ...dkthuctap.actions,
};


export default (connect(mapStateToProps, actions)(NhomThucTapChiTiet));
