import React, { useEffect, useState } from 'react';
import { Col, Table, Tag } from 'antd';
import { getAllDetai, getAllFile } from '@app/services/DeTaiTTTN/DeTaiService';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, TRANG_THAI, TRANG_THAI_LABEL } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import { connect } from 'react-redux';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import * as giaovien from '@app/store/ducks/giaovien.duck';

import { getAllLinhVuc } from '@app/services/LinhVuc/linhVuc.service';
import * as bomon from '@app/store/ducks/bomon.duck';
import * as user from '@app/store/ducks/user.duck';
import * as detai from '@app/store/ducks/detai.reduck';
import Detail from '@containers/DeTaiThucTap/DeTaiDangThucHien/detail';
import { API } from '@api';


function Index({ isLoading, bomonList, teacherList, myInfo, detaiList, ...props }) {
  const [detai, setDetai] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const [listLinhVuc, setListLinhVuc] = useState([]);
  const [file, setFile] = useState([]);
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
      await loadFile();
    })();
  }, []);

  async function getLinhVuc() {
    const api = await getAllLinhVuc();
    if (api) {
      setListLinhVuc(api.docs);
    }
  }

  async function loadFile() {
    const fileDetai = await getAllFile(1, 0, {});
    if (fileDetai) {
      setFile(fileDetai.docs);
    }
  }

  function renderFile(id) {
    const data = file.filter(x => x.detai_id === id);
    return (
      <>
        {data.map((item, index) => {
          return <div className="clearfix" style={{ lineHeight: '40px' }}>
            <div><a key={index} href={API.FILE_ID.format(item.file_id)}>{item.file_name}</a></div>
          </div>;
        })}
      </>
    );
  }

  async function getDataDeTai(
    currentPage = detai.currentPage,
    pageSize = detai.pageSize,
    query = {},
  ) {
    query.trang_thai = TRANG_THAI.DA_HOAN_THANH;
    const apiResponse = await getAllDetai(currentPage, pageSize, query);
    if (apiResponse) {
      setDetai({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
      });
    }
  }

  const dataSource = detai.docs.map((data, index) => ({
    _id: data._id,
    key: data._id,
    tenDeTai: data.ten_de_tai,
    maDeTai: data.ma_de_tai,
    ngayTao: data.ngay_tao,
    trangThai: data.trang_thai,
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
      title: 'Kết quả nghiên cứu',
      render: value => renderFile(value._id),
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

export default (connect(mapStateToProps, { ...bomon.actions, ...giaovien.actions, ...user.actions, ...detai.actions })(Index));
