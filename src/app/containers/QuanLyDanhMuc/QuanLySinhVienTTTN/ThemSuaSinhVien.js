import React, { useEffect } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';

function ThemSuaSinhVien({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [sinhvienForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.ngaySinh = userSelected.ngaySinh ? moment(userSelected.ngaySinh) : '';
      dataField.maLop = userSelected.maLop._id;
      sinhvienForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      sinhvienForm.resetFields();
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
      title={userSelected ? 'Cập nhật thông tin sinh viên' : 'Thêm mới sinh viên'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={sinhvienForm} size='default' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Tên sinh viên" name="tenSinhVien"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={sinhvienForm}
            />
            <CustomSkeleton
              size='default'
              label="Mã sinh viên" name="maSinhVien"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={sinhvienForm}
            />
            <CustomSkeleton
              size='default'
              label="Lớp học" name="maLop"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              showSearch
              options={{ data: props.classmateList, valueString: '_id', labelString: 'name' }}
            />
            <CustomSkeleton
              size='default'
              label="Ngày sinh" name="ngaySinh"
              type={CONSTANTS.DATE}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />
            <CustomSkeleton
              size='default'
              label="Email" name="email"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.EMAIL, RULES.REQUIRED]}
              labelLeft
              form={sinhvienForm}
              helpInline={false}
            />
            <CustomSkeleton
              size='default'
              label="Giới tính" name="gioiTinh"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              options={{ data: GENDER_OPTIONS }}
              labelLeft
              rules={[RULES.REQUIRED]}
            />
            <CustomSkeleton
              size='default'
              label="Số điện thoại" name="sdt"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.PHONE]}
              helpInline={false}
              labelLeft
              form={sinhvienForm}
            />
            <CustomSkeleton
              size='default'
              label="Địa chỉ" name="diaChi"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              labelLeft
              showSearch
              form={sinhvienForm}
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
export default (connect(mapStateToProps)(ThemSuaSinhVien));

