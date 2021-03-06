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
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Col,
  Select,
  Switch,
  Table,
  Tooltip,
  Card, Checkbox,
} from 'antd';
import { PlusCircleOutlined, SaveFilled } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { CONSTANTS, RULES, TOAST_MESSAGE, TRANG_THAI } from '@constants';
import { URL } from '@url';
import ActionCell from '@components/ActionCell';
import CustomSkeleton from '@components/CustomSkeleton';
import { columnIndex, toast } from '@app/common/functionCommons';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import * as sinhvien from '@app/store/ducks/sinhvien.duck';
import * as dotthuctap from '@app/store/ducks/dotthuctap.duck';
import * as diadiem from '@app/store/ducks/diadiem.duck';
import * as giaovien from '@app/store/ducks/giaovien.duck';
import * as dkthuctap from '@app/store/ducks/dkthuctap.duck';

import Loading from '@components/Loading';
import Dropzone from 'react-dropzone';
import { getAllDKTT } from '@app/services/ThucTap/DKThucTap/dangkythuctapService';
import { DOT_THUC_TAP } from '@src/constants/contans';
import UploadFile from './UploadFile';
import { getAllDetai } from '@app/services/DeTaiTTTN/DeTaiService';


function ChiTiet({
                   isLoading, namhocList, sinhVienList,
                   dotthuctapList, diadiemList, teacherList, dkthuctapList, ...props
                 }) {

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const recordId = useParams()?.id;
  const [form] = Form.useForm();
  const [isFormEdited, setFormEdited] = useState(false);
  const [detailStudentsList, setDetailStudentsList] = useState([]);
  const [isFinish, setFinish] = useState(false);
  const [stateUpload, setStateUpload] = useState(false);
  const [deTai, setDeTai] = useState([]);


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
    if (apiResponse) {
      const giangVien = { value: apiResponse.id_giangvien._id, label: apiResponse.id_giangvien.ten_giao_vien };
      await form.setFieldsValue({
        giangVien: giangVien.label,
      });
      handleSetStudentsDetail(apiResponse);

      const apiDetai = await getAllDetai(1, 0, { ma_giao_vien: giangVien.value });
      setDeTai(apiDetai.docs);
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

  async function handleSaveData() {
    // if (!detailStudentsList.length) {
    //   toast(CONSTANTS.WARNING, 'Nhóm không có sinh viên', TOAST_MESSAGE.ERROR.DESCRIPTION);
    //   return;
    // }
    // const { namHoc, diaDiem, dotThucTap, giangVien, truongNhom } = form.getFieldsValue();
    // let isError = false;
    // let details = [], messageString = '';
    // let countDetailExist = 0;
    // for (let i = 0; i < detailStudentsList.length; i++) {
    //   let students = detailStudentsList[i];
    //   if (students._id || (!students._id && !students.isDeleted)) {
    //     const dataPush = {
    //       id_sinhvien: students.tenSinhVien,
    //       ma_sinh_vien: students.maSinhVien,
    //       so_tctl: students.so_tctl,
    //       diem_tbtl: students.diem_tbtl,
    //     };
    //     if (students._id) {
    //       dataPush._id = students._id;
    //     }
    //     if (students.isDeleted) {
    //       dataPush.is_deleted = true;
    //     } else {
    //       countDetailExist += 1;
    //     }
    //     details = [...details, dataPush];
    //   }
    // }
    //
    // if (!countDetailExist) {
    //   messageString = 'Không có danh sách sinh viên';
    // }
    //
    // if (isError || !countDetailExist) {
    //   toast(CONSTANTS.WARNING, messageString, TOAST_MESSAGE.ERROR.DESCRIPTION);
    //   return;
    // }
    //
    // const dataRequest = {
    //   nam_hoc: namHoc?.value,
    //   id_dotthuctap: dotThucTap?.value,
    //   id_giangvien: giangVien?.value,
    //   dia_diem: diaDiem?.value,
    //   chitiet: details,
    // };
    //
    // let apiResponse;
    // if (!recordId) {
    //   // create
    //   messageString = 'Tạo mới nhóm thực tập thành công';
    //   apiResponse = await createNhomThucTap(dataRequest);
    // } else {
    //   // update
    //   messageString = 'Cập nhật nhóm thực tập thành công';
    //   dataRequest._id = recordId;
    //   apiResponse = await updateNhomThucTap(dataRequest);
    // }
    // if (apiResponse) {
    //   toast(CONSTANTS.SUCCESS, messageString);
    //   if (!recordId) {
    //     props.history.push(URL.MENU.NHOM_THUC_TAP_CHI_TIET_ID.format(apiResponse._id));
    //   } else {
    //     handleSetStudentsDetail(apiResponse);
    //     setFormEdited(false);
    //   }
    // }
  }

  const columns = [
    { title: 'Mã sinh viên', dataIndex: 'maSinhVien', width: 200 },
    { title: 'Tên sinh viên', dataIndex: 'tenSinhVien', render: value => value?.ten_sinh_vien, width: 200 },
  ];


  const columnsDeTai = [
    columnIndex(0, 1),
    {
      title: 'Mã đề tài', dataIndex: 'maDeTai',
      width: 100,
    },
    {
      title: 'Tên đề tài',
      dataIndex: 'tenDeTai',
      width: 200,
    },
    { title: 'Bộ môn', dataIndex: 'boMon', width: 200 },
    {
      align: 'center',
      render: (value, row) => <Checkbox
        // checked={studentsSelectedId.includes(row.tenSinhVien)}
        // onChange={() => handleSelectDeTai(row)}
      />,
      width: 80,
    },
  ];

  let dataSource = [];
  detailStudentsList.forEach((item, index) => {
    if (!item.isDeleted) {
      const source = Object.assign({}, item);
      source.keyIndex = index;
      dataSource = [...dataSource, source];
    }
  });

  const dataSourceDeTai = deTai.map(item => {
    item.key = item._id;
    item.maDeTai = item.ma_de_tai;
    item.tenDeTai = item.ten_de_tai;
    item.boMon = item.ma_bo_mon.ten_bo_mon;
    return item
  });

  async function onValuesChange(changedValues, allValues) {
    if (!isFormEdited) {
      setFormEdited(true);
    }
  }

  function handleSelectDeTai(valueSelected) {
    // let suppliesListNew = [...studentsSelected];
    // let suppliesListIdNew = [...studentsSelectedId];
    //
    // if (suppliesListIdNew.includes(valueSelected.tenSinhVien)) {
    //   const index = suppliesListIdNew.indexOf(valueSelected.tenSinhVien);
    //   suppliesListNew.splice(index, 1);
    //   suppliesListIdNew.splice(index, 1);
    // } else {
    //   suppliesListNew = [...suppliesListNew, valueSelected];
    //   suppliesListIdNew = [...suppliesListIdNew, valueSelected.tenSinhVien];
    // }
    // setStudentsSelected(suppliesListNew);
    // setStudentsSelectedId(suppliesListIdNew);
  }

  return (
    <>
      <Form size='small' form={form} onFinish={handleSaveData} scrollToFirstError
            onValuesChange={onValuesChange}>
        <CustomSkeleton
          size='default'
          label="Giảng viên hướng dẫn" name="giangVien"
          type={CONSTANTS.LABEL}
          layoutCol={{ xs: 24, lg: 15 }}
          layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 } }}
          rules={[RULES.REQUIRED]}
          labelLeft
          form={form}
        />
        <Loading active={isLoading}>
          <Divider orientation="left" plain={false} className='mb-4'>
            {'Thông tin nhóm thực tập'}
          </Divider>
          <Card
            title="Danh sách sinh viên"
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              // pagination={false}
            />
          </Card>
        </Loading>
        <Divider orientation="left" plain={false} className='mb-4'>
          {'Chi tiết đề tài thực tập'}
        </Divider>
        <Card
          title="Danh sách đề tài"
          extra={
            <Button size='small' className='ant-btn-purple float-right mr-2'
                    onClick={() => setStateUpload(true)}>
              <i className='fa fa-upload mr-1'/>Tải lên
            </Button>}>
          <Table
            dataSource={dataSourceDeTai}
            columns={columnsDeTai}
            // pagination={false}
          />
        </Card>

        <Row className='clearfix mt-2'>
          <Col xs={24} lg={15} xl={8}>

          </Col>
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
      <UploadFile
        isModalVisible={stateUpload}
        handleCancel={() => setStateUpload(false)}
        handleOk={() => setStateUpload(false)}
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

  return { isLoading, dotthuctapList, diadiemList, namhocList, sinhVienList, teacherList, dkthuctapList };
}

const actions = {
  ...sinhvien.actions,
  ...namhoc.actions,
  ...giaovien.actions,
  ...diadiem.actions,
  ...dotthuctap.actions,
  ...dkthuctap.actions,
};


export default (connect(mapStateToProps, actions)(ChiTiet));
