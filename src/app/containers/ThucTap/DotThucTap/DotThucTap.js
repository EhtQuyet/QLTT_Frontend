import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Switch,
  Table,
  Tooltip,
  Card,
  Col,
  Tag,
} from 'antd';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import ActionCell from '@components/ActionCell';
import CustomSkeleton from '@components/CustomSkeleton';
import { URL } from '@url';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT, RULES, TRANG_THAI } from '@constants';
import {
  createDanhSachThucTap, deleteDanhSachThucTap, getAllDanhSachThucTap,
  getDotthuctapByID,
  updateDanhSachThucTap,
} from '@app/services/ThucTap/danhsachthuctapService';
import {
  createLopThucTap, deleteLopThucTap, getAllLopThucTap,
  getLopThucTapByID,
  updateLopThucTap,
} from '@app/services/ThucTap/lopthuctapService';
import { columnIndex, toast } from '@app/common/functionCommons';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import {
  EyeOutlined,
  PlusCircleOutlined,
  LeftCircleOutlined,
  DownCircleOutlined,
  DeleteOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { debounce } from 'lodash';
import axios from 'axios';
import Filter from '@components/Filter';
import AddNewButton from '@AddNewButton';
import Loading from '@components/Loading';
import ThemSuaLopThucTap from '@containers/ThucTap/DotThucTap/ThemSuaLopThucTap';


function DotThucTap({ isLoading, namhocList, ...props }) {
  const dotthuctapId = useParams()?.id;
  const [dotthuctapForm] = Form.useForm();
  const [lopthuctap, setLopThucTap] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const [isCreate, setCreate] = useState(false);


  useEffect(() => {
    if (!namhocList?.length) {
      props.getNamHoc();
    }
    (async () => {
      await getDataLopThucTap();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (dotthuctapId) {
        await getDataDotThucTap();
      } else {
        setCreate(true);
      }
    })();
  }, []);

  async function getDataLopThucTap(
    currentPage = lopthuctap.currentPage,
    pageSize = lopthuctap.pageSize,
    query = lopthuctap.query,
  ) {
    const apiResponse = await getAllLopThucTap(currentPage, pageSize, query);
    if (apiResponse) {
      setLopThucTap({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = lopthuctap.docs.map((data, index) => ({
    key: data._id,
    _id: data._id,
    ghiChu: data.ghi_chu,
    namHoc: data.namhoc_id,
    sinhVienHocCung: data.sinhvien_hoccung_id,
    lopThucTap: data.lophoc_id,
  }));

  const columns = [
    columnIndex(lopthuctap.pageSize, lopthuctap.currentPage),

    {
      title: 'Lớp',
      dataIndex: 'lopThucTap',
      key: 'lopThucTap',
      width: 200,
    },
    {
      title: 'Sinh viên học cùng',
      dataIndex: 'sinhVienHocCung',
      key: 'sinhVienHocCung',
      render: value => value?.ten_sinh_vien,
      width: 200,
    },
    // {
    //   title: 'Năm học',
    //   dataIndex: 'namHoc',
    //   key: 'namHoc',
    //   render: value => value?.nam_hoc,
    //   width: 150,
    // },
    // {
    //   title: 'Thời gian bắt đầu',
    //   dataIndex: 'thoiGianBatDau',
    //   key: 'thoiGianBatDau',
    //   render: value => value ? moment(value).format('DD/MM/YYYY') : '',
    //   width: 150,
    // },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      width: 300,
    },

    {
      align: 'center',
      render: (text, record, index) => {
        return <>
          <div className='mt-2'>

            <Tag color='blue' className='tag-action' onClick={() => handleEdit(record)}>
              <EyeOutlined/><span className='ml-1'>Chi tiết</span>
            </Tag>

            <Popconfirm
              title='Bạn có chắc chắn xóa lớp thực tập không?'
              onConfirm={() => handleDelete(record)}
              cancelText='Huỷ' okText='Xác nhận' okButtonProps={{ type: 'access' }}>
              <Tag color='red' className='tag-action'>
                <DeleteOutlined/><span className='ml-1'>Xóa</span>
              </Tag>
            </Popconfirm>
          </div>
        </>;
      },
      width: 300,
    },
  ];

  async function getDataDotThucTap() {
    if (dotthuctapId) {
      const apiResponse = await getDotthuctapByID(dotthuctapId);
      if (apiResponse) {
        dotthuctapForm.setFieldsValue({
          dotThucTap: apiResponse.ten_thuc_tap,
          namHoc: apiResponse.namhoc_id,
          thoiGianBatDau: apiResponse.thoi_gian_bat_dau ? moment(apiResponse.thoi_gian_bat_dau) : '',
          ghiChu: apiResponse.ghi_chu,
        });
      }
    }
  }

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
    // const apiResponse = await deleteDanhSachThucTap(userSelected._id);
    // if (apiResponse) {
    //   getDataDanhSachThucTap();
    //   toast(CONSTANTS.SUCCESS, 'Xóa đợt thực tập thành công');
    // }
  }


  let history = useHistory();

  function backUrl() {
    history.push(URL.MENU.DANH_SACH_THUC_TAP);
  }


  async function funcSaveData(data) {
    console.log('data', data);
    const { dotThucTap, ghiChu, thoiGianBatDau, namHoc } = data;
    const dataRequest = {
      ten_thuc_tap: dotThucTap,
      namhoc_id: namHoc,
      thoi_gian_bat_dau: thoiGianBatDau ? thoiGianBatDau.toString() : null,
      ghi_chu: ghiChu,
    };
    if (isCreate) {
      const apiResponse = await createDanhSachThucTap(dataRequest);
      if (apiResponse) {
        toast(CONSTANTS.SUCCESS, 'Thêm mới đợt thực tập thành công');
      }
    } else {
      dataRequest._id = dotthuctapId;
      const apiResponse = await updateDanhSachThucTap(dataRequest);
      if (apiResponse) {
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin đợt thực tập thành công');
      }
    }
  }

  function handleChangePagination(current, pageSize) {
    getDataLopThucTap(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = lopthuctap.currentPage;
  pagination.total = lopthuctap.totalDocs;
  pagination.pageSize = lopthuctap.pageSize;

  async function createAndModifyLopThucTap(type, dataForm) {
    const { ghiChu, sinhVienHocCung, lopHoc } = dataForm;
    const dataRequest = {
      lophoc_id: lopHoc,
      sinhvien_hoccung_id: sinhVienHocCung,
      ghi_chu: ghiChu,
      dotthuctap_id: dotthuctapId ? dotthuctapId : '',
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createLopThucTap(dataRequest);
      if (apiResponse) {
        getDataLopThucTap();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới lớp thực tập thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateLopThucTap(dataRequest);
      if (apiResponse) {
        const docs = lopthuctap.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setLopThucTap(Object.assign({}, lopthuctap, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin lớp thực tập thành công');
      }
    }
  }

  return (
    <div>

      <Card bordered={true} title="Chi tiết đợt thực tập">
        <Form size='small' form={dotthuctapForm} onFinish={funcSaveData}>
          <Row gutter={15}>
            <CustomSkeleton
              label="Năm học" name="namHoc"
              type={CONSTANTS.SELECT}
              disabled={!isCreate}
              rules={[RULES.REQUIRED]}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 6, sm: 24, md: 24, lg: 8, xl: 6, xxl: 4 } }}
              options={{ data: namhocList, valueString: '_id', labelString: 'name' }}
              labelLeft
            />

            <CustomSkeleton
              label="Đợt thực tập" name="dotThucTap"
              type={CONSTANTS.TEXT}
              rules={[RULES.REQUIRED]}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 6, sm: 24, md: 24, lg: 8, xl: 6, xxl: 4 } }}
              // disabled={!isCreate}
              labelLeft
            />
            <CustomSkeleton
              label="Thời gian bắt đầu" name="thoiGianBatDau"
              type={CONSTANTS.DATE}
              layoutCol={{ xs: 24 }}
              rules={[RULES.REQUIRED]}
              layoutItem={{ labelCol: { xs: 6, sm: 24, md: 24, lg: 8, xl: 6, xxl: 4 } }}
              // disabled={!isCreate}
              labelLeft
            />

            <CustomSkeleton
              label="Ghi chú" name="ghiChu"
              type={CONSTANTS.TEXT_AREA}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 6, sm: 24, md: 24, lg: 8, xl: 6, xxl: 4 } }}
              // disabled={!isCreate}
              labelLeft
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Row>
          <Card title={<span><UnorderedListOutlined /> Danh sách thực tập</span>}
                extra={ <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>}>
            {/*<Filter*/}
            {/*  dataSearch={[*/}
            {/*    {*/}
            {/*      name: 'nam_hoc', label: 'Năm học', type: CONSTANTS.SELECT,*/}
            {/*      options: { data: namhocList, valueString: '_id', labelString: 'name' },*/}
            {/*    },*/}
            {/*  ]}*/}
            {/*  // handleFilter={(query) => getDataDeTai(1, detai.pageSize, query)}/>*/}
            {/*/>*/}
            <Loading active={isLoading}>
              <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
            </Loading>
            <ThemSuaLopThucTap
              type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
              isModalVisible={state.isShowModal}
              handleOk={createAndModifyLopThucTap}
              handleCancel={() => handleShowModal(false)}
              userSelected={state.userSelected}
            />
          </Card>
          <Card>
            <Button type="primary" htmlType="submit" className='float-right ' size='small'>
              <DownCircleOutlined/>Lưu dữ liệu
            </Button>
            <Button type="primary" danger className="float-none " size='small'
                    onClick={() => backUrl()}>
              <LeftCircleOutlined/><span className='ml-1'>Quay lại</span>
            </Button>
          </Card>

        </Form>


      </Card>
    </div>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { namhocList } = store.namhoc;
  return { isLoading, namhocList };
}

export default (connect(mapStateToProps, { ...namhoc.actions })(DotThucTap));
