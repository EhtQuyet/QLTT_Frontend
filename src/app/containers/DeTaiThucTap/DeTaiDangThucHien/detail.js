import React, { useEffect,useState, useRef } from 'react';
import { Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, RULES } from '@constants';
import { getAllLinhVuc } from '@app/services/LinhVuc/linhVuc.service';
import { getAllNamHoc } from '@app/services/NamHoc/namhocService';
import { getAllTuKhoa } from '@app/services/TuKhoa/tuKhoa.service';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';

function Detail({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [detaiForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      detaiForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      detaiForm.resetFields();
    }

  }, [isModalVisible]);

  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }

  return (
    <Modal
      width='720px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={'Cập nhật đề tài'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={detaiForm} size='default' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Tổng quan kết quả nghiên cứu" name="ketQua"
              type={CONSTANTS.TEXT_AREA}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={detaiForm}
            />
            <CustomSkeleton
              size='default'
              label="File báo cáo tổng kết" name="file"
              type={CONSTANTS.FILE}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={detaiForm}
            />
          </Row>
        </Form>
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { bomonList } = store.bomon;
  const { teacherList } = store.giaovien;

  return { isLoading , bomonList, teacherList};
}
export default (connect(mapStateToProps)(Detail));

