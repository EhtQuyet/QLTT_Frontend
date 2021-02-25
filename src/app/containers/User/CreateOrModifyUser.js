import React, { Fragment, useEffect, useRef } from 'react';
import { Modal, Form, Row } from 'antd';
import { connect } from 'react-redux';

import Loading from '@components/Loading';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, RULES } from '@constants';

function CreateOrModifyUser({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [formUser] = Form.useForm();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      formUser.setFieldsValue(userSelected);
    } else if (!isModalVisible) {
      formUser.resetFields();
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
      title={userSelected ? 'Cập nhật thông tin nhân viên' : 'Thêm mới nhân viên'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" size='default' form={formUser} autoComplete="new-password" onFinish={onFinish}>
          <Row gutter={5}>
            <CustomSkeleton
              size='default'
              label="Họ tên" name="fullName"
              type={CONSTANTS.TEXT}
              layoutItem={{ labelCol: { xs: 6, md: 5 } }}
              layoutCol={{ xs: 24 }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />

            <CustomSkeleton
              size='default'
              label="Số điện thoại" name="phone"
              type={CONSTANTS.TEXT}
              layoutItem={{ labelCol: { xs: { span: 6 }, md: { span: 10 } } }}
              layoutCol={{ xs: 24, md: 12 }}
              rules={[RULES.REQUIRED]}
              labelLeft
            />

            <CustomSkeleton
              size='default'
              label="Giới tính" name="gender"
              type={CONSTANTS.SELECT}
              layoutItem={{ labelCol: { xs: { span: 6 }, md: { span: 6 } } }}
              layoutCol={{ xs: 24, md: 12 }}
              options={{ data: GENDER_OPTIONS }}
              labelLeft
            />

            <CustomSkeleton
              size='default'
              label="Tên tài khoản" name="username"
              disabled={props.type === CONSTANTS.UPDATE}
              type={CONSTANTS.TEXT}
              layoutItem={{ labelCol: { xs: { span: 6 }, md: { span: 5 } } }}
              layoutCol={{ xs: 24 }}
              rules={props.type === CONSTANTS.CREATE ? [RULES.REQUIRED, RULES.USERNAME_RANGER] : []}
              helpInline={false}
              labelLeft
            />

            {props.type === CONSTANTS.CREATE && <Fragment>
              <CustomSkeleton
                size='default'
                label="Mật khẩu" name="password"
                type={CONSTANTS.PASSWORD}
                layoutCol={{ xs: 24 }}
                layoutItem={{ labelCol: { xs: 6, md: 5 } }}
                rules={[RULES.REQUIRED, RULES.PASSWORD_FORMAT]}
                helpInline={false}
                labelLeft
              />

              <CustomSkeleton
                size='default'
                label="Nhập lại mật khẩu" name="rePassword"
                type={CONSTANTS.PASSWORD}
                layoutCol={{ xs: 24 }}
                layoutItem={{ labelCol: { xs: 6, md: 5 } }}
                dependencies={['password']}
                rules={[
                  RULES.REQUIRED,
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Không khớp, vui lòng thử lại!');
                    },
                  }),
                ]}
                helpInline={false}
                labelLeft
              />
            </Fragment>}

            <CustomSkeleton
              size='default'
              label="Email" name="email"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 6, md: 5 } }}
              rules={[RULES.EMAIL, RULES.REQUIRED]}
              helpInline={false}
              labelLeft
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

export default (connect(mapStateToProps)(CreateOrModifyUser));
