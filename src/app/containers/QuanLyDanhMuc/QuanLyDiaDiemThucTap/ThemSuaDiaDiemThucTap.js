import React, { useEffect, useRef } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, RULES, DDTT } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';

// import * as unit from '@app/store/ducks/unit.duck';

function ThemSuaDiaDiemThucTap({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [diadiemthuctapForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      diadiemthuctapForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      diadiemthuctapForm.resetFields();
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
      title={userSelected ? 'Cập nhật thông tin địa điểm' : 'Thêm mới địa điểm'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={diadiemthuctapForm} size='default' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Tên địa điểm" name="tenDiaDiemThucTap"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={diadiemthuctapForm}
            />
            <CustomSkeleton
              size='default'
              label="Địa chỉ" name="diaChi"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={diadiemthuctapForm}
            />
            <CustomSkeleton
              size='default'
              label="Người đại diện" name="nguoiDaiDien"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              //rules={[RULES.REQUIRED]}
              labelLeft
              form={diadiemthuctapForm}
            />
            <CustomSkeleton
              size='default'
              label="Điện thoại" name="dienThoai"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              //rules={[RULES.REQUIRED]}
              labelLeft
              form={diadiemthuctapForm}
            />
            <CustomSkeleton
              size='default'
              label="trạng thái" name="trangThai"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              options={{ data: DDTT }}
              labelLeft
              rules={[RULES.REQUIRED]}
              form={diadiemthuctapForm}
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

