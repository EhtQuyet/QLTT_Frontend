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
import * as lophoc from '@app/store/ducks/lophoc.duck';
import {
  EyeOutlined,
  PlusCircleOutlined,
  LeftCircleOutlined,
  DownCircleOutlined,
  DeleteOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import axios from 'axios';
import Filter from '@components/Filter';
import AddNewButton from '@AddNewButton';
import Loading from '@components/Loading';
import ThemSuaLopThucTap from '@containers/ThucTap/DotThucTap/ThemSuaLopThucTap';


function DotThucTap({ isLoading, namhocList, classmateList, ...props }) {
  const dotthuctapId = useParams()?.id;
  const [dotthuctapForm] = Form.useForm();
  const [lopthuctap, setLopThucTap] = useState(PAGINATION_INIT);

  const [tablelopthuctap, setDataTableLopThucTap] = useState({
    data: [],
  });
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const [isCreate, setCreate] = useState(false);


  useEffect(() => {
    if (!namhocList?.length) {
      props.getNamHoc();
    }
    if (!classmateList?.length) {
      props.getClass();
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

  const dataSource = tablelopthuctap.data.map((data, index) => ({
    key: index + 1,
    ghiChu: data.ghiChu,
    sinhVienHocCung: data.sinhVienHocCungId,
    lopThucTap: data.lopHoc,
  }));

  const columns = [
    columnIndex(lopthuctap.pageSize, lopthuctap.currentPage),

    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      width: 200,
    },
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
      // render: value => value?.ten_sinh_vien,
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
      title: 'Thao  tác',
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
    const apiResponse = await deleteLopThucTap(userSelected._id);
    if (apiResponse) {
      getDataLopThucTap();
      toast(CONSTANTS.SUCCESS, 'Xóa lớp thực tập thành công');
    }
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

  async function createAndModifyLopThucTap(dataForm) {
    console.log('dataTable', dataForm);
    var dataSv = tablelopthuctap.data.concat(dataForm);
    console.log(dataSv);
    setDataTableLopThucTap({
      data: [...dataSv],
    });
    console.log('tablelopthuctap', tablelopthuctap);

    handleShowModal(false);
  }

  return (
    <div>
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
              label="Lớp thực tập" name="lopHoc"
              mode="multiple"
              type={CONSTANTS.SELECT}
              disabled={!isCreate}
              rules={[RULES.REQUIRED]}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 6, sm: 24, md: 24, lg: 8, xl: 6, xxl: 4 } }}
              options={{ data: classmateList, valueString: '_id', labelString: 'name' }}
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
          <Divider orientation="left" plain={false} className='m-0'>
            {'Danh sách sinh viên học cùng'}
          </Divider>

          <div className='clearfix'>
            <Button
              size='small' type="primary" className='float-right mb-2'
              icon={<i className='fa fa-plus mr-1'/>}
              // onClick={() => toggleModal(true)}
              onClick={() => handleShowModal}
            >
              Thêm sinh viên
            </Button>
          </div>
          <Loading active={isLoading}>
            <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
          </Loading>
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
    </div>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { namhocList } = store.namhoc;
  const { classmateList } = store.lophoc;
  return { isLoading, namhocList, classmateList };
}

export default (connect(mapStateToProps, { ...namhoc.actions, ...lophoc.actions })(DotThucTap));
