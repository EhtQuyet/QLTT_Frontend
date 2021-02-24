import React, { Component, Fragment } from 'react';
import { Button, Row, Input, Form } from 'antd';
import { connect } from 'react-redux';

import * as app from '@app/store/ducks/app.duck';
import './Login.scss';
import { RULES } from '@constants';

class Login extends Component {

  async handleLogin(value) {
    this.props.login(value);
  }

  render() {
    const { loading } = this.props;

    return <Fragment>
      <div id='login'>
        <div className='login-form'>
          <div className='logo'>
            <img alt="" src='https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'/>
            <span>Quản lý thực tập</span>
          </div>
          <Form id="formModal"  size='large' layout='vertical' onFinish={this.handleLogin.bind(this)} autoComplete="new-password">
            <Form.Item label='Tài khoản' name="username" rules={[RULES.REQUIRED]}>
              <Input placeholder='Tài khoản' disabled={loading}/>
            </Form.Item>
            <Form.Item label='Mật khẩu' name="password" rules={[RULES.REQUIRED]}>
              <Input.Password placeholder='******' disabled={loading} autoComplete="new-password"/>
            </Form.Item>
            <Row className='pt-3'>
              <Button type="primary" htmlType="submit" loading={loading}>Đăng nhập</Button>
            </Row>
          </Form>
        </div>
      </div>
    </Fragment>;
  }
}

function mapStateToProps(store) {
  const { isLogin } = store.app;
  return { isLogin };
}

export default (connect(mapStateToProps, app.actions)(Login));
