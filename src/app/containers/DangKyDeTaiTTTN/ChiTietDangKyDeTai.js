import React, { useEffect } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';

function ChiTietDangKyDeTai({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [chitietdangkyForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      console.log('data', userSelected);
      const dataField = Object.assign({}, userSelected);
      chitietdangkyForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      chitietdangkyForm.resetFields();
    }
  }, [isModalVisible]);

  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(userSelected);
  }

  return (
    <Modal
      width='720px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={'Thêm sinh viên cùng đăng ký đề tài'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={chitietdangkyForm} size='default' onFinish={onFinish}>
            <h1>Cái này e tự code nhé e zai!</h1>
        </Form>
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { classmateList } = store.lophoc;
  return { isLoading, classmateList };
}
export default (connect(mapStateToProps)(ChiTietDangKyDeTai));

