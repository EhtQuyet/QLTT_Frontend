import React, { useState } from 'react';
import { Form, Button, Row, Card, Col } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { SaveFilled } from '@ant-design/icons';

import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, RULES } from '@constants';
import * as user from '@app/store/ducks/user.duck';
import * as app from '@app/store/ducks/app.duck';

function MyInfo({ myInfo, isLoading, ...props }) {
  const [tabActive, setActiveTab] = useState('1');
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({
      code: myInfo.code,
      fullName: myInfo.full_name,
      gender: myInfo.gender,
      birthday: myInfo.birthday ? moment(myInfo.birthday) : '',
      email: myInfo.email,
      phone: myInfo.phone,
      role: myInfo.role,
    });
  }, []);

  function handleUpdateMyInfo() {
    const { code, fullName, gender, birthday, email, phone, role } = form.getFieldsValue();
    props.updateMyInfo({
      code: code,
      full_name: fullName,
      gender: gender,
      birthday: birthday ? new Date(birthday) : null,
      email: email,
      phone: phone,
      role: role,
    });
  }

  const tabList = [
    {
      key: '1',
      tab: 'Thông tin cá nhân',
    },
    {
      key: '2',
      tab: 'Đổi mật khẩu',
    },
  ];
  return (
    <div>
      <Card
        size='small'
        tabProps={{ 'size': 'small', bordered: 'false' }}
        bordered={false}
        style={{ width: '100%' }}
        tabList={tabList}
        activeTabKey={tabActive}
        onTabChange={key => setActiveTab(key)}
      >
        {(tabActive === '1') && <div>
          <Form form={form} autoComplete='off' onFinish={handleUpdateMyInfo}>
            <Row gutter={15}>
              <Col md={12}>
                <Row gutter={15}>
                  <CustomSkeleton
                    label="Mã" name="code"
                    type={CONSTANTS.TEXT}
                    layoutItem={{ labelCol: { span: 8 } }}
                    layoutCol={{ xs: 24 }}
                    disabled/>
                  <CustomSkeleton
                    label="Họ tên" name="fullName"
                    type={CONSTANTS.TEXT}
                    layoutItem={{ labelCol: { span: 8 } }}
                    layoutCol={{ xs: 24 }}
                    rules={[RULES.REQUIRED]}
                    disabled={isLoading}/>
                  <CustomSkeleton
                    label="Giới tính" name="gender"
                    type={CONSTANTS.SELECT}
                    options={{ data: GENDER_OPTIONS }}
                    layoutItem={{ labelCol: { span: 8 } }}
                    layoutCol={{ xs: 24 }}
                    rules={[RULES.REQUIRED]}
                    disabled={isLoading}/>
                  <CustomSkeleton
                    label="Ngày sinh" name="birthday"
                    type={CONSTANTS.DATE}
                    layoutItem={{ labelCol: { span: 8 } }}
                    layoutCol={{ xs: 24 }}
                    disabled={isLoading}/>
                  <CustomSkeleton
                    label="Email" name="email"
                    type={CONSTANTS.TEXT}
                    layoutItem={{ labelCol: { span: 8 } }}
                    layoutCol={{ xs: 24 }}
                    disabled={isLoading}/>
                  <CustomSkeleton
                    label="Điện thoại" name="phone"
                    type={CONSTANTS.TEXT}
                    layoutItem={{ labelCol: { span: 8 } }}
                    layoutCol={{ xs: 24 }}
                    rules={[RULES.PHONE]}
                    disabled={isLoading}/>
                  <CustomSkeleton
                    label="Vai trò" name="role"
                    type={CONSTANTS.SELECT}
                    options={{ data: GENDER_OPTIONS }}
                    layoutItem={{ labelCol: { span: 8 } }}
                    layoutCol={{ xs: 24 }}
                    disabled/>
                  <Col xs={24}>
                    <Button
                      htmlType="submit" size='small'
                      type="primary" className='float-right'
                      icon={<SaveFilled/>}
                      disabled={isLoading}>
                      Lưu
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>}
      </Card>

    </div>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return { isLoading, myInfo };
}

export default (connect(mapStateToProps, { ...app.actions, ...user.actions })(MyInfo));
