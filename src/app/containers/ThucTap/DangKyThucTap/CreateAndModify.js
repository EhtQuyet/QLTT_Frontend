import React, { useEffect, useRef } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';


function CreateAndModify({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [dkttForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.diaDiem = userSelected.diadiem_thuctap._id;
      dataField.giaoVien = userSelected.giaoien_huongdan._id;
      dkttForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      dkttForm.resetFields();
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
      title={userSelected ? 'Cập nhật thông tin giáo viên' : 'Thêm mới giáo viên'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={dkttForm} size='default' onFinish={onFinish}>
          <Row gutter={15}>
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
              options={{ data: props.diadiemList, valueString: '_id', labelString: 'name' }}
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

  return { isLoading , teacherList, diadiemList};
}
export default (connect(mapStateToProps)(CreateAndModify));

