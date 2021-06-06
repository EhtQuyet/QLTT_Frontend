import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row } from 'antd';
import CustomSkeleton from '@components/CustomSkeleton';
import {
  getAllDiaDiemThucTap,
} from '@app/services/DiaDiemThucTap/diadiemthuctapService';
import {
  getDotThucTapById,
  getAllDotThucTap,
} from '@app/services/ThucTap/DotThucTap/dotthuctapService';
import {
  createDKTT,
  deleteDKTT,
  getAllDKTT,
  updateDKTT,
  getById,
} from '@app/services/ThucTap/DKThucTap/dangkythuctapService';
import { getAllGiaoVien } from '@app/services/GiaoVienHD/giaoVienService';
import { getAllSinhVien } from '@app/services/SinhVienTTTN/sinhVienTTService';
import { CONSTANTS, PAGINATION_INIT, RULES, PAGINATION_CONFIG } from '@constants';
import { DOT_THUC_TAP, DIA_DIEM_THUC_TAP, ROLE } from '../../../../constants/contans';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import { Table } from 'antd';
import { columnIndex, toast } from '@app/common/functionCommons';
import { getNhomThucTapById } from '@app/services/ThucTap/NhomThucTap/nhomThucTapService';
import { createTuKhoa, updateTuKhoa } from '@app/services/TuKhoa/tuKhoa.service';
import { createDiaDiemThucTap } from '@app/services/DiaDiemThucTap/diadiemthuctapService';

function DKTTDetail({ isLoading, sinhVienList, myInfo, ...props }) {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const recordId = useParams()?.id;
  const [dkttForm] = Form.useForm();
  const [diadiemTT, setDiaDiaTT] = useState([]);
  const [giangVienList, setGiangVienList] = useState([]);
  const [dotTT, setDotTT] = useState([]);
  const [svtt, setSvtt] = useState(PAGINATION_INIT);
  const [isOtherPlace, setOtherPlace] = useState(false);
  const [itemInfo, setItemInfo] = useState(undefined);
  const [userSelected, setUserSelected] = useState();
  useEffect(() => {
    getData();
    getDanhSachSinhVienThucTap();
    getAllGiangVien();
    setDiaDiaTT([...diadiemTT, { _id: '####', name: '---KHÁC---' }]);
    if (userSelected) {
      const dataField = Object.assign({}, userSelected);
      dkttForm.setFieldsValue(dataField);
    }
  }, [itemInfo]);

  useEffect(() => {
    (async () => {
      if (recordId) {
        await getDataRecord();
      } else {

      }
    })();
  }, []);




  async function handleOk(type, dataForm) {
    const {
      maSinhVien, dot_thuc_tap, giaoVien, diaDiem, diemTichLuy, tinchi_tichluy, tenDiaDiem, diaChi,
    } = dataForm;
    const dataRequest = {
      sinh_vien: maSinhVien,
      dot_thuc_tap: dot_thuc_tap,
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
        setTuKhoa(Object.assign({}, tukhoa, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin thực tập thành công');
      }
    }
  }


  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }

  async function getDataRecord() {
    const apiResponse = await getDotThucTapById(recordId);
    if (apiResponse) {
    }
    dkttForm.setFieldsValue({ dot_thuc_tap: apiResponse.ten_dot });
  }

  async function getAllGiangVien() {
    const apiResponse = await getAllGiaoVien();
    if (apiResponse) {
      setGiangVienList(apiResponse.docs);
    }
  }

  function onValuesChange(changedValues, allValues) {
    if (changedValues.diaDiem) {
      if (changedValues.diaDiem === '####') {
        setOtherPlace(true);
      } else {
        setOtherPlace(false);
      }
    }
  }

  async function getDanhSachSinhVienThucTap(
    currentPage = svtt.currentPage,
    pageSize = svtt.pageSize,
    query = svtt.query,
  ) {
    const apiResponse = await getAllDKTT(currentPage, pageSize, query);
    if (apiResponse) {
      setSvtt({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = svtt.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    sinhVien: data.sinh_vien,

  }));
  const columns = [
    columnIndex(svtt.pageSize, svtt.currentPage),
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

  ];

  function handleChangePagination(current, pageSize) {
    getDanhSachSinhVienThucTap(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = svtt.currentPage;
  pagination.total = svtt.totalDocs;
  pagination.pageSize = svtt.pageSize;

  async function getData() {
    const apiResponse = await getAllDiaDiemThucTap(1, 0, { trang_thai: DIA_DIEM_THUC_TAP.DA_XAC_NHAN });
    if (apiResponse) {
      setDiaDiaTT([...apiResponse.docs, { _id: '####', ten_dia_diem: '---KHÁC---' }]);
    }
    if (isSinhVien) {
      const apiSinhVien = await getAllSinhVien(1, 0, { ma_sinh_vien: myInfo.username });
      if (apiSinhVien) {
        const apiUser = await getAllDKTT(1,0, {sinh_vien: apiSinhVien.docs[0]?._id, dot_thuc_tap: recordId});
        if(apiUser){
          setUserSelected(apiUser.docs[0])
        }
        const TTInfo = await getAllDKTT(1, 0, { dot_thuc_tap: recordId, sinh_vien: apiSinhVien.docs[0]._id });
        setItemInfo(TTInfo.docs[0]);
      }
    }
  }

  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isAdmin = myInfo && myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);

  return (
    <>
      {/*<Loading active={props.isLoading}>*/}
      <Form id="formModal" form={dkttForm} size='default' onFinish={onFinish}
            onValuesChange={onValuesChange}
      >
        <Row gutter={15}>
          {(isAdmin || isGiaoVu) && <CustomSkeleton
            size='default'
            label="Mã sinh viên" name="maSinhVien"
            type={CONSTANTS.SELECT}
            rules={[RULES.REQUIRED]}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            labelLeft
            showSearch
            options={{ data: sinhVienList ? sinhVienList : [], valueString: '_id', labelString: 'namecode' }}
          />}
          <CustomSkeleton
            size='default'
            label="Đợt thực tập" name="dot_thuc_tap"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            disable={true}
            labelLeft
            showSearch
            // options={{ data: dotTT ? dotTT : [], valueString: '_id', labelString: 'ten_dot' }}
          />
          <CustomSkeleton
            size='default'
            label="Giảng viên hướng dẫn" name="giaoVien"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
            showSearch
            options={{ data: giangVienList ? giangVienList : [], valueString: '_id', labelString: 'ten_giao_vien' }}
          />
          <CustomSkeleton
            size='default'
            label="Địa điểm thực tập" name="diaDiem"
            type={CONSTANTS.SELECT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
            showSearch
            options={{ data: diadiemTT ? diadiemTT : [], valueString: '_id', labelString: 'ten_dia_diem' }}
          />
          {isOtherPlace && <CustomSkeleton
            size='default'
            label="Tên địa điểm" name="tenDiaDiem"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
          />}
          {isOtherPlace && <CustomSkeleton
            size='default'
            label="Địa chỉ" name="diaChi"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
          />}
          <CustomSkeleton
            size='default'
            label="Điểm TB tích lũy" name="diemTichLuy"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
          />
          <CustomSkeleton
            size='default'
            label="Tín chỉ tích lũy" name="tinchi_tichluy"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24 }}
            layoutItem={{ labelCol: { xs: 8 } }}
            rules={[RULES.REQUIRED]}
            labelLeft
            form={dkttForm}
          />
        </Row>

      </Form>
      <button onClick={onFinish}>Lưu</button>
      <br/>
      <h2>Danh sách sinh viên đăng ký thực tập</h2>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns}
               pagination={pagination} bordered/>
      </Loading>
    </>);
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { teacherList } = store.giaovien;
  const { myInfo } = store.user;
  const { diadiemList } = store.diadiem;
  const { dotthuctapList } = store.dotthuctap;
  const { sinhVienList } = store.sinhvien;
  return { isLoading, myInfo, teacherList, diadiemList, dotthuctapList, sinhVienList };
}

export default (connect(mapStateToProps)(DKTTDetail));
