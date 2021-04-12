import React, { useEffect, useRef, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import {
  getAllDiaDiemThucTap
} from '@app/services/DiaDiemThucTap/diadiemthuctapService';
import {
  getAllDotThucTap
} from '@app/services/DKThucTap/DKThucTapService';
import { CONSTANTS, RULES } from '@constants';
import { DOT_THUC_TAP, ROLE } from '../../../../constants/contans';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import MyInfo from '@containers/MyInfo/MyInfo';


function CreateAndModify({ isModalVisible, handleOk, handleCancel, myInfo, userSelected, ...props }) {
  const [dkttForm] = Form.useForm();
  const [ddtt, setDdtt] = useState([])
  const [dotTT, setDotTT] = useState([])

  useEffect(() => {

    getData();



    setDdtt([ ...ddtt, {_id: '####', name:'---KHÁC---'}])

    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.diaDiem = userSelected.diadiem_thuctap._id;
      dataField.giaoVien = userSelected.giaoien_huongdan._id;
      dataField.dot_thuc_tap = userSelected.dot_thuc_tap._id;

      dkttForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      dkttForm.resetFields();
    }
  }, [isModalVisible]);

  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }
  function onValuesChange(changedValues, allValues) {
  }

  async function getData()
  {
    const apiResponse = await getAllDiaDiemThucTap()
    setDdtt([ ...apiResponse.docs,  {_id: '####', ten_dia_diem:'---KHÁC---'}])
    const apiDotTT = await getAllDotThucTap(1,0, {trang_thai: DOT_THUC_TAP.DANG_MO})
    setDotTT(apiDotTT.docs)
  }

  async function onChange() {
    console.log('aaaaaaaaaaaaaaaa');
  }

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
            { myInfo.role.includes(ROLE.GIAO_VU) && <CustomSkeleton
              size='default'
              label="Mã sinh viên" name="maSinhVien"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              labelLeft
            />}
            <CustomSkeleton
              size='default'
              label="Đợt thực tập" name="dot_thuc_tap"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              options={{ data: dotTT ? dotTT : [], valueString: '_id', labelString: 'ten_dot' }}
            />
            <CustomSkeleton
              size='default'
              label="Giáo viên hướng dẫn" name="giaoVien"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
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
              options={{ data: ddtt ? ddtt : [], valueString: '_id', labelString: 'ten_dia_diem' }}
              onChange={onChange}
            />
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


  return { isLoading , teacherList, diadiemList, dotthuctapList};
}
export default (connect(mapStateToProps)(CreateAndModify));

