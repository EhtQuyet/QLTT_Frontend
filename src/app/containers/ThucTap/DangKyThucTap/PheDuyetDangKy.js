import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, Tag } from 'antd';
import AddNewButton from '@AddNewButton';
import CreateAndModify from './CreateAndModify';
import {
  createDKTT,
  deleteDKTT,
  getAllDKTT,
  updateDKTT,
  getById,
  xacNhanHD,
} from '@app/services/ThucTap/DKThucTap/dangkythuctapService';
import {
  getAllSinhVien,
} from '@app/services/SinhVienTTTN/sinhVienTTService';
import {
  createDiaDiemThucTap,
} from '@app/services/DiaDiemThucTap/diadiemthuctapService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, TRANG_THAI } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import { connect } from 'react-redux';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import * as giaovien from '@app/store/ducks/giaovien.duck';
import * as diadiem from '@app/store/ducks/diadiem.duck';
import * as user from '@app/store/ducks/user.duck';
import * as dotthuctap from '@app/store/ducks/dotthuctap.duck';
import * as sinhvien from '@app/store/ducks/sinhvien.duck';
import { DANG_KY_THUC_TAP, ROLE } from '@src/constants/contans';
import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getAllGiaoVien } from '@app/services/GiaoVienHD/giaoVienService';


function PheDuyetDangKy({ isLoading, myInfo, dotthuctapList, teacherList, diadiemList, sinhVienList, ...props }) {
  const [dkthuctap, setDkthuctap] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const [isSig, setIsSig] = useState(null);
  const recordId = useParams()?.id;
  console.log('recordId', recordId);

  useEffect(() => {
    if (!props?.teacherList?.length) {
      props.getTeacher();
    }
    if (!props?.diadiemList?.length) {
      props.getDiaDiem();
    }
    if (!props?.dotthuctapList?.length) {
      props.getDotThucTap();
    }
    if (!props?.sinhVienList?.length) {
      props.getSinhVien();
    }
    (async () => {
      await getData();
      await getDataInfo();
    })();
  }, []);

  async function getDataInfo() {
    // const apiResponse = await getById(myInfo.username);
    // if (apiResponse) {
    //   setIsSig(apiResponse);
    // }
  }

  async function xacNhanHuongDan(value) {
    const api = await xacNhanHD(value);
    console.log('api', api);
    console.log('id', value);
  }

  async function getData(
    currentPage = dkthuctap.currentPage,
    pageSize = dkthuctap.pageSize,
    query = dkthuctap.query,
  ) {
    query.dot_thuc_tap = recordId;
    if (isGiangVien) {
      const apiGiangVien = await getAllGiaoVien(1, 0, { ma_giao_vien: myInfo.username });
      query.giao_vien_huong_dan = apiGiangVien.docs[0]._id
      const apiResponse = await getAllDKTT(currentPage, pageSize, query);
      if (apiResponse) {
        setDkthuctap({
          docs: apiResponse.docs,
          totalDocs: apiResponse.totalDocs,
          pageSize: apiResponse.limit,
          currentPage: apiResponse.page,
          query: query,
        });
      }
    }

    const apiResponse = await getAllDKTT(currentPage, pageSize, query);
    if (apiResponse) {
      setDkthuctap({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = dkthuctap.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    dot_thuc_tap: data.dot_thuc_tap,
    giaovien_huongdan: data.giao_vien_huong_dan,
    sinhVien: data.sinh_vien,
    diadiem_thuctap: data.dia_diem_thuc_tap,
    diemTichLuy: data.diem_tbtl,
    tinchi_tichluy: data.so_tctl,
    trang_thai: data.trang_thai,
  }));
  const columns = [
    columnIndex(dkthuctap.pageSize, dkthuctap.currentPage),
    {
      title: 'Đợt thực tập',
      dataIndex: 'dot_thuc_tap',
      render: value => value?.ten_dot,
      width: 300,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'sinhVien',
      render: value => value?.ten_sinh_vien,
      width: 200,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'sinhVien',
      render: value => value?.ma_sinh_vien,
      width: 200,
    },
    // {
    //   title: 'Tên giảng viên',
    //   dataIndex: 'giaovien_huongdan',
    //   render: value => value?.ten_giao_vien,
    //   width: 200,
    // },
    {
      title: 'Địa điểm thực tập',
      dataIndex: 'diadiem_thuctap',
      render: value => value?.ten_dia_diem,
      width: 200,
    },
    {
      title: 'Điểm TBTL',
      dataIndex: 'diemTichLuy',
      width: 100,
    },
    {
      title: 'Số TCTL',
      dataIndex: 'tinchi_tichluy',
      width: 100,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai ',
      render: value => {
        <>
          value === DANG_KY_THUC_TAP.DA_DANG_KY ? <Tag color='lime'>Đã đăng ký</Tag>
          : value === DANG_KY_THUC_TAP.KHONG_DU_DIEU_KIEN ? <Tag color='red'>Không đủ ĐKTT</Tag>
          : value === DANG_KY_THUC_TAP.DU_DIEU_KIEN ? <Tag color='lime'>Đủ ĐKTT</Tag>
          : value === DANG_KY_THUC_TAP.CHON_GIANG_VIEN ? <Tag color='lime'>Chọn giảng viên</Tag>
          : value === DANG_KY_THUC_TAP.GV_XAC_NHAN ? <Tag color='lime'>GV xác nhận</Tag>
          : value === DANG_KY_THUC_TAP.GV_TU_CHOI ? <Tag color='gold'>GV từ chối</Tag>
          : <Tag color='green'>Đã chia nhóm</Tag></>;
      }
      ,
      width: 200,
    },
    {
      align: 'center',
      render: (value) => {
        const daDangKy = value.trang_thai === DANG_KY_THUC_TAP.DA_DANG_KY;
        const daDuyet = value.trang_thai === DANG_KY_THUC_TAP.DA_DUOC_DUYET;
        const chonGV = value.trang_thai === DANG_KY_THUC_TAP.CHON_GIANG_VIEN;
        const gvXacNhan = value.trang_thai === DANG_KY_THUC_TAP.GV_XAC_NHAN;
        const daChiaNhom = value.trang_thai === DANG_KY_THUC_TAP.DA_CHIA_NHOM;

        return <>
          <div className='mt-2'>
            {daDangKy && (isGiaoVu || isAdmin) &&
            <Popconfirm
              title='Xác nhận điều kiện sinh viên thực tập'
              onConfirm={() => handleTrangThai(value._id, DANG_KY_THUC_TAP.CHON_GIANG_VIEN)}
              cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
              <Tag color='green' className='tag-action'>
                <SendOutlined/><span className='ml-1'>Duyệt điều kiện</span>
              </Tag>
            </Popconfirm>
            }
            {daDangKy && (isGiaoVu || isAdmin) &&
            <Popconfirm
              title='Xác nhận sinh viên chưa đủ điều kiện thực tập'
              onConfirm={() => handleTrangThai(value._id, DANG_KY_THUC_TAP.KHONG_DU_DIEU_KIEN)}
              cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
              <Tag color='red' className='tag-action'>
                <SendOutlined/><span className='ml-1'>Không đủ ĐK</span>
              </Tag>
            </Popconfirm>
            }
          </div>

          <div className='mt-2'>
            {chonGV && isGiangVien && myInfo.username === value.giaovien_huongdan.ma_giao_vien &&
            <Popconfirm
              title='Xác nhận hướng dẫn sinh viên'
              onConfirm={() => xacNhanHuongDan(value)}
              cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
              <Tag color='green' className='tag-action'>
                <SendOutlined/><span className='ml-1'>Chấp nhận</span>
              </Tag>
            </Popconfirm>
            }
            {chonGV && isGiangVien && myInfo.username === value.giaovien_huongdan.ma_giao_vien &&
            <Popconfirm
              title='Từ chối hướng dẫn sinh viên'
              onConfirm={() => handleTrangThai(value._id, DANG_KY_THUC_TAP.GV_TU_CHOI)}
              cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
              <Tag color='red' className='tag-action'>
                <SendOutlined/><span className='ml-1'>Từ chối</span>
              </Tag>
            </Popconfirm>
            }
          </div>
          {(value.sinhVien.ma_sinh_vien === myInfo.username || isGiaoVu || isAdmin) &&
          <ActionCell value={value} handleEdit={handleEdit} handleDelete={handleDelete}/>}

        </>;
      },
      width: 300,
    },
  ];

  function handleShowModal(isShowModal, userSelected = null) {
    setState({
      isShowModal,
      userSelected,
    });
  }

  function handleEdit(userSelected) {
    setState({ isShowModal: true, userSelected });
  }

  async function handleDelete(userSelected) {
    const apiResponse = await deleteDKTT(userSelected._id);
    if (apiResponse) {
      getData();
      toast(CONSTANTS.SUCCESS, 'Xóa đăng kí thực tập thành công');
    }
  }

// function create or modify
  async function createAndModify(type, dataForm) {
    const { giaoVien, diemTichLuy, tinchi_tichluy, diaDiem, maSinhVien, tenDiaDiem, diaChi } = dataForm;
    let dataRequest = {
      giao_vien_huong_dan: '',
      dia_diem_thuc_tap: '',
      diem_tbtl: '',
      so_tctl: '',
      dot_thuc_tap: recordId,
      sinh_vien: '',
    };
    if (diaDiem === '####') {
      const ddtt = {
        ten_dia_diem: tenDiaDiem,
        dia_chi: diaChi,
      };
      const apiResponse = await createDiaDiemThucTap(ddtt);
      if (apiResponse) {
        dataRequest.giao_vien_huong_dan = giaoVien;
        dataRequest.dia_diem_thuc_tap = apiResponse._id;
        dataRequest.diem_tbtl = diemTichLuy;
        dataRequest.so_tctl = tinchi_tichluy;
        dataRequest.dot_thuc_tap = dot_thuc_tap;
        dataRequest.sinh_vien = maSinhVien;
      }
    } else {
      dataRequest.giao_vien_huong_dan = giaoVien;
      dataRequest.dia_diem_thuc_tap = diaDiem;
      dataRequest.diem_tbtl = diemTichLuy;
      dataRequest.so_tctl = tinchi_tichluy;
      dataRequest.sinh_vien = maSinhVien;
    }
    if (type === CONSTANTS.CREATE) {
      if (myInfo.role === ROLE.SINH_VIEN) {
        const sinhVien = await getAllSinhVien(1, 0, { ma_sinh_vien: maSinhVien ? maSinhVien : myInfo.username });
        dataRequest.sinh_vien = sinhVien.docs[0]._id;
      }
      const apiResponse = await createDKTT(dataRequest);
      if (apiResponse) {
        getData();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới đăng kí thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateDKTT(dataRequest);
      if (apiResponse) {
        const docs = dkthuctap.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setDkthuctap(Object.assign({}, dkthuctap, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin đăng kí thành công');
      }
    }
  }

  function handleChangePagination(current, pageSize) {
    getData(current, pageSize);
  }

  async function handleTrangThai(id, trangThai) {
    const dataRequest = {
      _id: id,
      trang_thai: trangThai,
    };

    const apiResponse = await updateDKTT(dataRequest);
    if (apiResponse) {
      const docs = dkthuctap.docs.map(doc => {
        if (doc._id === apiResponse._id) {
          doc = apiResponse;
        }
        return doc;
      });
      setDkthuctap(Object.assign({}, dkthuctap, { docs }));
      toast(CONSTANTS.SUCCESS, 'thành công');
    }
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = dkthuctap.currentPage;
  pagination.total = dkthuctap.totalDocs;
  pagination.pageSize = dkthuctap.pageSize;

  const isAdmin = myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);

  return (
    <>
      <div>
        {/*<Filter*/}
        {/*  dataSearch={[*/}
        {/*    { name: 'ten_giao_vien', label: 'Tên giáo viên', type: CONSTANTS.TEXT },*/}
        {/*    { name: 'ma_giao_vien', label: 'Mã giáo viên ', type: CONSTANTS.TEXT },*/}
        {/*  ]}*/}
        {/*  handleFilter={(query) => getDataGiaoVien(1, giaovien.pageSize, query)}/>*/}

        {/*{isSig && isSig === null && */}
        {(isGiaoVu || isAdmin) &&
        <AddNewButton label='Đăng ký' onClick={() => handleShowModal(true)} disabled={isLoading}/>}
        {/*}*/}


        <Loading active={isLoading}>
          { /*(isGiaoVu || isAdmin) && */   <Table dataSource={dataSource} size='small' columns={columns}
                                                   pagination={pagination} bordered/>}

          {/*{isSinhVien }*/}
        </Loading>
        <CreateAndModify
          type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
          isModalVisible={state.isShowModal}
          handleOk={createAndModify}
          handleCancel={() => handleShowModal(false)}
          userSelected={state.userSelected}
          myInfo={myInfo}
        />
      </div>
    </>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  const { teacherList } = store.giaovien;
  const { diadiemList } = store.diadiem;
  const { dotthuctapList } = store.dotthuctap;
  const { sinhVienList } = store.sinhvien;

  return { isLoading, teacherList, myInfo, diadiemList, dotthuctapList, sinhVienList };
}

const actions = {
  ...user.actions,
  ...giaovien.actions,
  ...diadiem.actions,
  ...dotthuctap.actions,
  ...sinhvien.actions,
};
export default (connect(mapStateToProps, actions)(PheDuyetDangKy));
