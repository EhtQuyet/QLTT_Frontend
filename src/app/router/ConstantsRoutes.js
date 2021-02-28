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
const GiaoVien = lazy(() => import('@containers/QuanLyDanhMuc/QuanLyGiaoVienHD/GiaoVien'));
const SinhVien = lazy(() => import('@containers/QuanLyDanhMuc/QuanLySinhVienTTTN/SinhVien'));
const BoMon = lazy(() => import('@containers/QuanLyDanhMuc/QuanLyBoMon/BoMon'));
const LopHoc = lazy(() => import('@containers/QuanLyDanhMuc/QuanLyLopHoc/LopHoc'));
const DeTai = lazy(() => import('@containers/QuanLyDeTaiTTTN/DeTaiTTTN'));
const DangKyDeTai = lazy(() => import('@containers/DangKyDeTaiTTTN/DangKyDeTai'));
// import ChiTietDangKyDeTai from '@containers/DangKyDeTaiTTTN/ChiTietDangKyDeTai';

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

  {
    path: URL.MENU.DANH_MUC_QUAN_LY,
    menuName: 'Danh mục quản lý',
    icon: <UnorderedListOutlined/>,
    children: [
      {
        path: URL.MENU.GIAO_VIEN,
        menuName: 'Quản lý giáo viên',
        component: GiaoVien,
        icon: <GroupOutlined/>,
      },
      { path: URL.MENU.SINH_VIEN, menuName: 'Quản lý sinh viên', component: SinhVien, icon: <GroupOutlined/> },
      { path: URL.MENU.BO_MON, menuName: 'Quản lý bộ môn', component: BoMon, icon: <GroupOutlined/> },
      { path: URL.MENU.LOP_HOC, menuName: 'Quản lý lớp học', component: LopHoc, icon: <GroupOutlined/> },
    ],
  },
  {
    path: URL.MENU.DE_TAI_TTTN,
    menuName: 'Quản lý đề tài tốt nghiệp',
    component: DeTai,
    icon: <UnorderedListOutlined/>,
  },
  {
    path: URL.MENU.DANG_KY_DE_TAI,
    menuName: 'Đăng ký đề tài tốt nghiệp',
    component: DangKyDeTai,
    icon: <UnorderedListOutlined/>,
  },

  // {
  //   path: `${URL.MENU.DANG_KY_DE_TAI}/:id`,
  //   breadcrumbName: 'Đăng ký đề tài',
  //   component: ChiTietDangKyDeTai,
  // },
];



