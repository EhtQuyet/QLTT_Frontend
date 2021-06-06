import React, { useEffect, useState } from 'react';
import { Table, Tag, Popconfirm, Button, Tooltip } from 'antd';
import AddNewButton from '@AddNewButton';
import { DeleteOutlined, EditOutlined, SendOutlined, CheckCircleOutlined, CopyOutlined } from '@ant-design/icons';
import Detail from './detail';
import { createDeTai, deleteDeTai, getAllDetai, getListDetai, updateDeTai } from '@app/services/DeTaiTTTN/DeTaiService';
import { getAllLinhVuc } from '@app/services/LinhVuc/linhVuc.service';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, TRANG_THAI, TRANG_THAI_LABEL } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { connect } from 'react-redux';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import * as giaovien from '@app/store/ducks/giaovien.duck';
import * as user from '@app/store/ducks/user.duck';
import * as detai from '@app/store/ducks/detai.reduck';
import { ROLE } from '@src/constants/contans';
import { getAllSinhVien } from '@app/services/SinhVienTTTN/sinhVienTTService';
import { getAllDKTT } from '@app/services/ThucTap/DKThucTap/dangkythuctapService';
import { getAllGiaoVien } from '@app/services/GiaoVienHD/giaoVienService';
import { URL } from '@url';
import { Link, useParams } from 'react-router-dom';


function Index({ isLoading, teacherList, myInfo, detaiList, ...props }) {
  const [detai, setDetai] = useState(PAGINATION_INIT);
  const [isDangKy, setIsDangKy] = useState(null);
  const [isTrue, setIsTrue] = useState();
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const [listLinhVuc, setListLinhVuc] = useState([]);

  useEffect(() => {
    if (!props?.teacherList?.length) {
      props.getTeacher();
    }
    if (!props?.detaiList?.length) {
      props.getDeTai();
    }
    (async () => {
      await getDataDeTai();
      await getLinhVuc();
    })();
  }, []);

  async function getLinhVuc() {
    const api = await getAllLinhVuc();
    if (api) {
      setListLinhVuc(api.docs);
    }
  }

  async function getDataDeTai(
    currentPage = detai.currentPage,
    pageSize = detai.pageSize,
    query = detai.query,
  ) {
    let apiResponse = null;
    if (isGiaoVu || isAdmin) {
      apiResponse = await getListDetai(currentPage, pageSize, query);
    }
    if (isSinhVien) {
      const api = await getAllSinhVien(1, 0, { ma_sinh_vien: myInfo.username });
      const api0 = await getAllDetai(1, 0, { sinh_vien_thuc_hien: api.docs[0]._id });
      if (api0) {
        setIsTrue(api0.docs[0]);
      }
      const api2 = await getAllDKTT(1, 0, { sinh_vien: api.docs[0]._id });

      if (api2) {
        setIsDangKy(api2.docs[0]);
        apiResponse = await getAllDetai(1, 0, {
          trang_thai: TRANG_THAI.DA_DUOC_DUYET,
          ma_giang_vien: api2.docs[0].giao_vien_huong_dan._id,
        });
      } else {
        apiResponse = await getAllDetai(1, 0, { trang_thai: TRANG_THAI.DA_DUOC_DUYET });
      }
    }

    if (isGiangVien) {
      const apiGiangVien = await getAllGiaoVien(1, 0, { ma_giao_vien: myInfo?.username });
      if (apiGiangVien) {
        apiResponse = await getListDetai(1, 0, { trang_thai: TRANG_THAI.DA_DUOC_DUYET });
        const all = await getListDetai(1, 0, { ma_giang_vien: apiGiangVien.docs[0]._id });
        apiResponse.docs = [...apiResponse.docs, all.docs];
      }
    }


    if (apiResponse) {
      setDetai({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }


  const dataSource = detai.docs.map((data, index) => ({
    _id: data._id,
    key: data._id,
    tenDeTai: data.ten_de_tai,
    maDeTai: data.ma_de_tai,
    ngayTao: data.created_at,
    noiDung: data.noi_dung,
    trangThai: data.trang_thai,
    hoanThanh: data.trang_thai === TRANG_THAI.DA_DUOC_DUYET,
    giangVien: data?.ma_giang_vien,
    tuKhoa: data?.tu_khoa,
    linhVuc: data?.ma_linh_vuc,
    nguoiTao: data?.ma_nguoi_tao,
    namHoc: data?.nam_hoc,
  }));

  const isAdmin = myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);

  const columns = [
    columnIndex(detai.pageSize, detai.currentPage),

    {
      title: 'Tên đề tài',
      dataIndex: 'tenDeTai',
      key: 'tenDeTai',
      width: 300,
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'linhVuc',
      key: 'linhVuc',
      render: value => value?.ten_linh_vuc,
      width: 200,
    },
    {
      title: 'Giảng viên hướng dẫn',
      dataIndex: 'giangVien',
      key: 'giangVien',
      render: (value => value?.ten_giao_vien),
      width: 250,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: value => value ? moment(value).format('DD/MM/YYYY') : '',
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: value => {
        if (TRANG_THAI_LABEL[value]) {
          const { label, color } = TRANG_THAI_LABEL[value];
          return <Tag color={color}>{label}</Tag>;
        }
      },
      width: 150,
    },
    {
      align: 'center',
      width: 75,
      render: (text, record, index) => {
        const daDuyet = record.trangThai === TRANG_THAI.DA_DUOC_DUYET;
        const chuaDuocDuyet = record.trangThai === TRANG_THAI.CHUA_DUOC_DUYET;
        return <>
          {!daDuyet && (isAdmin || isGiaoVu) &&
          <Tooltip title="Duyệt đề tài" placement="left" color='green' key='green'>
            <div className='mt-2'>
              <Popconfirm
                title='Bạn có chắc chắn duyệt đề tài hay không'
                onConfirm={() => handleComfirmTopic(record)}
                cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
                <Tag color='green' className='tag-action'>
                  <CheckCircleOutlined/><span className='ml-1'></span>
                </Tag>
              </Popconfirm>
            </div>
          </Tooltip>}
          {chuaDuocDuyet &&
          <Link to={URL.MENU.DANH_GIA_DE_TAI_ID.format(record._id)}>
            <Tooltip title="Đánh giá trùng lặp" placement="left" color='gold' key='gold'>
              <div className='mt-2'>
                <Button size='small'
                        style={{ borderColor: 'white' }}>
                  <Tag color='gold' className='tag-action'>
                    <CopyOutlined/><span></span>
                  </Tag>
                </Button>
              </div>
            </Tooltip>
          </Link>}

          {isSinhVien && !isTrue && isDangKy !== null &&
          <Tooltip title="Đăng ký đề tài" placement="left" color='green' key='green'>
            <div className='mt-2'>
              <Popconfirm
                title='Bạn có chắc chắn đăng ký đề tài này không'
                onConfirm={() => handleDangKyDeTai(record)}
                cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
                <Tag color='green' className='tag-action'>
                  <SendOutlined/><span className='ml-1'></span>
                </Tag>
              </Popconfirm>
            </div>
          </Tooltip>}

          {(isAdmin || isGiaoVu) &&
          <Tooltip title="Chỉnh sửa" placement="left" color='blue' key='blue'>
            <div className='mt-2'>
              <Button size='small' onClick={() => handleEdit(record)} style={{ borderColor: 'white' }}>
                <Tag color='blue' className='tag-action'>
                  <EditOutlined/><span></span>
                </Tag>
              </Button>
            </div>
          </Tooltip>}
          {!daDuyet && (isAdmin || isGiaoVu) &&
          <Tooltip title="Xóa đề tài" placement="left" color='red' key='red'>
            <div className='mt-2'>
              <Popconfirm
                title='Bạn chắc chắn muốn xoá'
                onConfirm={() => handleDelete(record)}
                cancelText='Huỷ' okText='Xóa' okButtonProps={{ type: 'danger' }}>
                <Tag color='red' className='tag-action'>
                  <DeleteOutlined/><span className='ml-1'></span>
                </Tag>
              </Popconfirm>
            </div>
          </Tooltip>}

        </>;
      },
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

  async function handleComfirmTopic(userSelected) {
    const dataRequest = {
      trang_thai: TRANG_THAI.DA_DUOC_DUYET,
    };
    dataRequest._id = userSelected._id;
    const apiResponse = await updateDeTai(dataRequest);
    if (apiResponse) {
      const docs = detai.docs.map(doc => {
        if (doc._id === apiResponse._id) {
          doc = apiResponse;
        }
        return doc;
      });
      setDetai(Object.assign({}, detai, { docs }));
      toast(CONSTANTS.SUCCESS, 'Duyệt đề tài thành công');
      // updateStoreStaff(type, apiResponse);
    }
  }

  async function handleDangKyDeTai(data) {
    const item =
      {
        _id: data._id,
        sinh_vien_thuc_hien: isDangKy.sinh_vien._id,
        trang_thai: TRANG_THAI.DANG_THUC_HIEN,
      };
    const api = await updateDeTai(item);
    if (api) {
      getDataDeTai(1, 0, {});
      toast(CONSTANTS.SUCCESS, 'Đăng ký đề tài thành công!');
    }
  }

  async function handleDelete(userSelected) {
    const apiResponse = await deleteDeTai(userSelected._id);
    if (apiResponse) {
      getDataDeTai();
      toast(CONSTANTS.SUCCESS, 'Xóa đề tài thành công');
    }
  }

  // function create or modify
  async function createAndModifyDetai(type, dataForm) {
    const dataRequest = {
      ten_de_tai: dataForm.tenDeTai,
      ma_de_tai: dataForm.maDeTai,
      ngay_tao: dataForm.ngayTao ? dataForm.ngayTao.toString() : null,
      ma_giang_vien: dataForm.giangVien,
      noi_dung: dataForm.noiDung,
      tu_khoa: dataForm.tuKhoa,
      ma_linh_vuc: dataForm.linhVuc,
      ma_nguoi_tao: myInfo._id,
      nam_hoc: dataForm.namHoc,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createDeTai(dataRequest);
      if (apiResponse) {
        getDataDeTai();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới đề tài thành công');
        // updateStoreStaff(type, apiResponse);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateDeTai(dataRequest);
      if (apiResponse) {
        const docs = detai.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setDetai(Object.assign({}, detai, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin đề tài thành công');
        getDataDeTai();

        // updateStoreStaff(type, apiResponse);
      }
    }
  }

  function handleChangePagination(current, pageSize) {
    getDataDeTai(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = detai.currentPage;
  pagination.total = detai.totalDocs;
  pagination.pageSize = detai.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_de_tai', label: 'Tên đề tài', type: CONSTANTS.TEXT },
          {
            name: 'ma_giang_vien', label: 'giảng viên hướng dẫn ', type: CONSTANTS.SELECT,
            options: { data: teacherList, valueString: '_id', labelString: 'name' },
          },
          {
            name: 'ma_linh_vuc', label: 'Lĩnh vực', type: CONSTANTS.SELECT,
            options: { data: listLinhVuc, valueString: '_id', labelString: 'name' },
          },
        ]}
        handleFilter={(query) => getDataDeTai(1, detai.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <Detail
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyDetai}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  const { teacherList } = store.giaovien;
  const { detaiList } = store.detai;
  return { isLoading, teacherList, myInfo, detaiList };
}

export default (connect(mapStateToProps, { ...giaovien.actions, ...user.actions, ...detai.actions })(Index));
;
