import React, { lazy } from 'react';

import { URL } from '@url';
import {
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
  InboxOutlined,
  HddOutlined,
  DeploymentUnitOutlined,
  ClusterOutlined,
  GroupOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DiffOutlined,
  SnippetsOutlined,
  ArrowsAltOutlined,
} from '@ant-design/icons';

const Dashboard = lazy(() => import('@containers/Dashboard/Dashboard'));
const User = lazy(() => import('@containers/User/User'));
const MyInfo = lazy(() => import('@containers/MyInfo/MyInfo'));




export const ConstantsRoutes = [
  { isRedirect: true, exact: true, from: '/', to: URL.MENU.DASHBOARD },
  {
    path: URL.MENU.DASHBOARD,
    breadcrumbName: 'Dashboard',
    menuName: 'Dashboard',
    component: Dashboard,
    icon: <DashboardOutlined/>,
    exact: true,
  },
  {
    path: URL.MENU.USER,
    menuName: 'Quản lý người dùng',
    icon: <UserOutlined/>,
    children: [
      { path: URL.MENU.USER, menuName: 'Danh sách người dùng', component: User, icon: <UserOutlined/> },
    ],
  },


  { path: URL.MY_INFO, breadcrumbName: 'Thông tin cá nhân', component: MyInfo },

];



