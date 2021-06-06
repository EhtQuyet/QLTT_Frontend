import React, { useEffect, useRef, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, RULES, UUTIEN_OPTIONS } from '@constants';
import { ROLE } from '../../../../constants/contans';


import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';

function NhiemVuDetail({ isModalVisible, handleOk, myInfo, handleCancel, userSelected, type, sinhVienList, ...props }) {
  const [nhiemVuForm] = Form.useForm();
  useEffect(() => {
    getData();
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.noiDung = userSelected.noiDung;
      dataField.yeuCau = userSelected.yeuCau;
      dataField.uuTien = userSelected.uuTien;
      dataField.ketQua = userSelected.ketQua;
      nhiemVuForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      nhiemVuForm.resetFields();
    }
  }, [isModalVisible]);

  function onFinish(data) {
    if(type)
    {data.trangThai = type}

    if (props.isLoading) return;
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }

  async function getData() {

  }

  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isAdmin = myInfo && myInfo.role.includes(ROLE.ADMIN);

  return (
    <Modal
      width='720px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={userSelected ? 'Chỉnh sửa công việc ' : 'Thêm công việc'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={nhiemVuForm} size='default' onFinish={onFinish}
        >
          <Row gutter={15}>

            <CustomSkeleton
              size='default'
              label="Nội dung công việc" name="noiDung"
              type={CONSTANTS.TEXT_AREA}
              layoutCol={{ xs: 24 }}
              disabled={isSinhVien}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />
            <CustomSkeleton
              size='default'
              label="Yêu cầu" name="yeuCau"
              type={CONSTANTS.TEXT_AREA}
              layoutCol={{ xs: 24 }}
              disabled={isSinhVien}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />

            {isSinhVien && <CustomSkeleton
              size='default'
              label="Kết quả" name="ketQua"
              type={CONSTANTS.TEXT_AREA}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />}
            {isGiangVien && <CustomSkeleton
              size='default'
              label="Mức độ ưu tiên" name="uuTien"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              options={{ data: UUTIEN_OPTIONS }}
              labelLeft
              rules={[RULES.REQUIRED]}
            />}

          </Row>
        </Form>
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default (connect(mapStateToProps)(NhiemVuDetail));

