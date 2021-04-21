import React, { lazy } from 'react';
import {ROLE} from '@src/constants/contans';
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
  UsergroupAddOutlined
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
const ThemFile = lazy(() => import('@containers/QuanLyDanhMuc/QuanLySinhVienTTTN/ThemFile'));
const DiaDiemThucTap = lazy(() => import('@containers/QuanLyDanhMuc/QuanLyDiaDiemThucTap/DiaDiemThucTap'));
const NamHoc = lazy(() => import('@containers/QuanLyDanhMuc/QuanLyNamHoc/NamHoc'));


const DangKyThucTap = lazy(() => import('@containers/ThucTap/DangKyThucTap/DangKyThucTap'));
const DotThucTap = lazy(() => import('@containers/ThucTap/DotThucTap/DotThucTap'));

const NhomThucTap = lazy(() => import('@containers/ThucTap/NhomThucTap/NhomThucTap'));
const ThemNhomThucTap = lazy(() => import('@containers/ThucTap/NhomThucTap/NhomThucTapChiTiet'));
const NhomThucTapChiTiet = lazy(() => import('@containers/ThucTap/NhomThucTap/NhomThucTapChiTiet'));
const ChiTiet = lazy(() => import('@containers/ThucTap/NhomThucTap/ChiTiet/ChiTiet'));
const ReportSinhVienDKTT = lazy(() => import('@containers/ThongKe/ReportSinhVienDKTT'));
const ReportNhomThucTap = lazy(() => import('@containers/ThongKe/ReportNhomThucTap'));


function renderIcon(icon) {
  return <span role="img" aria-label="unordered-list" className="anticon">
      <div className='position-absolute' style={{ top: '50%', transform: 'translateY(-50%)' }}>
        <div className='position-relative' style={{ width: '14px', height: '14px' }}>
          <i className={`fas fa-${icon} position-center`}/>
        </div>
      </div>
    </span>;
}

export const ConstantsRoutes = [
  { isRedirect: true, exact: true, from: '/', to: URL.MENU.DASHBOARD , role : [ROLE.ADMIN,ROLE.SINH_VIEN,ROLE.GIAO_VU]},
  {
    role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
    path: URL.MENU.DASHBOARD,
    breadcrumbName: 'Dashboard',
    menuName: 'Dashboard',
    component: Dashboard,
    icon: renderIcon('chart-pie'),
    exact: true,
  },
  // { menuGroup: 'Quản lý người dùng' },
  { path: URL.MENU.USER, role : [ROLE.ADMIN], menuName: 'Danh sách người dùng', component: User, icon: renderIcon('users') },
  // {
  //   path: URL.MENU.USER,
  //   menuName: 'Quản lý người dùng',
  //   icon: <UserOutlined/>,
  //   children: [
  //
  //   ],
  // },
  // { menuGroup: 'Quản lý danh mục' },
  {
    role : [ROLE.ADMIN,ROLE.GIAO_VU],
    path: URL.MENU.DANH_MUC_QUAN_LY,
    menuName: 'Danh mục quản lý',
    icon: renderIcon('list-ul'),
    children: [
      {
        path: URL.MENU.GIAO_VIEN,
        menuName: 'Quản lý giảng viên',
        component: GiaoVien,
        icon: renderIcon('chalkboard-teacher'),
        role : [ROLE.ADMIN, ROLE.GIAO_VU],

      },
      {
        path: URL.MENU.SINH_VIEN,
        menuName: 'Quản lý sinh viên',
        component: SinhVien,
        icon: renderIcon('user-graduate'),
        role : [ROLE.ADMIN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.BO_MON, menuName: 'Quản lý bộ môn',
        component: BoMon,
        icon: renderIcon('layer-group'),
        role : [ROLE.ADMIN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.LOP_HOC, menuName: 'Quản lý lớp học',
        component: LopHoc,
        icon: renderIcon('school'),
        role : [ROLE.ADMIN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.DIA_DIEM_THUC_TAP,
        menuName: 'Quản lý địa điểm',
        component: DiaDiemThucTap,
        icon: renderIcon('map-marker-alt'),
        role : [ROLE.ADMIN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.NAM_HOC, menuName: 'Quản lý năm học',
        component: NamHoc,
        icon: renderIcon('calendar'),
        role : [ROLE.ADMIN, ROLE.GIAO_VU],
      },
    ],
  },
  // { menuGroup: 'Thực tập' },
  {
    role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
    path: URL.MENU.QUAN_LY_THUC_TAP,
    menuName: 'Quản lý thực tập',
    icon: renderIcon('business-time'),
    children: [
      {
        path: URL.MENU.DANG_KY_TUC_TAP,
        menuName: 'Đăng ký thực tập',
        component: DangKyThucTap,
        icon: renderIcon('pen-alt'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.DOT_THUC_TAP,
        menuName: 'Đợt thực tập',
        component: DotThucTap,
        icon: renderIcon('calendar-alt'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.NHOM_THUC_TAP,
        menuName: 'Nhóm thực tập',
        component: NhomThucTap,
        icon: renderIcon('user-friends'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
    ],
  },
  {
    role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
    path: URL.MENU.QUAN_LY_DE_TAI,
    menuName: 'Quản lý đề tài thực tập',
    icon: renderIcon('file-signature'),
    children: [
      {
        path: URL.MENU.DE_TAI_TTTN,
        menuName: 'Danh sách đề tài',
        component: DeTai,
        icon: renderIcon('list-alt'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.DANG_KY_DE_TAI,
        menuName: 'Đăng ký đề tài',
        component: DangKyDeTai,
        icon: renderIcon('edit'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
    ],
  },
  {
    role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.GIAO_VU],
    path: URL.MENU.THONG_KE,
    menuName: 'Thống kê',
    icon: renderIcon('chart-line'),
    children: [
      {
        path: URL.MENU.THONG_KE_DKTT,
        menuName: 'Sinh viên ĐKTT',
        component: ReportSinhVienDKTT,
        icon: renderIcon('user-graduate'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.THONG_KE_NHOM_THUC_TAP,
        menuName: 'Nhóm, địa điểm thực tập',
        component: ReportNhomThucTap,
        icon: renderIcon('user-friends'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
    ],
  },

  // { menuGroup: 'Đề tài thực tập' },
  { path: URL.MY_INFO, breadcrumbName: 'Thông tin cá nhân', component: MyInfo , role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN,ROLE.GIAO_VU]},
  { path: URL.FILE_SINH_VIEN, component: ThemFile, role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU] },
  {
    path: URL.MENU.ADD_NHOM_THUC_TAP,
    breadcrumbName: 'Thêm nhóm thực tập',
    component: ThemNhomThucTap,
    role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
  },
  {
    path: `${URL.MENU.NHOM_THUC_TAP_CHI_TIET}/:id`,
    breadcrumbName: 'Chi tiết nhóm thực tập',
    component: NhomThucTapChiTiet,
    role: [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
  },
  {
    path: `${URL.MENU.CHI_TIET_NHOM}/:id`,
    breadcrumbName: 'Chi tiết nhóm',
    component: ChiTiet,
    role: [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
  },


];



