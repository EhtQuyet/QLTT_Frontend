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
const LinhVuc = lazy(() => import('@containers/LinhVuc/linhVucManagerment'));

const TuKhoa = lazy(() => import('@containers/QuanLyTuKhoa/tuKhoaManagerment'));
const Ngach = lazy(() => import('@containers/NgachGiangVien/ngachGVManagerment'));

// const KeHoach = lazy(() => import('@containers/KeHoachThucTap/keHoachManagerment'));
const NhatKyIndex = lazy(() => import('@containers/NhatKyThucTap/index'));
// const KeHoachDetail = lazy(() => import('@containers/KeHoachThucTap/keHoachDetail'));
// const ThemKeHoach = lazy(() => import('@containers/KeHoachThucTap/keHoachDetail'));
const KiemDuyetNhatKy = lazy(() => import('@containers/NhatKyThucTap/KiemDuyetNhatKy'));
const NhatKyItem = lazy(() => import('@containers/NhatKyThucTap/NhatKyItem'));
// const KeHoach = lazy(() => import('@containers/ThucTap/KeHoachThucTap/KeHoach'));
// const KeHoachChiTiet = lazy(() => import('@containers/ThucTap/KeHoachThucTap/KeHoachChiTiet'));
// const ThemKeHoach = lazy(() => import('@containers/ThucTap/KeHoachThucTap/KeHoachChiTiet'));

const NhiemVu_DotThucTap = lazy(() => import('@containers/ThucTap/NhiemVuSinhVien/nhiemVu-dotThucTap'));
const NhiemVu_SinhVien = lazy(() => import('@containers/ThucTap/NhiemVuSinhVien/nhiemVu-sinhVien'));
const NhiemVuManagerment = lazy(() => import('@containers/ThucTap/NhiemVuSinhVien/nhiemVuManagerment'));

const DangKyThucTap = lazy(() => import('@containers/ThucTap/DangKyThucTap/DangKyThucTap'));
const ThemDangKyThucTap = lazy(() => import('@containers/ThucTap/DangKyThucTap/DKTTDetail'));
const DangKyThucTapChiTiet = lazy(() => import('@containers/ThucTap/DangKyThucTap/DKTTDetail'));
const PheDuyetDangKy = lazy(() => import('@containers/ThucTap/DangKyThucTap/PheDuyetDangKy'));


const DanhGiaDeTai = lazy(() => import('@containers/DeTaiThucTap/DanhGiaTrungLap/index'));

const DotThucTap = lazy(() => import('@containers/ThucTap/DotThucTap/DotThucTap'));

const NhomThucTap = lazy(() => import('@containers/ThucTap/NhomThucTap/NhomThucTap'));
const ThemNhomThucTap = lazy(() => import('@containers/ThucTap/NhomThucTap/NhomThucTapChiTiet'));
const NhomThucTapChiTiet = lazy(() => import('@containers/ThucTap/NhomThucTap/NhomThucTapChiTiet'));

const ChiTiet = lazy(() => import('@containers/ThucTap/NhomThucTap/ChiTiet/ChiTiet'));
const ReportSinhVienDKTT = lazy(() => import('@containers/ThongKe/ReportSinhVienDKTT'));
const ReportNhomThucTap = lazy(() => import('@containers/ThongKe/ReportNhomThucTap'));

const DanhSachDeTai = lazy(() => import('@containers/DeTaiThucTap/DanhSachDeTai/index'));
const DeTaiDangThucHien = lazy(() => import('@containers/DeTaiThucTap/DeTaiDangThucHien/index'));
const DeTaiDaHoanThanh = lazy(() => import('@containers/DeTaiThucTap/DeTaiDaHoanThanh/index'));



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
        path: URL.MENU.LINH_VUC, menuName: 'Quản lý lĩnh vực',
        component: LinhVuc,
        icon: renderIcon('layer-group'),
        role : [ROLE.ADMIN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.NGACH_GV, menuName: 'Ngạch giảng viên',
        component: Ngach,
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
      {
        path: URL.MENU.TU_KHOA, menuName: 'Quản lý từ khóa',
        component: TuKhoa,
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
        path: URL.MENU.DOT_THUC_TAP,
        menuName: 'Đợt thực tập',
        component: DotThucTap,
        icon: renderIcon('calendar-alt'),
        role : [ROLE.ADMIN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.DANG_KY_THUC_TAP,
        menuName: 'Đăng ký thực tập',
        component: DangKyThucTap,
        icon: renderIcon('pen-alt'),
        role : [ROLE.ADMIN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.DANG_KY_THUC_TAP,
        menuName: 'Sinh viên hướng dẫn',
        component: DangKyThucTap,
        icon: renderIcon('pen-alt'),
        role : [ROLE.GIANG_VIEN],
      },
      {
        path: URL.MENU.NHOM_THUC_TAP,
        menuName: 'Nhóm thực tập',
        component: NhomThucTap,
        icon: renderIcon('user-friends'),
        role : [ROLE.ADMIN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
      // {
      //   path: URL.MENU.KE_HOACH_THUC_TAP,
      //   menuName: 'Kế hoạch thực tập',
      //   component: KeHoach,
      //   icon: renderIcon('user-friends'),
      //   role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN],
      // },
      {
        path: URL.MENU.NHAT_KY_THUC_TAP,
        menuName: 'Nhật ký thực tập',
        component: NhatKyIndex,
        icon: renderIcon('user-friends'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN],
      },
      {
        path: URL.MENU.NHIEM_VU_DOT_THUC_TAP,
        menuName: 'Nhiệm vụ sinh viên',
        component: NhiemVu_DotThucTap,
        icon: renderIcon('briefcase'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN],
      },
      {
        path: URL.MENU.NHIEM_VU_SINH_VIEN,
        menuName: 'Nhiệm vụ sinh viên',
        component: NhiemVuManagerment,
        icon: renderIcon('briefcase'),
        role : [ROLE.SINH_VIEN],
      },
    ],
  },
  {
    role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
    path: URL.MENU.QUAN_LY_DE_TAI,
    menuName: 'Đề tài thực tập',
    icon: renderIcon('file-signature'),
    children: [
      {
        path: URL.MENU.DANH_SACH_DE_TAI,
        menuName: 'Danh sách đề tài',
        component: DanhSachDeTai,
        icon: renderIcon('list-alt'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.DE_TAI_DANG_THUC_HIEN,
        menuName: 'Đề tài đang thực hiện',
        component: DeTaiDangThucHien,
        icon: renderIcon('spinner'),
        role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      },
      {
        path: URL.MENU.DE_TAI_DA_HOAN_THANH,
        menuName: 'Đề tài đã hoàn thành',
        component: DeTaiDaHoanThanh,
        icon: renderIcon('check-circle'),
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
      // {
      //   path: URL.MENU.THONG_KE_NHOM_THUC_TAP,
      //   menuName: 'Nhóm, địa điểm thực tập',
      //   component: ReportNhomThucTap,
      //   icon: renderIcon('user-friends'),
      //   role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
      // },
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
  // {
  //   path: URL.MENU.THEM_KE_HOACH,
  //   breadcrumbName: 'Thêm kế hoạch',
  //   component: ThemKeHoach,
  //   role: [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
  // },
  // {
  //   path: `${URL.MENU.KE_HOACH_CHI_TIET}/:id`,
  //   breadcrumbName: 'Chi tiết kế hoạch',
  //   component: KeHoachChiTiet,
  //   role: [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
  // },
  // {
  //   path: URL.MENU.DANG_KY_THUC_TAP_CHI_TIET,
  //   breadcrumbName: 'Đăng ký thực tập',
  //   component: ThemDKTTDetail,
  //   role: [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
  // },
  // {
  //   path:  `${URL.MENU.DANG_KY_THUC_TAP_CHI_TIET}/:id`,
  //   breadcrumbName: 'Đăng ký thực tập',
  //   component: DKTTDetail,
  //   role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
  // },
  {
    path: URL.MENU.THEM_DANG_KY_THUC_TAP,
    breadcrumbName: 'Thêm đăng ký thực tập',
    component: ThemDangKyThucTap,
    role : [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
  },
  {
    path: `${URL.MENU.DANG_KY_THUC_TAP_CHI_TIET}/:id`,
    breadcrumbName: 'Đăng ký thực tập chi tiết',
    component: DangKyThucTapChiTiet,
    role: [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.SINH_VIEN, ROLE.GIAO_VU],
  },
  {
    path: `${URL.MENU.PHE_DUYET_DANG_KY}/:id`,
    breadcrumbName: 'Phê duyệt đăng ký thực tập',
    component: PheDuyetDangKy,
    role: [ROLE.ADMIN, ROLE.GIANG_VIEN, ROLE.GIAO_VU],
  },
  {
    path: `${URL.MENU.KIEM_DUYET_NHAT_KY}/:id`,
    breadcrumbName: 'Kiểm duyệt nhật ký',
    component: KiemDuyetNhatKy,
    role: [ROLE.GIANG_VIEN, ROLE.BAN_CHU_NHIEM],
  },
  {
    path: `${URL.MENU.NHAT_KY_ITEM}/:id`,
    breadcrumbName: 'Nhật ký item',
    component: NhatKyItem,
    role: [ROLE.GIANG_VIEN],
  },
  {
    path: `${URL.MENU.DANH_GIA_DE_TAI}/:id`,
    breadcrumbName: 'Đánh giá đề tài',
    component: DanhGiaDeTai,
    role: [ROLE.GIAO_VU],
  },

  {
    path: `${URL.MENU.NHIEM_VU_SINH_VIEN}/:id`,
    breadcrumbName: 'Nhiệm vụ sinh viên',
    component: NhiemVuManagerment,
    role: [ROLE.GIANG_VIEN],
  },
  {
    path: `${URL.MENU.NHIEM_VU}/:id`,
    breadcrumbName: 'Danh sách sinh viên hướng dẫn',
    component: NhiemVu_SinhVien,
    role: [ROLE.GIANG_VIEN],
  },
];



