import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link, useParams} from 'react-router-dom';
import {
  createNhiemVu,
  deleteNhiemVu,
  getAllNhiemVu,
  updateNhiemVu,
} from '@app/services/NhiemVu/nhiemVu.service';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT,  } from '@constants';
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

function NhiemVuManagerment({ isLoading, myInfo, ...props }) {
  const recordId = useParams()?.id;
  const [nhiemvu, setNhiemVu] = useState([]);
  const [giangVien, setGiangVien] = useState();
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    (async () => {
      await getDataNhiemVu();
      await getInfoGiangVien();
    })();
  }, []);

  async function getInfoGiangVien(){
    if(isGiangVien) {
      const apiGV = await getAllGiaoVien(1,0,{ma_giao_vien: myInfo?.username})
      setGiangVien(apiGV.docs[0]);
    }
  }

  async function getDataNhiemVu() {
    const apiResponse = await getAllNhiemVu(1,0,{sinh_vien: recordId});
    if (apiResponse) {
      setNhiemVu(apiResponse);
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
    columnIndex(10,1),

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
      render: (value) => <ActionCell value={value} handleEdit={handleEdit} handleDelete={handleDelete}/>,
      width: 200,
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
    const apiResponse = await deleteNhiemVu(userSelected._id);
    if (apiResponse) {
      getDataNhiemVu();
      toast(CONSTANTS.SUCCESS, 'Xóa kế hoạch thành công');
    }
  }

  async function createAndModifyNhiemVu(type, dataForm) {
    const { noiDung, yeuCau, ketQua } = dataForm;
    const apiDktt = await getAllDKTT(1,0, {sinh_vien: recordId, giao_vien_huong_dan: giangVien._id})
    console.log('apiDktt',apiDktt.docs[0]);
    const dataRequest = {
      sinh_vien: apiDktt.docs[0].sinh_vien,
      dot_thuc_tap: apiDktt.docs[0].dot_thuc_tap,
      giang_vien: apiDktt.docs[0].giao_vien_huong_dan,
      noi_dung: noiDung,
      yeu_cau: yeuCau,
      ket_qua: ketQua,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createNhiemVu(dataRequest);
      if (apiResponse) {
        getDataNhiemVu();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới kế hoạch thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = await state.userSelected._id;
      console.log('dataRequest._id',dataRequest._id);
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
      <AddNewButton label="Thêm nhiệm vụ" onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={true} bordered/>
      </Loading>
      <NhiemVDetail
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyNhiemVu}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
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
