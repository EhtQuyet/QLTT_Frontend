import React, { useEffect } from 'react';
import { Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';
import { ROLE } from '@src/constants/contans';

function KiemDuyetDetail({ isModalVisible, handleOk, myInfo, handleCancel, userSelected, ...props }) {
  const [nhatkyFom] = Form.useForm();
  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.ngay = userSelected.ngay ? moment(userSelected.ngay) : '';
      dataField.maSinhVien = userSelected.maSinhVien.ma_sinh_vien;
      nhatkyFom.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      nhatkyFom.resetFields();
    }
  }, [isModalVisible]);

  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(CONSTANTS.UPDATE, data);
  }




  return (
    <Modal
      width='720px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={'Kiểm duyệt nhật ký'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={nhatkyFom} size='default' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Mã sinh viên" name="maSinhVien"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={nhatkyFom}
            />
            <CustomSkeleton
              size='default'
              label="Địa điểm" name="diaDiem"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={nhatkyFom}
            />
            <CustomSkeleton
              size='default'
              label="Ngày tháng" name="ngay"
              type={CONSTANTS.DATE}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />
            <CustomSkeleton
              size='default'
              label="Công việc" name="congViec"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={nhatkyFom}
              helpInline={false}
            />
            <CustomSkeleton
              size='default'
              label="Kết quả" name="ketQua"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              helpInline={false}
              labelLeft
              form={nhatkyFom}
            />
            <CustomSkeleton
              size='default'
              label="Nhận xét" name="nhanXet"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              labelLeft
              showSearch
              form={nhatkyFom}
            />

          </Row>
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
export default (connect(mapStateToProps)(KiemDuyetDetail));

