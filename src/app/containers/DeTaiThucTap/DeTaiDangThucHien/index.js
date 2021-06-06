import React, { useEffect, useState } from 'react';
import { Table, Tag, Tabs, Row, Col, List, Upload, Divider } from 'antd';
import Detail from '@containers/DeTaiThucTap/DeTaiDangThucHien/detail';
import { ExclamationCircleOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { API } from '@api';

const { TabPane } = Tabs;
import { createDeTai, getAllDetai, updateDeTai, uploadFile, getAllFile } from '@app/services/DeTaiTTTN/DeTaiService';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, TRANG_THAI, TRANG_THAI_LABEL } from '@constants';
import { columnIndex, formatBytesFile, toast } from '@app/common/functionCommons';
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

function renderRowData(label, value, labelWidth = '100px') {
  return <div className="clearfix" style={{ lineHeight: '40px' }}>
    <strong style={{ fontSize: '14px', fontStyle: 'italic', width: labelWidth }} className="float-left">
      {label}:
    </strong>
    <div>{value}</div>
  </div>;
}

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

  async function getMyTopic() {
    if (isSinhVien) {
      const sinhVien = await getAllSinhVien(1, 0, { ma_sinh_vien: myInfo?.username });
      if (sinhVien) {
        const topic = await getAllDetai(1, 0, { sinh_vien_thuc_hien: sinhVien.docs[0]._id });
        if (topic) {
          console.log('id', topic.docs[0]._id);
          setDeTaiId(topic.docs[0]._id);
          setMyTopic(topic.docs[0]);
          const fileDetai = await getAllFile(1, 0, { detai_id: topic.docs[0]._id });
          console.log('fileDetai', fileDetai);
          setFileList(fileDetai.docs);
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

  //upload file

  const [fileUpload, setFile] = React.useState(null);
  const [progressUpload, setProgressUpload] = React.useState(0);
  const [dataUpload, setDataUpload] = useState([]);
  const [detaiId, setDeTaiId] = useState('');
  const [fileList, setFileList] = useState([]);

  async function action(file) {
    console.log('detaiId', detaiId);
    await setProgressUpload(0);
    const dataFile = {
      name: file.name,
      size: formatBytesFile(file.size),
      status: 'uploading',
    };
    await setFile(dataFile);
    const config = {
      onUploadProgress: function(progressEvent) {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgressUpload(percentCompleted === 100 ? 99 : percentCompleted);
      },
    };
    const apiResponse = await uploadFile(file, detaiId, config);
    if (apiResponse) {
      getMyTopic();
      setFile(Object.assign({}, dataFile, { status: 'done' }));
      toast(CONSTANTS.SUCCESS, `Tải lên tập tin thành công!`);
    } else {
      setFile(Object.assign({}, dataFile, { status: 'error' }));
    }
    setProgressUpload(100);
    return false;
  }

  function renderLoadingIcon() {
    if (!fileUpload?.status) return <div>a</div>;
    if (['uploading', 'done'].includes(fileUpload.status)) {
      return <Progress
        // type="circle"
        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
        percent={progressUpload}
        width={50}
      />;
    } else return <ExclamationCircleOutlined style={{ fontSize: '50px', color: '#ff4d4f' }}/>;
  }


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
          <Table dataSource={dataSource} size="small" columns={columns} pagination={pagination} bordered/>
        </Loading>
        {/*<ChiTietDangKyDeTai*/}
        {/*  type={!!state.userSelected}*/}
        {/*  isModalVisible={state.isShowModal}*/}
        {/*  handleOk={handleRegisTopic}*/}
        {/*  handleCancel={() => handleShowModal(false)}*/}
        {/*  userSelected={state.userSelected}*/}
        {/*/>*/}
      </div>}
      {isSinhVien && <Tabs defaultActiveKey="1">
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
              <Table dataSource={dataSource} size="small" columns={columns} pagination={pagination} bordered/>
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
              <Col span={12}>
                {renderRowData('Tên đề tài', myTopic?.ten_de_tai, '150px')}
                {renderRowData('Lĩnh vực', myTopic?.ma_linh_vuc.ten_linh_vuc, '150px')}
                {renderRowData('Giảng viên', myTopic?.ma_giang_vien.ten_giao_vien, '150px')}
                {renderRowData('Năm học', myTopic?.nam_hoc.nam_hoc, '150px')}
                {renderRowData('Từ khóa', myTopic?.tu_khoa.map((i, k) => <Tag key={k}>{i.tu_khoa}</Tag>), '150px')}

              </Col>
              <Col span={12}>
                <Upload
                  listType="text"
                  fileList={fileUpload ? [Object.assign({}, fileUpload, { percent: progressUpload })] : null}
                  progress={{ strokeColor: { '0%': '#108ee9', '100%': '#87d068' } }}
                  beforeUpload={action}
                  // accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document.spreadsheetml.sheet"
                  showUploadList={false}
                  customRequest={() => null}
                >
                  <Tag color="purple" className="float-right"><UploadOutlined/>Tải tập tin</Tag>
                </Upload>
                {fileList.map((item, index) => {
                  return <div className="clearfix" style={{ lineHeight: '40px' }}>
                    <div><a key={index} href={API.FILE_ID.format(item.file_id)}>{item.file_name}</a></div>
                  </div>
                })}
                {/*<List*/}
                {/*  size="small"*/}
                {/*  dataSource={fileList}*/}
                {/*  renderItem={item => <List.Item><a*/}
                {/*    href={API.FILE_ID.format(item.file_id)}>{item.file_name}</a></List.Item>}*/}
                {/*/>*/}
              </Col>
            </Row>
            {/*<Row style={{marginTop: '20px'}}> <Tag onClick={() => handleShowModal(true)} color='green'>Hoàn thành đề tài</Tag></Row>*/}
          </Loading>
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
