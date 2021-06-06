import React, { useEffect, useState } from 'react';
import { Table, Tag, Tabs, Row, Col } from 'antd';
import Detail from '@containers/DeTaiThucTap/DeTaiDangThucHien/detail';

const { TabPane } = Tabs;
import { createDeTai, getAllDetai, updateDeTai } from '@app/services/DeTaiTTTN/DeTaiService';
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
import { ROLE } from '@src/constants/contans';
import { getAllSinhVien } from '@app/services/SinhVienTTTN/sinhVienTTService';


function Index({ isLoading, bomonList, teacherList, myInfo, detaiList, ...props }) {
  const [detai, setDetai] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const [listLinhVuc, setListLinhVuc] = useState([]);
  const [myTopic, setMyTopic] = useState();
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
      await getMyTopic();
    })();
  }, []);

  async function getLinhVuc() {
    const api = await getAllLinhVuc();
    if (api) {
      setListLinhVuc(api.docs);
    }
  }

  async function getMyTopic(){
    if(isSinhVien){
      const sinhVien = await getAllSinhVien(1,0,{ma_sinh_vien: myInfo?.username})
      if(sinhVien) {
        const topic = await getAllDetai(1,0, {sinh_vien_thuc_hien: sinhVien.docs[0]._id})
        if(topic){
          setMyTopic(topic.docs[0])
        }
      }
    }
  }

  async function getDataDeTai(
    currentPage = detai.currentPage,
    pageSize = detai.pageSize,
    query = {},
  ) {
    query.trang_thai = TRANG_THAI.DANG_THUC_HIEN;
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
    file: data?.file,
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
        return <>
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

  async function createAndModifyDetai(type, dataForm) {
    const dataRequest = {
      ten_de_tai: dataForm.tenDeTai,
      ma_de_tai: dataForm.maDeTai,
      ngay_tao: dataForm.ngayTao ? dataForm.ngayTao.toString() : null,
      ma_giang_vien: dataForm.giangVien,
      file: dataForm.file,
      noi_dung: dataForm.noiDung,
      tu_khoa: dataForm.tuKhoa,
      ma_linh_vuc: dataForm.linhVuc,
      ma_nguoi_tao: myInfo._id,
      nam_hoc: dataForm.namHoc,
    };

    console.log('dataRequest',dataRequest);
    // if (type === CONSTANTS.UPDATE) {
    //   dataRequest._id = state.userSelected._id;
    //   const apiResponse = await updateDeTai(dataRequest);
    //   if (apiResponse) {
    //     const docs = detai.docs.map(doc => {
    //       if (doc._id === apiResponse._id) {
    //         doc = apiResponse;
    //       }
    //       return doc;
    //     });
    //     setDetai(Object.assign({}, detai, { docs }));
    //     handleShowModal(false);
    //     toast(CONSTANTS.SUCCESS, 'Cập nhật thành công');
    //     getDataDeTai();
    //
    //   }
    // }
  }

  function handleEdit(userSelected) {
    setState({ isShowModal: true, userSelected });
  }

  function handleChangePagination(current, pageSize) {
    getDataDeTai(current, pageSize);
  }

  console.log(myTopic);

  const isAdmin = myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = detai.currentPage;
  pagination.total = detai.totalDocs;
  pagination.pageSize = detai.pageSize;
  return (
    <>

      {!isSinhVien && <div>
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
        {/*<ChiTietDangKyDeTai*/}
        {/*  type={!!state.userSelected}*/}
        {/*  isModalVisible={state.isShowModal}*/}
        {/*  handleOk={handleRegisTopic}*/}
        {/*  handleCancel={() => handleShowModal(false)}*/}
        {/*  userSelected={state.userSelected}*/}
        {/*/>*/}
      </div>}
      { isSinhVien && <Tabs defaultActiveKey="1">
        <TabPane tab="Danh sách đề tài" key="1">
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
            {/*<ChiTietDangKyDeTai*/}
            {/*  type={!!state.userSelected}*/}
            {/*  isModalVisible={state.isShowModal}*/}
            {/*  handleOk={handleRegisTopic}*/}
            {/*  handleCancel={() => handleShowModal(false)}*/}
            {/*  userSelected={state.userSelected}*/}
            {/*/>*/}
          </div>
        </TabPane>
        <TabPane tab="Đề tài của tôi" key="2">

          <Loading active={isLoading}>
            <Row>
              <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Tên đề
                tài</Col>
              <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{myTopic?.ten_de_tai}</Col>
            </Row>
            <Row>
              <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>lĩnh vực</Col>
              <Col span={10}
                   style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{myTopic?.ma_linh_vuc.ten_linh_vuc}</Col>
            </Row>
            <Row>
              <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Giảng
                viên</Col>
              <Col span={10} style={{
                padding: '10px',
                borderBottom: '1px #DDDDDD solid',
              }}>{myTopic?.ma_giang_vien.ten_giao_vien}</Col>
            </Row>
            <Row>
              <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Nội dung</Col>
              <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{myTopic?.noi_dung}</Col>
            </Row>
            <Row>
              <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Năm học</Col>
              <Col span={10}
                   style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{myTopic?.nam_hoc.nam_hoc}</Col>
            </Row>
            <Row>
              <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Từ khóa</Col>
              <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>
                {myTopic?.tu_khoa.map((i, k) => {
                  return <Tag style={{ marginBottom: '3px' }} key={k}>{i.tu_khoa}</Tag>;
                })}
              </Col>
            </Row>
            <Row style={{marginTop: '20px'}}> <Tag onClick={() => handleShowModal(true)} color='green'>Hoàn thành đề tài</Tag></Row>
          </Loading>
          <Detail
            type={CONSTANTS.UPDATE}
            isModalVisible={state.isShowModal}
            handleOk={createAndModifyDetai}
            handleCancel={() => handleShowModal(false)}
            userSelected={state.userSelected}
          />
        </TabPane>
      </Tabs>}

    </>
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
