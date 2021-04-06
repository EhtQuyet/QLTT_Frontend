import React, { useEffect, useRef } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';

// import * as unit from '@app/store/ducks/unit.duck';

function CreateAndModify({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [dotthuctapForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.thoiGianBatDau = userSelected.thoiGianBatDau ? moment(userSelected.thoiGianBatDau) : '';
      dataField.thoiGianKetThuc = userSelected.thoiGianKetThuc ? moment(userSelected.thoiGianKetThuc) : '';
      dataField.namHoc = userSelected.namHoc._id;
      dotthuctapForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      dotthuctapForm.resetFields();
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
        <Form id="formModal" form={dotthuctapForm} size='default' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Năm học" name="namHoc"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              options={{ data: props.namhocList, valueString: '_id', labelString: 'name' }}
            />
            <CustomSkeleton
              size='default'
              label="Tên đợt thực tập" name="dotThucTap"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={dotthuctapForm}
            />
            <CustomSkeleton
              size='default'
              label="Thời gian bắt đầu" name="thoiGianBatDau"
              type={CONSTANTS.DATE}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={dotthuctapForm}
            />
            <CustomSkeleton
              size='default'
              label="Thời gian kết thúc" name="thoiGianKetThuc"
              type={CONSTANTS.DATE}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              //rules={[RULES.REQUIRED]}
              labelLeft
              form={dotthuctapForm}
            />
            <CustomSkeleton
              size='default'
              label="Ghi chú" name="ghiChu"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              //rules={[RULES.REQUIRED]}
              labelLeft
              form={dotthuctapForm}
            />

          </Row>
        </Form>
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { namhocList } = store.namhoc;

  return { isLoading, namhocList };

}

export default (connect(mapStateToProps)(CreateAndModify));

