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
import * as user from '@app/store/ducks/user.duck';
import Loading from '@components/Loading';
import Dropzone from 'react-dropzone';
import { getAllDKTT } from '@app/services/ThucTap/DKThucTap/dangkythuctapService';
import { DOT_THUC_TAP, ROLE } from '@src/constants/contans';


function NhomThucTapChiTiet({
                              isLoading, namhocList, sinhVienList, myInfo,
                              dotthuctapList, diadiemList, teacherList, dkthuctapList, ...props
                            }) {

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

  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  // console.log('isSinhVien', isSinhVien);

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
    console.log(apiResponse);
    if (apiResponse) {
      const namHoc = { value: apiResponse.nam_hoc._id, label: apiResponse.nam_hoc.nam_hoc };
      const diaDiem = { value: apiResponse.dia_diem._id, label: apiResponse.dia_diem.ten_dia_diem };
      const dotThucTap = { value: apiResponse.id_dotthuctap._id, label: apiResponse.id_dotthuctap.ten_dot };
      const giangVien = { value: apiResponse.id_giangvien._id, label: apiResponse.id_giangvien.ten_giao_vien };
      await form.setFieldsValue({
        namHoc, diaDiem, dotThucTap, giangVien,
      });
      await handleChangeNamHoc(namHoc);
      handleSetStudentsDetail(apiResponse);
    }
  }

  async function handleSetStudentsDetail(apiResponse) {
    const { chitiet } = apiResponse;
    if (!Array.isArray(chitiet)) return;
    let listDataDetail = chitiet.map(detail => {
      return {
        key: detail?._id,
        _id: detail?._id,
        tenSinhVien: detail?.id_sinhvien,
        maSinhVien: detail?.ma_sinh_vien,
        so_tctl: detail?.so_tctl,
        diem_tbtl: detail?.diem_tbtl,
        isDeleted: detail?.is_deleted,
      };
    });
    setDetailStudentsList(listDataDetail);
  }

  // async function handleChangeGiangVien(giangVienSelected, resetStudentsList = false) {
  //   if (!giangVienSelected?.value) return;
  // }

  // async function handleChangeNamHoc(namhocSelected) {
  //   if (!namhocSelected) return;
  //   const apiResponse = await getAllDotThucTap(1, 0, { namhoc: namhocSelected ? namhocSelected : '' });
  // }
  async function handleChangeNamHoc(namhocSelected, resetStudentsList = false) {
    if (!namhocSelected?.value) return;
    const data = dotthuctapList.filter(item => {
      if (item.namhoc._id === namhocSelected.value && item.trang_thai === DOT_THUC_TAP.DANG_MO) return item;
    });
    setDotThucTap(data);
    if (resetStudentsList) {
      const studentsListNew = detailStudentsList.map(students => {
        students.isDeleted = true;
        return students;
      });
      setDetailStudentsList(studentsListNew);
    }
  }

  async function handleChangeGiangVien(giangVienSelected, resetStudentsList = false) {

    if (!giangVienSelected?.value) return;

    if (resetStudentsList) {
      const studentsListNew = detailStudentsList.map(students => {
        students.isDeleted = true;
        return students;
      });
      setDetailStudentsList(studentsListNew);
    }
  }

  async function handleSaveData() {
    if (!detailStudentsList.length) {
      toast(CONSTANTS.WARNING, 'Nhóm không có sinh viên', TOAST_MESSAGE.ERROR.DESCRIPTION);
      return;
    }
    const { namHoc, diaDiem, dotThucTap, giangVien, truongNhom } = form.getFieldsValue();
    let isError = false;
    let details = [], messageString = '';
    let countDetailExist = 0;
    for (let i = 0; i < detailStudentsList.length; i++) {
      let students = detailStudentsList[i];
      if (students._id || (!students._id && !students.isDeleted)) {
        const dataPush = {
          id_sinhvien: students.tenSinhVien,
          ma_sinh_vien: students.maSinhVien,
          so_tctl: students.so_tctl,
          diem_tbtl: students.diem_tbtl,
        };
        if (students._id) {
          dataPush._id = students._id;
        }
        if (students.isDeleted) {
          dataPush.is_deleted = true;
        } else {
          countDetailExist += 1;
        }
        details = [...details, dataPush];
      }
    }

    if (!countDetailExist) {
      messageString = 'Không có danh sách sinh viên';
    }

    if (isError || !countDetailExist) {
      toast(CONSTANTS.WARNING, messageString, TOAST_MESSAGE.ERROR.DESCRIPTION);
      return;
    }

    const dataRequest = {
      nam_hoc: namHoc?.value,
      id_dotthuctap: dotThucTap?.value,
      id_giangvien: giangVien?.value,
      dia_diem: diaDiem?.value,
      chitiet: details,
    };

    let apiResponse;
    if (!recordId) {
      // create
      messageString = 'Tạo mới nhóm thực tập thành công';
      apiResponse = await createNhomThucTap(dataRequest);
    } else {
      // update
      messageString = 'Cập nhật nhóm thực tập thành công';
      dataRequest._id = recordId;
      apiResponse = await updateNhomThucTap(dataRequest);
    }
    if (apiResponse) {
      toast(CONSTANTS.SUCCESS, messageString);
      if (!recordId) {
        props.history.push(URL.MENU.NHOM_THUC_TAP_CHI_TIET_ID.format(apiResponse._id));
      } else {
        handleSetStudentsDetail(apiResponse);
        setFormEdited(false);
      }
    }
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
      disabledDelete={isLoading || !row.tenSinhVien}
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
    // if(allValues.dotThucTap && allValues.giangVien && allValues.diaDiem)
    //   set
    // if (changedValues.namHoc) {
    //   console.log(changedValues.namHoc);
    //   const data = dotthuctapList.filter(item => {
    //     if (item.namhoc === changedValues.namHoc) return item;
    //   });
    //   setDotThucTap(data);
    // }
    // if (changedValues.giangVien) {
    //   setGVId(changedValues.giangVien);
    // }
    // if (changedValues.dotThucTap) {
    //   setDotTTId(changedValues.dotThucTap);
    // }
    // if (changedValues.diaDiem) {
    //
    // }
    if (!isFormEdited) {
      setFormEdited(true);
    }
  }

  function addGroupStudent(studentsListSelected) {
    console.log('studentsListSelected', studentsListSelected);
    let detailGroupStudentNew = [...detailStudentsList];

    studentsListSelected.forEach(students => {
      const dataPush = {
        isDeleted: false,
        key: students.key,
        notEdited: true,
        maSinhVien: students.maSinhVien,
        tenSinhVien: students.tenSinhVien,
        so_tctl: students.so_tctl,
        diem_tbtl: students.diem_tbtl,
      };

      detailGroupStudentNew = [...detailGroupStudentNew, dataPush];
    });
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
            onChange={(namhocSelected) => handleChangeNamHoc(namhocSelected, true)}
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
            options={{ data: dotThucTap, valueString: '_id', labelString: 'name' }}
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
            onChange={(giangvienSelected) => handleChangeGiangVien(giangvienSelected)}
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
            labelInValue
            fullLine
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
            disabled={isLoading}
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
          {/*<CustomSkeleton*/}
          {/*  layoutCol={{ xs: 24, lg: 15, xl: 8, xxl: 8 }}*/}
          {/*  layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 15, xxl: 15 } }}*/}
          {/*  labelLeft*/}
          {/*>*/}

          {/*</CustomSkeleton>*/}
          <Col xs={24} lg={15} xl={8}></Col>
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
        // dotThuctap={form.getFieldsValue()?.dotThucTap?.value}
        teacher={form.getFieldsValue()?.giangVien?.value}
        address={form.getFieldsValue()?.diaDiem?.value}
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
  const { myInfo } = store.user;

  return { isLoading, dotthuctapList, diadiemList, myInfo, namhocList, sinhVienList, teacherList, dkthuctapList };
}

const actions = {
  ...sinhvien.actions,
  ...namhoc.actions,
  ...giaovien.actions,
  ...diadiem.actions,
  ...dotthuctap.actions,
  ...dkthuctap.actions,
  ...user.actions,

};


export default (connect(mapStateToProps, actions)(NhomThucTapChiTiet));
