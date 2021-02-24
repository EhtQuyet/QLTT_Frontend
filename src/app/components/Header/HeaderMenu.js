import React from 'react';
import { connect } from 'react-redux';
import { Link, Route, withRouter } from 'react-router-dom';
import { Avatar, Dropdown, Menu } from 'antd';
import {
  UserOutlined,
} from '@ant-design/icons';
import { URL } from '@url';

import * as app from '@app/store/ducks/app.duck';


function HeaderMenu({ history, ...props }) {
  const { pathname } = history.location;

  const menu = (
    <Menu
      selectedKeys={pathname}>
      <Menu.Item key={URL.MY_INFO}>
        <Link to={URL.MY_INFO}>
          Thông tin cá nhân
        </Link>
      </Menu.Item>
      <Menu.Item onClick={() => props.clearToken()}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <React.Fragment>
      <span style={{ alignSelf: 'center', fontSize: '15px' }}>
        {props.myInfo.full_name}
      </span>
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
        <Avatar style={{ margin: 'auto 15px' }} icon={<UserOutlined/>}/>
      </Dropdown>
    </React.Fragment>
  );
}

function mapStateToProps(store) {
  const { siderCollapsed, isBroken, token } = store.app;
  const { myInfo } = store.user;
  return { siderCollapsed, isBroken, token, myInfo };
}

export default (connect(mapStateToProps, app.actions)(withRouter(HeaderMenu)));
