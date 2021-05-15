import React, { useEffect, useRef, useState } from 'react';
import { Col, Modal, Row, Table } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, HOCVI_OPTIONS, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';
import { columnIndex } from '@app/common/functionCommons';
import ActionCell from '@components/ActionCell';

function KeHoachDetail({ ...props }) {

  const khId = undefined;

  useEffect(() => {
  }, []);
  async function getData() {

  }
  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }

  const columns = [
    {
      title: 'Bắt đầu',
      width: 200,
    },
    {
      title: 'Kết thúc',
      width: 200,
    },
    {
      title: 'Nội dung',
      width: 500,
    },
    {
      title: 'Kết quả',
      width: 500,
    },
  ];
  return (
      <Loading active={props.isLoading}>
        <p>{khId ? 'Chi tiết kế hoạch thực tập' : 'Thêm mới kế hoạch thực tập'}</p>
        <Form id='form' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Mã sinh viên" name="maSinhVien"
              Value='sdasdas'
              type={CONSTANTS.TEXT}
              Disable={true}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />
            <CustomSkeleton
              size='default'
              label="Họ và tên"  name="hoVaTen"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />
            <CustomSkeleton
              size='default'
              label="Ghi chú" name='ghiChu'
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />
            <Table  size='small' columns={columns} bordered/>
          </Row>
        </Form>
      </Loading>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;

  return { isLoading};
}
export default (connect(mapStateToProps)(KeHoachDetail));

