import React, { useEffect } from 'react';
import { Col, Modal, Row, Checkbox  } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, RULES, TT_OPTIONS } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';
import { ROLE } from '@src/constants/contans';

function NhatKyDetail({ isModalVisible, handleOk, myInfo, handleCancel, userSelected, ...props }) {
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
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }



  const isAdmin = myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);

  return (
    <Modal
      width='720px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={userSelected ? 'Chi tiết nhật ký thực tập' : 'Thêm mới nhật ký'}
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
              label="Địa điểm" name="diaDiem"
              disabled={isGiangVien}
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
              disabled={isGiangVien}
              type={CONSTANTS.DATE}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />
            <CustomSkeleton
              size='default'
              label="Công việc" name="congViec"
              disabled={isGiangVien}
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
              disabled={isGiangVien}
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              helpInline={false}
              labelLeft
              form={nhatkyFom}
            />
            {!isSinhVien && <CustomSkeleton
              size='default'
              label="Nhận xét" name="nhanXet"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              labelLeft
              showSearch
              form={nhatkyFom}
            />}
            {!isSinhVien &&  <CustomSkeleton
              size='default'
              label="trạng thái" name="trangThai"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              options={{ data: TT_OPTIONS }}
              labelLeft
              rules={[RULES.REQUIRED]}
            />}
          </Row>
        </Form>
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { classmateList } = store.lophoc;
  const { myInfo } = store.user;
  return { isLoading, classmateList, myInfo };
}
export default (connect(mapStateToProps)(NhatKyDetail));

