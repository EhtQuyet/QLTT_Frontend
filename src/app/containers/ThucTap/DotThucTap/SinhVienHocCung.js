import React, { useEffect, useRef, useState } from 'react';
import { Col, Modal, Row, Table, Card , Button} from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, GENDER_OPTIONS, HOCVI_OPTIONS, PAGINATION_INIT, RULES } from '@constants';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';
import { DownCircleOutlined, LeftCircleOutlined, UnorderedListOutlined , } from '@ant-design/icons';
import AddNewButton from '@AddNewButton';
import * as lophoc from '@app/store/ducks/lophoc.duck';
import * as sinhvien from '@app/store/ducks/sinhvien.duck';
import { getAllLopThucTap } from '@app/services/ThucTap/lopthuctapService';


function SinhVienHocCung({ isModalVisible, handleOk, handleCancel, classmateList, sinhVienList, ...props }) {

  const [sinhvienhoccungForm] = Form.useForm();
  const [svHocCung, setSvHocCung] = useState({
    data: [],
  });
  let svhcId = [];
  useEffect(() => {
    if (!isModalVisible) {
      sinhvienhoccungForm.resetFields();
    }
  }, [isModalVisible]);
 useEffect(() => {
    if (!classmateList?.length) {
      props.getClass();
    }
    if (!sinhVienList?.length) {
      props.getSinhVien();
    }
    (async () => {
      await getDataSinhVien();
    })();
  }, []);

  function pushDataToTable() {
    console.log('svhcId', svhcId);
    handleOk(svhcId)
    setSvHocCung({
      data: [],
    });
  }


  const columns = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'tenSinhVien',
      key: 'tenSinhVien',
    },
    {
      title: 'Lớp',
      dataIndex: 'lopHoc',
      key: 'lopHoc',
      render: value => value?.ten_lop_hoc,
    },

  ];
  const dataSource = svHocCung.data.map((data, index) => ({
    key: data._id,
    _id: data._id,
    tenSinhVien: data.name,
    maSinhVien: data.code,
    lopHoc: data.classmate,
  }));

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRows', selectedRows);
      svhcId = selectedRows;

    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  // get student data from the selected class

  function onValuesChange(changedValues, allValues) {
    if (changedValues.lopHoc) {
      const dataSvHocCung = sinhVienList.filter(data => data.classmate._id === changedValues.lopHoc);
      setSvHocCung({
        data: [...dataSvHocCung],
      });
    }
  }

  async function getDataSinhVien() {


  }

  return (
    <Modal
      width='1196px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={'Thêm sinh viên thực tập cùng'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<div>
        <Button type="primary" danger className="float-none " size='small'
                onClick={handleCancel}>
          <LeftCircleOutlined/><span className='ml-1'>Quay lại</span>
        </Button>
        <Button type="primary" htmlType="submit" className='float-right ' size='small'
                onClick={() => pushDataToTable()}>
          <DownCircleOutlined/>Lưu dữ liệu
        </Button>
      </div>
      }
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form  form={sinhvienhoccungForm} size='default'
              onValuesChange={onValuesChange}
        >
          <Card>
            <Row gutter={15}>
              <CustomSkeleton
                size='default'
                label="Chọn lớp" name="lopHoc"
                type={CONSTANTS.SELECT}
                layoutCol={{ xs: 24 }}
                layoutItem={{ labelCol: { xs: 8 } }}
                rules={[RULES.REQUIRED]}
                options={{ data: classmateList, valueString: '_id', labelString: 'name' }}
                labelLeft
                form={sinhvienhoccungForm}
              />
            </Row>
          </Card>
          <br></br>
          <Card title={<span><UnorderedListOutlined/> Sinh viên thực tập cùng</span>}>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
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
  const { sinhVienList } = store.sinhvien;

  return { isLoading, classmateList, sinhVienList };
}

export default (connect(mapStateToProps, { ...lophoc.actions, ...sinhvien.actions })(SinhVienHocCung));

