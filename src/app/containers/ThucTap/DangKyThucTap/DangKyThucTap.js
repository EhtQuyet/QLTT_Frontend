import React, { useEffect, useState } from 'react';
import { Table, Button, Tag } from 'antd';
import { getDKDotThucTap } from '@app/services/ThucTap/DotThucTap/dotthuctapService';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { DOT_THUC_TAP, ROLE } from '../../../../constants/contans';
import { columnIndex, renderRowData, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import { EditOutlined } from '@ant-design/icons';
import { URL } from '@url';
import { Link } from 'react-router-dom';
import CreateAndModify from './CreateAndModify';
import { createDKTT, getAllDKTT, updateDKTT } from '@app/services/ThucTap/DKThucTap/dangkythuctapService';
import { createNhiemVu, updateNhiemVu } from '@app/services/NhiemVu/nhiemVu.service';
import { getAllSinhVien } from '@app/services/SinhVienTTTN/sinhVienTTService';
import { createDiaDiemThucTap } from '@app/services/DiaDiemThucTap/diadiemthuctapService';

function DangKyThucTap({ isLoading, myInfo, namhocList, ...props }) {
  const [dangkythuctap, setDangKyThucTap] = useState([]);
  const [isSV, setIsSV] = useState();
  const [isSignUp, setIsSignUp] = useState(false);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
    type: null,
  });

  useEffect(() => {
    if (!props?.namhocList?.length) {
      props.getNamHoc();
    }
    (async () => {
      await getDataDotThucTap();
      await isSinhVienSignUp();
    })();
  }, []);

  async function getDataDotThucTap() {
    const apiResponse = await getDKDotThucTap();
    if (apiResponse) {
      setDangKyThucTap(apiResponse.docs);
    }
  }

  async function isSinhVienSignUp() {
    if (isSinhVien) {
      const apiSinhVien = await getAllSinhVien(1, 0, { ma_sinh_vien: myInfo.username });
      if (apiSinhVien) {
        setIsSV(apiSinhVien.docs[0]);
        const api = await getAllDKTT(1, 0, { sinh_vien: apiSinhVien.docs[0]._id });
        if (api.docs.length > 0) {
          setIsSignUp(true);
        }
      }
    }
  }

  const dataSource = dangkythuctap?.map((data, index) => ({
    key: data._id,
    _id: data._id,
    namHoc: data.namhoc,
    ghiChu: data.ghi_chu,
    thoiGianBatDau: data.thoigian_batdau,
    thoiGianKetThuc: data.thoigian_ketthuc,
    dotThucTap: data.ten_dot,
    trangThai: data.trang_thai,
  }));

  const columns = [
    columnIndex(10, 1),

    {
      title: 'Năm học',
      dataIndex: 'namHoc',
      render: value => value?.nam_hoc,
      width: 200,
    },
    {
      title: 'Tên đợt thực tập',
      dataIndex: 'dotThucTap',
      key: 'dotThucTap',
      width: 200,
    },
    {
      title: 'Thời gian thực tập',
      render: (text, record, index) => <div>
        {renderRowData('Bắt đầu', record?.thoiGianBatDau ? moment(record.thoiGianBatDau).format('DD/MM/YYYY') : '', '70px')}
        {renderRowData('Kết thúc', record?.thoiGianKetThuc ? moment(record.thoiGianKetThuc).format('DD/MM/YYYY') : '', '70px')}
      </div>,
      align: 'center',
      width: 200,
    },

    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      render: value => <>
        {value === DOT_THUC_TAP.DANG_MO ? <Tag color='green'>Đang mở</Tag>
          : value === DOT_THUC_TAP.DA_KHOA ? <Tag color='gold'> Đã khóa</Tag>
            : <Tag color='red'>Đã kết thúc</Tag>}
      </>,
      width: 200,
    },
    {
      align: 'center',
      render: (value) => <> {isSignUp !== true && isSinhVien && value.trangThai === DOT_THUC_TAP.DANG_MO &&
        <Tag color='cyan' onClick={() => handleShowModal(true, value)} className='tag-action'>
          <EditOutlined/><span className='ml-1'>Đăng ký</span>
        </Tag>
      }
        {!isSinhVien &&
        <Link to={URL.MENU.PHE_DUYET_DANG_KY_ID.format(value._id)}>
          <Tag color='cyan' className='tag-action'>
            <EditOutlined/><span className='ml-1'>Chi tiết</span>
          </Tag>
        </Link>
        }

      </>,
      width: 300,
    },
  ];

  function handleShowModal(isShowModal, userSelected, type = null) {
    setState({
      isShowModal,
      userSelected,
      type,
    });
  }

  async function createAndModify(type, dataForm) {
    const {
      giaoVien, diaDiem, diemTichLuy, tinchi_tichluy, tenDiaDiem, diaChi,
    } = dataForm;
    const dataRequest = {
      sinh_vien: isSV._id,
      dot_thuc_tap: state.userSelected._id,
      giao_vien_huong_dan: giaoVien,
      diem_tbtl: diemTichLuy,
      so_tctl: tinchi_tichluy,
    };
    if (diaDiem !== '####') {
      dataRequest.dia_diem_thuc_tap = diaDiem;
    } else {
      const dataDiaDiem = {
        ten_dia_diem: tenDiaDiem,
        dia_chi: diaChi,
      };
      const api = await createDiaDiemThucTap(dataDiaDiem);
      dataRequest.dia_diem_thuc_tap = api._id;
    }
    ;

    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createDKTT(dataRequest);
      if (apiResponse) {
        setIsSignUp(true);
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Đăng ký thực tập thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      // dataRequest._id = state.userSelected._id;
      const apiResponse = await updateDKTT(dataRequest);
      if (apiResponse) {
        const docs = tukhoa.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Lưu thông tin thành công');
      }
    }
  }

  const isAdmin = myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);


  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_dot', label: 'Tên đợt thực tập', type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataDotThucTap(1, dangkythuctap.pageSize, query)}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={true} bordered/>
      </Loading>
      <CreateAndModify
        type={CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModify}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
        type={state.type}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;

  const { myInfo } = store.user;
  const { namhocList } = store.namhoc;
  return { isLoading, namhocList, myInfo };
}

export default (connect(mapStateToProps, { ...namhoc.actions })(DangKyThucTap));
