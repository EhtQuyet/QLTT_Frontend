import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, Tag } from 'antd';
import { Link, useParams } from 'react-router-dom';
import {
  createNhiemVu,
  deleteNhiemVu,
  getAllNhiemVu,
  updateNhiemVu,
} from '@app/services/NhiemVu/nhiemVu.service';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, NHIEM_VU, TRANG_THAI } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import { connect } from 'react-redux';
import { ROLE } from '../../../../constants/contans';
import { URL } from '@url';
import NhiemVDetail from '@containers/ThucTap/NhiemVuSinhVien/nhiemVuDetail';
import AddNewButton from '@AddNewButton';
import { getAllDKTT } from '@app/services/ThucTap/DKThucTap/dangkythuctapService';
import { getAllGiaoVien } from '@app/services/GiaoVienHD/giaoVienService';
import { getAllSinhVien } from '@app/services/SinhVienTTTN/sinhVienTTService';
import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';

function NhiemVuManagerment({ isLoading, myInfo, ...props }) {
  const recordId = useParams()?.id;
  const [nhiemvu, setNhiemVu] = useState([]);
  const [giangVien, setGiangVien] = useState();
  const [sinhVien, setSinhVien] = useState();
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
    type: null,
  });

  useEffect(() => {
    getInfo();
    getDataNhiemVu();
  }, []);

  async function getInfo() {
    if (isGiangVien) {
      const apiGV = await getAllGiaoVien(1, 0, { ma_giao_vien: myInfo?.username });
      setGiangVien(apiGV.docs[0]);
    }
    if (isSinhVien) {
      const apiSV = await getAllSinhVien(1, 0, { ma_sinh_vien: myInfo?.username });
      setSinhVien(apiSV.docs[0]);
    }
  }


  async function getDataNhiemVu() {
    await getInfo();
    if (isSinhVien) {
      const apiSV = await getAllSinhVien(1, 0, { ma_sinh_vien: myInfo?.username });
      const apiResponse = await getAllNhiemVu(1, 0, { sinh_vien: apiSV.docs[0]?._id });
      console.log('sinh_vien', sinhVien?._id);
      console.log('apiResponse', apiResponse);
      if (apiResponse) {
        setNhiemVu(apiResponse);
      }
    } else {
      const apiResponse = await getAllNhiemVu(1, 0, { sinh_vien: recordId });
      if (apiResponse) {
        setNhiemVu(apiResponse);
      }
    }
  }

  const dataSource = nhiemvu.docs?.map((data, index) => ({
    key: data._id,
    _id: data._id,
    sinhVien: data.sinh_vien,
    giangVien: data.giang_vien,
    noiDung: data.noi_dung,
    yeuCau: data.yeu_cau,
    ketQua: data.ket_qua,
    trangThai: data.trang_thai,

  }));

  const columns = [
    columnIndex(10, 1),

    {
      title: 'Tên sinh viên',
      dataIndex: 'sinhVien',
      key: 'sinhVien',
      render: value => value?.ten_sinh_vien,
      width: 300,
    },
    {
      title: 'Công việc',
      dataIndex: 'noiDung',
      key: 'noiDung',
      width: 300,
    },
    {
      title: 'Yêu cầu',
      dataIndex: 'yeuCau',
      key: 'yeuCau',
      width: 300,
    },
    {
      title: 'Kết quả',
      dataIndex: 'ketQua',
      key: 'ketQua',
      width: 300,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 200,
    },
    {
      align: 'center',
      render: (value) => {
        const daGiao = value.trangThai === NHIEM_VU.DA_GIAO;
        const hoanThanh = value.trangThai === NHIEM_VU.HOAN_THANH;
        const xacNhan = value.trangThai === NHIEM_VU.XAC_NHAN;
        return <>
          {daGiao && isGiangVien && <ActionCell value={value} handleEdit={handleEdit} handleDelete={handleDelete}/>}

          {isSinhVien && daGiao && <div className='mt-2'>
            <Button size='small' onClick={() => handleEdit(value, 'HOAN_THANH')} style={{ borderColor: 'white' }}>
              <Tag color='blue' className='tag-action'>
                <EditOutlined/><span>Hoàn thành</span>
              </Tag>
            </Button>
          </div>}
        </>;
      },

      width: 200,
    },
  ];

  function handleShowModal(isShowModal, userSelected = null, type = null) {
    setState({
      isShowModal,
      userSelected,
      type,
    });
  }

  function handleEdit(userSelected, type) {
    setState({ isShowModal: true, userSelected, type });
  }

  async function handleDelete(userSelected) {
    const apiResponse = await deleteNhiemVu(userSelected._id);
    if (apiResponse) {
      getDataNhiemVu();
      toast(CONSTANTS.SUCCESS, 'Xóa kế hoạch thành công');
    }
  }

  async function createAndModifyNhiemVu(type, dataForm) {
    const { noiDung, yeuCau, ketQua, trangThai } = dataForm;
    if (isGiangVien) {
      const apiDktt = await getAllDKTT(1, 0, { sinh_vien: recordId, giao_vien_huong_dan: giangVien._id });
    }
    const dataRequest = {
      noi_dung: noiDung,
      yeu_cau: yeuCau,
      ket_qua: ketQua,
    };
    if (isSinhVien) {
      dataRequest.trang_thai = trangThai;
    }
    if (isGiangVien) {
      dataRequest.sinh_vien = apiDktt.docs[0].sinh_vien;
      dataRequest.dot_thuc_tap = apiDktt.docs[0].dot_thuc_tap;
      dataRequest.giang_vien = apiDktt.docs[0].giao_vien_huong_dan;
    }
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createNhiemVu(dataRequest);
      if (apiResponse) {
        getDataNhiemVu();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới kế hoạch thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      console.log('dataRequest', dataRequest);
      dataRequest._id = await state.userSelected._id;
      const apiResponse = await updateNhiemVu(dataRequest);
      if (apiResponse) {
        const docs = nhiemvu.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setNhiemVu(Object.assign({}, nhiemvu, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin kế hoạch thành công');
      }
    }
  }

  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isAdmin = myInfo && myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);

  return (
    <div>
      {isGiangVien && <AddNewButton label="Thêm nhiệm vụ" onClick={() => handleShowModal(true)} disabled={isLoading}/>}
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={true} bordered/>
      </Loading>
      <NhiemVDetail
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyNhiemVu}
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
  return { isLoading, myInfo };
}

export default (connect(mapStateToProps)(NhiemVuManagerment));
