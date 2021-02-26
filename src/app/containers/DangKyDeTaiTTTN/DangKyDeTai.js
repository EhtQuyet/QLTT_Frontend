import React, { useEffect, useState } from 'react';
import { Table, Tag, Popconfirm , Button} from 'antd';
import AddNewButton from '@AddNewButton';
import { DeleteOutlined, EditOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import { createDeTai, deleteDeTai, getAllDetai, updateDeTai } from '@app/services/DeTaiTTTN/DeTaiService';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, TRANG_THAI, TRANG_THAI_LABEL } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { connect } from 'react-redux';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import * as giaovien from '@app/store/ducks/giaovien.duck';
import * as bomon from '@app/store/ducks/bomon.duck';
import * as user from '@app/store/ducks/user.duck';
import * as detai from '@app/store/ducks/detai.reduck';


function DangKyDeTai({ isLoading, bomonList, teacherList, myInfo, detaiList, ...props }) {
  const [detai, setDetai] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    console.log('myInfo', myInfo);
    if (!props?.teacherList?.length) {
      props.getTeacher();
    }
    if (!props?.detaiList?.length) {
      props.getDeTai();
    }
    if (!props?.bomonList?.length) {
      props.getBoMon();
    }
    (async () => {
      await getDataDeTai();
    })();
  }, []);

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
    giaoVien: data?.ma_giao_vien,
    boMon: data?.ma_bo_mon,
    nguoiDangKy: data?.ma_nguoi_dang_ky,
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
      title: 'Bộ môn',
      dataIndex: 'boMon',
      render: value => value?.ten_bo_mon,
      width: 200,
    },
    {
      title: 'Giáo viên hướng dẫn',
      dataIndex: 'giaoVien',
      key: 'giaoVien',
      render: (value => value?.ten_giao_vien),
      width: 200,
    },
    {
      title: 'Người đăng ký',
      dataIndex: 'nguoiDangky',
      key: 'nguoiDangKy',
      render: (value => value?.full_name),
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
      trang_thai_dang_ky: TRANG_THAI.DA_DANG_KY,
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
  async function handleDelete(userSelected) {
    const apiResponse = await deleteDeTai(userSelected._id);
    if (apiResponse) {
      getDataDeTai();
      toast(CONSTANTS.SUCCESS, 'Xóa đề tài thành công');
      // updateStoreStaff(CONSTANTS.DELETE, apiResponse);
    }
  }

// function create or modify
  async function createAndModifyDetai(type, dataForm) {

    const dataRequest = {
      ten_de_tai: dataForm.tenDeTai,
      ma_de_tai: dataForm.maDeTai,
      ngay_tao: dataForm.ngayTao ? dataForm.ngayTao.toString() : null,
      ma_giao_vien: dataForm.giaoVien,
      ma_bo_mon: dataForm.boMon,
      ma_nguoi_tao: myInfo._id,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createDeTai(dataRequest);
      if (apiResponse) {
        getDataDeTai();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới nhân viên thành công');
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
            name: 'ma_giao_vien', label: 'Giáo viên hướng dẫn ', type: CONSTANTS.SELECT,
            options: { data: teacherList, valueString: '_id', labelString: 'name' },
          },
          {
            name: 'ma_bo_mon', label: 'Bộ môn', type: CONSTANTS.SELECT,
            options: { data: bomonList, valueString: '_id', labelString: 'name' },
          },
        ]}
        handleFilter={(query) => getDataDeTai(1, detai.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
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
