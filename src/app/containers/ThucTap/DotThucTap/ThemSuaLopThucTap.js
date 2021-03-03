import React, { useEffect, useRef } from 'react';
import { Col, Modal, Row, Table, Card } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, HOCVI_OPTIONS, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';
import { UnorderedListOutlined } from '@ant-design/icons';
import AddNewButton from '@AddNewButton';

function ThemSuaLopThucTap({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [lopthuctapForm] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.lopHoc = userSelected.lopHoc._id;
      lopthuctapForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      lopthuctapForm.resetFields();
    }
  }, [isModalVisible]);

  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }

  return (
    <Modal
      width='1024px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={userSelected ? 'Cập nhật thông tin lớp thực tập' : 'Thêm mới lớp thực tập'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={lopthuctapForm} size='default' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Lớp học" name="lopHoc"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={lopthuctapForm}
            />
            <CustomSkeleton
              size='default'
              label="Ghi chú" name="ghiChu"
              type={CONSTANTS.TEXT_AREA}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={lopthuctapForm}
            />
          </Row>
          <Card title={<span><UnorderedListOutlined /> Sinh viên thực tập cùng</span>}
                extra={ <AddNewButton onClick={() => handleShowModal(true)} />}>
            <Table/>
          </Card>


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
export default (connect(mapStateToProps)(ThemSuaLopThucTap));

