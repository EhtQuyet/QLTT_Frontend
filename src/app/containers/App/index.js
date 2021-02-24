import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Drawer, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

import { CONSTANTS, TOKEN_EXP_TIME } from '@constants';
import * as app from '@app/store/ducks/app.duck';
import * as user from '@app/store/ducks/user.duck';

import CustomBreadcrumb from '@components/CustomBreadcrumb/CustomBreadcrumb';
import Routes from '@app/router/Routes';
import CustomMenu from '@components/CustomMenu/CustomMenu';
import Login from '@components/Login/Login';
import HeaderMenu from '@components/Header/HeaderMenu';
import { toast } from '@app/common/functionCommons';

const { Header, Footer, Sider, Content } = Layout;

let timer = null;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBroken: false,
      isShowDrawer: false,
    };

    this.setTime = this.setTime.bind(this);
    this.handleAutoLogout = this.handleAutoLogout.bind(this);
  }

  componentDidMount() {
    this.props.getToken();
    this.setTime();
    window.addEventListener('keydown', this.setTime);
    window.addEventListener('click', this.setTime);

    this.handleAutoLogout();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.setTime);
    window.removeEventListener('click', this.setTime);
  }

  setTime() {
    localStorage.removeItem('TIME');
    localStorage.setItem('TIME', new Date().getTime().toString());
  }

  handleAutoLogout(timeOut = TOKEN_EXP_TIME) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const timeStart = localStorage.getItem('TIME');
      const timeEnd = new Date().getTime();
      if ((timeEnd - parseInt(timeStart)) < timeOut) {
        this.handleAutoLogout();
      } else {
        const token = Cookies.get('token');
        if (token) {
          this.props.clearToken();
          toast(CONSTANTS.WARNING, 'Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại');
        }
      }
    }, timeOut);
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onBreakpoint(broken) {
    this.setState({
      isBroken: broken,
      isShowDrawer: false,
    });
  }

  toggleCollapsed() {
    const { siderCollapsed } = this.props;
    const { isBroken, isShowDrawer } = this.state;
    if (isBroken) {
      this.setState({ isShowDrawer: !isShowDrawer });
    } else {
      this.props.toggleSider(!siderCollapsed);
    }
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const { token } = this.props;
    if (token !== nextProps.token && nextProps.token) {
      this.props.requestUser();

    }
  }

  render() {
    const { siderCollapsed, token } = this.props;
    const { isBroken, isShowDrawer } = this.state;

    if (!token) return <Login/>;
    return (
      <Layout>
        <Sider
          width='220'
          // collapsedWidth={60}
          breakpoint="md"
          style={isBroken ? { display: 'none' } : ''}
          trigger={null} theme='light' collapsible={!isBroken} collapsed={siderCollapsed}
          onBreakpoint={broken => this.onBreakpoint(broken)}>
          <CustomMenu/>
        </Sider>

        <Drawer
          placement='left'
          bodyStyle={{ padding: 0 }}
          width='220'
          closable={false}
          onClose={this.toggleCollapsed.bind(this)}
          visible={isShowDrawer}
        >
          <Sider width='220' trigger={null} theme='light'>
            <CustomMenu/>
          </Sider>
        </Drawer>

        <Layout className="site-layout" style={{ minHeight: '100%', position: 'relative', overflow: 'hidden' }}>
          <Header className="site-layout-background" size='small'
                  style={{ padding: 0, position: 'sticky', top: 0, left: 0, right: 0, zIndex: 2 }}>
            {React.createElement(isBroken
              ? MenuUnfoldOutlined
              : siderCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggleCollapsed.bind(this),
            })}
            <div className='pull-right' style={{ height: '100%', display: 'flex' }}>
              <HeaderMenu/>
            </div>
          </Header>
          <div style={{ height: 'calc(100% - 50px)', position: 'relative' }} className='custom-scrollbar flex-column'>
            <CustomBreadcrumb/>
            <div style={{ flex: 'auto' }}>
              <Content className="site-layout-background"
                       style={{ margin: '0 16px 16px 16px', padding: 16, zIndex: 1 }}>
                <Routes/>
              </Content>
            </div>

            <Footer style={{ textAlign: 'center' }}>2020-2021 © Design by QBC form IT HDU</Footer>
          </div>
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(store) {
  const { siderCollapsed, token } = store.app;
  return { siderCollapsed, token };
}

export default (connect(mapStateToProps, { ...app.actions, ...user.actions })(withRouter(App)));
