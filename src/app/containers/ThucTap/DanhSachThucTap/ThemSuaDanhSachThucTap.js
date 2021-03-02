import React, { useEffect, useRef } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';

// import * as unit from '@app/store/ducks/unit.duck';

function ThemSuaDiaDiemThucTap({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [danhsachthuchanhForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      danhsachthuchanhForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      danhsachthuchanhForm.resetFields();
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
      title={userSelected ? 'Cập nhật thông tin đợt thực tập' : 'Thêm mới đợt thực tập'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={danhsachthuchanhForm} size='default' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Đợt thực tập" name="tenThucTap"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={danhsachthuchanhForm}
            />
            <CustomSkeleton
              size='default'
              label="Ghi chú" name="ghi_chu"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              //rules={[RULES.REQUIRED]}
              labelLeft
              form={danhsachthuchanhForm}
            />
          </Row>
        </Form>
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}
export default (connect(mapStateToProps)(ThemSuaDiaDiemThucTap));

