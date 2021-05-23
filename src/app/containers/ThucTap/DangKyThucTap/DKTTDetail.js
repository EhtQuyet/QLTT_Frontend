import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row } from 'antd';
import CustomSkeleton from '@components/CustomSkeleton';
import {
  getAllDiaDiemThucTap,
} from '@app/services/DiaDiemThucTap/diadiemthuctapService';
import {
  getAllDotThucTap,
} from '@app/services/ThucTap/DotThucTap/dotthuctapService';
import {
  createDKTT,
  deleteDKTT,
  getAllDKTT,
  updateDKTT,
  getById,
} from '@app/services/ThucTap/DKThucTap/dangkythuctapService';

import { CONSTANTS, PAGINATION_INIT, RULES, PAGINATION_CONFIG } from '@constants';
import { DOT_THUC_TAP, DIA_DIEM_THUC_TAP, ROLE } from '../../../../constants/contans';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import { Table } from 'antd';
import { columnIndex, toast } from '@app/common/functionCommons';

function DKTTDetail(sinhVienList, ...props) {

  console.log('Value', useParams()?.id);
  const [dkttForm] = Form.useForm();
  const [diadiemTT, setDiaDiaTT] = useState([]);
  const [dotTT, setDotTT] = useState([]);
  const [svtt, setSvtt] = useState(PAGINATION_INIT);
  const [isOtherPlace, setOtherPlace] = useState(false);
  useEffect(() => {
    getData();
    getDanhSachSinhVienThucTap();
    setDiaDiaTT([...diadiemTT, { _id: '####', name: '---KHÁC---' }]);
    // if (userSelected && isModalVisible) {
    //   const dataField = Object.assign({}, userSelected);
    // dataField.diaDiem = useParams()?.id;
    //   dataField.giaoVien = userSelected.giaoien_huongdan._id;
    //   dataField.dot_thuc_tap = userSelected.dot_thuc_tap._id;
    //   dataField.maSinhVien = userSelected.sinhVien._id;
    //   dkttForm.setFieldsValue(dataField);
    // } else if (!isModalVisible) {
    //   dkttForm.resetFields();
    // }
  }, []);

  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }

  function onValuesChange(changedValues, allValues) {
    if (changedValues.diaDiem) {
      if (changedValues.diaDiem === '####') {
        setOtherPlace(true);
      } else {
        setOtherPlace(false);
      }
    }
  }

  async function getDanhSachSinhVienThucTap(
    currentPage = svtt.currentPage,
    pageSize = svtt.pageSize,
    query = svtt.query,
  ) {
    const apiResponse = await getAllDKTT(currentPage, pageSize, query);
    if (apiResponse) {
      setSvtt({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  console.log('svtt', svtt);
  const dataSource = svtt.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    sinhVien: data.sinh_vien,

  }));
  const columns = [
    columnIndex(svtt.pageSize, svtt.currentPage),
    {
      title: 'Đợt thực tập',
      dataIndex: 'dot_thuc_tap',
      render: value => value?.ten_dot,
      width: 300,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'sinhVien',
      render: value => value?.ten_sinh_vien,
      width: 200,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'sinhVien',
      render: value => value?.ma_sinh_vien,
      width: 200,
    },
  ];
  const pagination = PAGINATION_CONFIG;
  // pagination.onChange = handleChangePagination;
  pagination.current = svtt.currentPage;
  pagination.total = svtt.totalDocs;
  pagination.pageSize = svtt.pageSize;


  async function getData() {
    const apiResponse = await getAllDiaDiemThucTap(1, 0, { trang_thai: DIA_DIEM_THUC_TAP.DA_XAC_NHAN });
    console.log('apiResponse', apiResponse);
    if (apiResponse) {
      setDiaDiaTT([...apiResponse.docs, { _id: '####', ten_dia_diem: '---KHÁC---' }]);
    }
    const apiDotTT = await getAllDotThucTap(1, 0, { trang_thai: DOT_THUC_TAP.DANG_MO });
    setDotTT(apiDotTT.docs);
  }

  const isGiaoVu = props.myInfo && props.myInfo.role.includes(ROLE.GIAO_VU);
  const isAdmin = props.myInfo && props.myInfo.role.includes(ROLE.ADMIN);
  return (
    <>
      {/*<Loading active={props.isLoading}>*/}
      <Form id="formModal" form={dkttForm} size='default' onFinish={onFinish}
            onValuesChange={onValuesChange}
      >
        <Row gutter={15}>
          {(isAdmin || isGiaoVu) && <CustomSkeleton
            size='default'
            label="Mã sinh viên" name="maSinhVien"
            type={CONSTANTS.SELECT}
            rules={[RULES.REQUIRED]}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            labelLeft
            showSearch
            options={{ data: sinhVienList ? sinhVienList : [], valueString: '_id', labelString: 'namecode' }}
          />}
          <CustomSkeleton
            size='default'
            label="Đợt thực tập" name="dot_thuc_tap"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
            showSearch
            options={{ data: dotTT ? dotTT : [], valueString: '_id', labelString: 'ten_dot' }}
          />
          <CustomSkeleton
            size='default'
            label="Giảng viên hướng dẫn" name="giaoVien"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
            showSearch
            options={{ data: props.teacherList, valueString: '_id', labelString: 'name' }}
          />
          <CustomSkeleton
            size='default'
            label="Địa điểm thực tập" name="diaDiem"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
            showSearch
            options={{ data: diadiemTT ? diadiemTT : [], valueString: '_id', labelString: 'ten_dia_diem' }}
          />
          {isOtherPlace && <CustomSkeleton
            size='default'
            label="Tên địa điểm" name="tenDiaDiem"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
          />}
          {isOtherPlace && <CustomSkeleton
            size='default'
            label="Địa chỉ" name="diaChi"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
          />}
          <CustomSkeleton
            size='default'
            label="Điểm TB tích lũy" name="diemTichLuy"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
          />
          <CustomSkeleton
            size='default'
            label="Tín chỉ tích lũy" name="tinchi_tichluy"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
            form={dkttForm}
          />
        </Row>
      </Form>
      <button>Lưu</button>
      <Table dataSource={dataSource} size='small' columns={columns}
             pagination={pagination} bordered/>
      {/*</Loading>*/}
    </>);
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { teacherList } = store.giaovien;
  const { diadiemList } = store.diadiem;
  const { dotthuctapList } = store.dotthuctap;
  const { sinhVienList } = store.sinhvien;
  return { isLoading, teacherList, diadiemList, dotthuctapList, sinhVienList };
}

export default (connect(mapStateToProps)(DKTTDetail));
