import React, { useEffect, useState } from 'react';
import { Table, Tag, Popconfirm , Button} from 'antd';
import AddNewButton from '@AddNewButton';
import { DeleteOutlined, EditOutlined, EyeOutlined, SendOutlined, PlusCircleOutlined  } from '@ant-design/icons';
import { createDeTai, deleteDeTai, getAllDetai, updateDeTai } from '@app/services/DeTaiTTTN/DeTaiService';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, TRANG_THAI, TRANG_THAI_LABEL } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import * as giaovien from '@app/store/ducks/giaovien.duck';

import { getAllLinhVuc } from '@app/services/LinhVuc/linhVuc.service';
import * as bomon from '@app/store/ducks/bomon.duck';
import * as user from '@app/store/ducks/user.duck';
import * as detai from '@app/store/ducks/detai.reduck';
import ThemSuaDeTaiTTTN from '@containers/QuanLyDeTaiTTTN/ThemSuaDeTaiTTTN';
import ChiTietDangKyDeTai from '@containers/DangKyDeTaiTTTN/ChiTietDangKyDeTai';
import ActionCell from '@components/ActionCell';
import { URL } from '@url';


function DangKyDeTai({ isLoading, bomonList, teacherList, myInfo, detaiList, ...props }) {
  const [detai, setDetai] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const [listLinhVuc, setListLinhVuc] = useState([])
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
    if(api){
      setListLinhVuc(api.docs);
    }
  }

  async function getDataDeTai(
    currentPage = detai.currentPage,
    pageSize = detai.pageSize,
    query = { trang_thai: TRANG_THAI.DA_DUOC_DUYET },
  ) {
    const apiResponse = await getAllDetai(currentPage, pageSize, query);
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
    ngayTao: data.ngay_tao,
    trangThai: data.trang_thai_dang_ky,
    // hoanThanh: data.trang_thai === TRANG_THAI.DA_DUOC_DUYET,
    giaoVien: data?.ma_giang_vien,
    linhVuc: data?.ma_linh_vuc,
  }));

  const columns = [
    columnIndex(detai.pageSize, detai.currentPage),

    {
      title: 'Mã đề tài',
      dataIndex: 'maDeTai',
      key: 'maDeTai',
      width: 200,
    },
    {
      title: 'Tên đề tài',
      dataIndex: 'tenDeTai',
      key: 'tenDeTai',
      width: 300,
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'linhVuc',
      render: value => value?.ten_linh_vuc,
      width: 200,
    },
    {
      title: 'Giảng viên hướng dẫn',
      dataIndex: 'giaoVien',
      key: 'giaoVien',
      render: (value => value?.ten_giao_vien),
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
      width: 200,
    },
    {
      align: 'center',
      render: (text, record, index) => {
        const daDangKy = record.trangThai === TRANG_THAI.DA_DANG_KY;
        return <>
          {!daDangKy && <div className='mt-2'>
            <Popconfirm
              title='Bạn có chắc chắn đăng ký tài hay không'
              onConfirm={() => handleRegisTopic(record)}
              cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
              <Tag color='green' className='tag-action'>
                <SendOutlined/><span className='ml-1'>Đăng ký đề tài</span>
              </Tag>
            </Popconfirm>
            {/*<Tag color='cyan' className='tag-action' onClick={() => handleEdit(record)}>*/}
            {/*  <PlusCircleOutlined /><span className='ml-1'>Thêm thành viên</span>*/}
            {/*</Tag>*/}
          </div>}
          {daDangKy && <div className='mt-2'>
            <Popconfirm
              title='Bạn có chắc chắn hủy đăng ký tài hay không'
              onConfirm={() => handleCancelRegisTopic(record)}
              cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
              <Tag color='red' className='tag-action'>
                <SendOutlined/><span className='ml-1'>Hủy đăng ký đề tài</span>
              </Tag>
            </Popconfirm>
          </div>}
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

  async function handleRegisTopic(userSelected) {
    const dataRequest = {
      trang_thai_dang_ky:  TRANG_THAI.DA_DANG_KY,
      ma_nguoi_dang_ky : myInfo._id,
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
      toast(CONSTANTS.SUCCESS, 'Đăng ký đề tài thành công');
      handleShowModal(false);
      // updateStoreStaff(type, apiResponse);
    }
  }
  async function handleCancelRegisTopic(userSelected) {
    const dataRequest = {
      trang_thai_dang_ky:  TRANG_THAI.CHUA_DANG_KY,
      ma_nguoi_dang_ky : null,
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
      toast(CONSTANTS.SUCCESS, 'Hủy đăng ký tài thành công');
      // updateStoreStaff(type, apiResponse);
    }
  }
  async function handleDelete(userSelected) {
    const apiResponse = await deleteDeTai(userSelected._id);
    if (apiResponse) {
      getDataDeTai();
      toast(CONSTANTS.SUCCESS, 'Xóa đề tài thành công');
      // updateStoreStaff(CONSTANTS.DELETE, apiResponse);
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
            name: 'ma_giao_vien', label: 'Giảng viên hướng dẫn ', type: CONSTANTS.SELECT,
            options: { data: teacherList, valueString: '_id', labelString: 'name' },
          },
          {
            name: 'ma_linh_vuc', label: 'Lĩnh vực', type: CONSTANTS.SELECT,
            options: { data: listLinhVuc, valueString: '_id', labelString: 'name' },
          },
        ]}
        handleFilter={(query) => getDataDeTai(1, detai.pageSize, query)}
      />
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <ChiTietDangKyDeTai
        type={!!state.userSelected}
        isModalVisible={state.isShowModal}
        handleOk={handleRegisTopic}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  const { bomonList } = store.bomon;
  const { teacherList } = store.giaovien;
  const { detaiList } = store.detai;
  return { isLoading, bomonList, teacherList, myInfo, detaiList };
}

export default (connect(mapStateToProps, {...bomon.actions, ...giaovien.actions, ...user.actions, ...detai.actions})(DangKyDeTai));
