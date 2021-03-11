import React, { useEffect, useRef, useState } from 'react';
import { Col, Modal, Row, Table, Card, Tag, Popconfirm, Button } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, HOCVI_OPTIONS, PAGINATION_INIT, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';
import {
  DeleteOutlined,
  DownCircleOutlined,
  EyeOutlined,
  LeftCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import AddNewButton from '@AddNewButton';
import { deleteLopThucTap } from '@app/services/ThucTap/lopthuctapService';
import { columnIndex, toast } from '@app/common/functionCommons';
import SinhVienHocCung from '@containers/ThucTap/DotThucTap/SinhVienHocCung';
import * as lophoc from '@app/store/ducks/lophoc.duck';

function ThemSuaLopThucTap({ isModalVisible, handleOk, handleCancel, classmateList, userSelected, ...props }) {
  const [lopthuctapForm] = Form.useForm();

  useEffect(() => {
    console.log('lophoc', classmateList);
    if (!classmateList?.length) {
      props.getClass();
    }
  }, []);


  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.lopHoc = userSelected.lopHoc._id;
      lopthuctapForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      lopthuctapForm.resetFields();
    }
  }, [isModalVisible]);

  // function onFinish(data) {
  //   if (props.isLoading) return;
  //   handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  // }


// Xử lý sinh viên hoc cùng
  const [sinhvienhoccung, setSinhVienHocCung] = useState({
    data: [],
  });
  const [state, setState] = useState({
    isShowModal: false,
  });

  function handleShowModal(isShowModal) {
    setState({
      isShowModal,
    });
  }

  async function handleDelete(userSelected) {
    const apiResponse = sinhvienhoccung.data.filter(data => data._id !== userSelected._id);
    setSinhVienHocCung({
      data: [...apiResponse],
    });
  }
  const dataSource = sinhvienhoccung.data.map((data, index) => ({
    key: data._id,
    _id: data._id,
    tenSinhVien: data.tenSinhVien,
    maSinhVien: data.maSinhVien,
    lopHoc: data.lopHoc,
  }));
  const columns = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 200,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'tenSinhVien',
      key: 'tenSinhVien',
      width: 200,
    },
    {
      title: 'Lớp',
      dataIndex: 'lopHoc',
      key: 'lopHoc',
      render: value=> value?.ten_lop_hoc,
      width: 300,
    },

    {
      title: 'Thao tác',
      align: 'center',
      render: (text, record, index) => {
        return <>
          <div className='mt-2'>
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

  function addSinhVienHocCung(dataTable) {
    handleShowModal(false);
    console.log('data', dataTable);
    var dataSv = sinhvienhoccung.data.concat(dataTable);
    setSinhVienHocCung({
      data: [...dataSv],
    });
  }

// Xử lý sinh viên hoc cùng xong

  function pushDataToTableLopThucTap () {
    let data = {lopHoc, sinhVienHocCungId: [], ghiChu};
    let dataForm = lopthuctapForm.getFieldsValue(lopHoc);
    data.lopHoc =  dataForm.lopHoc;
    data.ghiChu =  dataForm.ghiChu;

    sinhvienhoccung.data.forEach(item => data.sinhVienHocCungId.push(item._id));
    console.log('data', data);
    if (props.isLoading) return;
    handleOk(data);
  }



  return (
    <Modal
      width='1024px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={userSelected ? 'Cập nhật thông tin lớp thực tập' : 'Thêm mới lớp thực tập'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<div>
        <Button type="primary" danger className="float-none " size='small'
                onClick={handleCancel}>
          <LeftCircleOutlined/><span className='ml-1'>Quay lại</span>
        </Button>
        <Button type="primary" htmlType="submit" className='float-right ' size='small'
                onClick={() => pushDataToTableLopThucTap()}>
          <DownCircleOutlined/>Lưu dữ liệu
        </Button>
      </div>
      }
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={lopthuctapForm} size='default'>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Lớp học" name="lopHoc"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              options={{ data: classmateList, valueString: '_id', labelString: 'name' }}
              labelLeft
              form={lopthuctapForm}
            />
            <CustomSkeleton
              size='default'
              label="Ghi chú" name="ghiChu"
              type={CONSTANTS.TEXT_AREA}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={lopthuctapForm}
            />
          </Row>
          <Card title={<span><UnorderedListOutlined/> Sinh viên thực tập cùng</span>}
                extra={<AddNewButton onClick={() => handleShowModal(true)}/>}>
            <Table size='small' columns={columns} dataSource={dataSource}/>
            <SinhVienHocCung
              isModalVisible={state.isShowModal}
              handleOk={addSinhVienHocCung}
              handleCancel={() => handleShowModal(false)}
            />
          </Card>


        </Form>
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { classmateList } = store.lophoc;

  return { isLoading, classmateList };
}

export default (connect(mapStateToProps, lophoc.actions)(ThemSuaLopThucTap));

