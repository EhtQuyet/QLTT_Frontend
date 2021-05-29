import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, Tag } from 'antd';
import AddNewButton from '@AddNewButton';
import {
  createDKTT,
  deleteDKTT,
  getAllDKTT,
  updateDKTT,
  getById,
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
import { DeleteOutlined, EditOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { getAllGiaoVien } from '@app/services/GiaoVienHD/giaoVienService';
import { URL } from '@url';


function NhiemVuSinhVien({ isLoading, myInfo, ...props }) {
  const [dkthuctap, setDkthuctap] = useState([]);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const [isSig, setIsSig] = useState(null);
  const recordId = useParams()?.id;

  useEffect(() => {
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

  console.log(myInfo);

  async function getData() {
    if (isGiangVien) {
      const apiGiangVien = await getAllGiaoVien(1, 0, { ma_giang_vien: myInfo.username });
      const apiResponse = await getAllDKTT(1,0,{dot_thuc_tap:recordId});
      if (apiResponse) {
        setDkthuctap(apiResponse);
      }
    }

    const apiResponse = await getAllDKTT(1,0,{dot_thuc_tap:recordId});
    if (apiResponse) {
      setDkthuctap(apiResponse);
    }
  }

  const dataSource = dkthuctap.docs?.map((data, index) => ({
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
    columnIndex(10,1),
    {
      title: 'Mã sinh viên',
      dataIndex: 'sinhVien',
      render: value => value?.ma_sinh_vien,
      width: 200,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'sinhVien',
      render: value => value?.ten_sinh_vien,
      width: 200,
    },

    {
      title: 'Địa điểm thực tập',
      dataIndex: 'diadiem_thuctap',
      render: value => value?.ten_dia_diem,
      width: 200,
    },
    {
      align: 'center',
      render: (value) =>
        <Link to={URL.MENU.NHIEM_VU_SINH_VIEN_ID.format(value.sinhVien?._id)}>
          <Tag color='cyan' className='tag-action'>
            <EyeOutlined/><span className='ml-1'>Chi tiết</span>
          </Tag>
        </Link>,
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
                                                   pagination={true} bordered/>}

          {/*{isSinhVien }*/}
        </Loading>
      </div>
    </>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;

  return { isLoading, myInfo };
}

const actions = {
  ...user.actions,
  ...giaovien.actions,
  ...diadiem.actions,
  ...dotthuctap.actions,
  ...sinhvien.actions,
};
export default (connect(mapStateToProps, actions)(NhiemVuSinhVien));
