import React, { useEffect, useRef } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, HOCVI_OPTIONS, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';

// import * as unit from '@app/store/ducks/unit.duck';

function ThemSuaGiaoVien({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [giaovienForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.ngaySinh = userSelected.ngaySinh ? moment(userSelected.ngaySinh) : '';
      dataField.boMon = userSelected.boMon._id;
      giaovienForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      giaovienForm.resetFields();
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
        <Form id="formModal" form={giaovienForm} size='default' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Tên giáo viên" name="tenGiaoVien"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={giaovienForm}
            />
            <CustomSkeleton
              size='default'
              label="Mã giáo viên" name="maGiaoVien"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={giaovienForm}
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
              form={giaovienForm}
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
              label="Số điện thoại" name="sdt"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.PHONE]}
              helpInline={false}
              labelLeft
              form={giaovienForm}
            />
            <CustomSkeleton
              size='default'
              label="Địa chỉ" name="diaChi"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              labelLeft
              showSearch
              form={giaovienForm}
            />
            <CustomSkeleton
              size='default'
              label="Học vị" name="hocVi"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              labelLeft
              showSearch
              options={{ data: HOCVI_OPTIONS }}
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

  return { isLoading , bomonList};
}
export default (connect(mapStateToProps)(ThemSuaGiaoVien));

