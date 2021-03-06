import React, { useEffect, useRef, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import {
  getAllDiaDiemThucTap,
} from '@app/services/DiaDiemThucTap/diadiemthuctapService';
import {
  getAllDotThucTap,
} from '@app/services/ThucTap/DotThucTap/dotthuctapService';
import { CONSTANTS, RULES } from '@constants';
import { DOT_THUC_TAP, DIA_DIEM_THUC_TAP, ROLE } from '../../../../constants/contans';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import { getAllGiaoVien } from '@app/services/GiaoVienHD/giaoVienService';
import { getAllSinhVien } from '@app/services/SinhVienTTTN/sinhVienTTService';
import { getAllDKTT } from '@app/services/ThucTap/DKThucTap/dangkythuctapService';

function CreateAndModify({ isModalVisible, handleOk, myInfo, teacherList, handleCancel, userSelected, sinhVienList, ...props }) {
  const [dkttForm] = Form.useForm();
  const [diadiemTT, setDiaDiaTT] = useState([]);
  const [dotTT, setDotTT] = useState([]);
  const [giangViens, setGiangViens] = useState([]);
  const [isOtherPlace, setOtherPlace] = useState(false);
  useEffect(() => {
    getData();
    setDiaDiaTT([...diadiemTT, { _id: '####', name: '---KHÁC---' }]);
  }, [isModalVisible]);
  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(CONSTANTS.CREATE, data);
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

  async function getData() {
    const apiResponse = await getAllDiaDiemThucTap(1, 0, { trang_thai: DIA_DIEM_THUC_TAP.DA_XAC_NHAN });
    if(apiResponse) {
      setDiaDiaTT([...apiResponse.docs, { _id: '####', ten_dia_diem: '---KHÁC---' }]);
    }
    const apiDotTT = await getAllDotThucTap(1, 0, { trang_thai: DOT_THUC_TAP.DANG_MO});
    if(apiDotTT) {
      setDotTT(apiDotTT.docs);
    }
    const apiGiangViens = await getAllGiaoVien(1,0,{});
    if(apiGiangViens){
      setGiangViens(apiGiangViens.docs);
    }
  }
  const isGiaoVu = props.myInfo && props.myInfo.role.includes(ROLE.GIAO_VU);
  const isAdmin = props.myInfo && props.myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  return (
    <Modal
      width='720px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={userSelected ? 'Chỉnh sửa đang ký thực tập' : 'Đăng ký thực tập'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
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
              label="Giảng viên hướng dẫn" name="giaoVien"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              showSearch
              options={{ data: giangViens, valueString: '_id', labelString: 'ten_giao_vien' }}
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
              options={{ data: diadiemTT , valueString: '_id', labelString: 'ten_dia_diem' }}
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
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { teacherList } = store.giaovien;
  const { diadiemList } = store.diadiem;
  const { dotthuctapList } = store.dotthuctap;
  const { sinhVienList } = store.sinhvien;
  const { myInfo  } = store.user;

   return { isLoading, teacherList, myInfo, diadiemList, dotthuctapList, sinhVienList };
}
export default (connect(mapStateToProps)(CreateAndModify));

