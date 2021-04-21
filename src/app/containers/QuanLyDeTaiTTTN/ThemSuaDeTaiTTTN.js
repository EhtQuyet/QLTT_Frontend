import React, { useEffect, useRef } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, HOCVI_OPTIONS, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';

function ThemSuaDeTaiTTTN({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [detaiForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.ngayTao = userSelected.ngayTao ? moment(userSelected.ngayTao) : '';
      dataField.boMon = userSelected.boMon._id;
      dataField.giaoVien = userSelected.giaoVien._id;
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
      title={userSelected ? 'Cập nhật thông tin đề tài' : 'Thêm mới đề tài'}
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
              label="Tên đề tài" name="tenDeTai"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={detaiForm}
            />
            <CustomSkeleton
              size='default'
              label="Mã đề tài" name="maDeTai"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={detaiForm}
            />
            <CustomSkeleton
              size='default'
              label="Bộ môn" name="boMon"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              options={{ data: props.bomonList, valueString: '_id', labelString: 'name' }}
              labelLeft
              rules={[RULES.REQUIRED]}
            />
            <CustomSkeleton
              size='default'
              label="Giảng viên hướng dẫn" name="giaoVien"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              options={{ data: props.teacherList, valueString: '_id', labelString: 'name' }}
              labelLeft
              rules={[RULES.REQUIRED]}
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
export default (connect(mapStateToProps)(ThemSuaDeTaiTTTN));

