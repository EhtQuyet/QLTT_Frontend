import React, { useEffect,useState, useRef } from 'react';
import { Col, Modal, Row } from 'antd';
import ModalFooter from '@components/ModalFooter/ModalFooter';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, RULES } from '@constants';
import { getAllLinhVuc } from '@app/services/LinhVuc/linhVuc.service';
import { getAllNamHoc } from '@app/services/NamHoc/namhocService';
import Form from 'antd/es/form';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import moment from 'moment';

function ThemSuaDeTaiTTTN({ isModalVisible, handleOk, handleCancel, userSelected, ...props }) {
  const [detaiForm] = Form.useForm();
  const [listLinhVuc, setListLinhVuc] = useState();
  const [listNamHoc, setListNamHoc] = useState();

  useEffect(() => {
    if (userSelected && isModalVisible) {
      const dataField = Object.assign({}, userSelected);
      dataField.ngayTao = userSelected.ngayTao ? moment(userSelected.ngayTao) : '';
      dataField.linhVuc = userSelected.linhVuc._id;
      dataField.giangVien = userSelected.giangVien._id;
      detaiForm.setFieldsValue(dataField);
    } else if (!isModalVisible) {
      detaiForm.resetFields();
    }
    (async () => {
      await getData();
    })();
  }, [isModalVisible]);

  async function getData() {
    const api = await getAllLinhVuc();
    if(api){
      setListLinhVuc(api.docs);
    }
    const apiNamHoc = await getAllNamHoc();
    if(apiNamHoc){
      setListNamHoc(apiNamHoc.docs);
    }
  }
  function onFinish(data) {
    if (props.isLoading) return;
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }

  return (
    <Modal
      width='720px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={userSelected ? 'Cập nhật thông tin đề tài' : 'Thêm mới đề tài'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={<ModalFooter
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      />}
      forceRender
    >
      <Loading active={props.isLoading}>
        <Form id="formModal" form={detaiForm} size='default' onFinish={onFinish}>
          <Row gutter={15}>
            <CustomSkeleton
              size='default'
              label="Tên đề tài" name="tenDeTai"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={detaiForm}
            />
            <CustomSkeleton
              size='default'
              label="Mã đề tài" name="maDeTai"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              rules={[RULES.REQUIRED]}
              labelLeft
              form={detaiForm}
            />
            <CustomSkeleton
              size='default'
              label="Lĩnh vực" name="linhVuc"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              options={{ data: listLinhVuc, valueString: '_id', labelString: 'ten_linh_vuc' }}
              labelLeft
              rules={[RULES.REQUIRED]}
            />
            <CustomSkeleton
              size='default'
              label="Giảng viên hướng dẫn" name="giangVien"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              options={{ data: props.teacherList, valueString: '_id', labelString: 'name' }}
              labelLeft
              rules={[RULES.REQUIRED]}
            />
            <CustomSkeleton
              size='default'
              label="Năm học" name="namHoc"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 8 } }}
              options={{ data: listNamHoc, valueString: '_id', labelString: 'nam_hoc' }}
              labelLeft
              rules={[RULES.REQUIRED]}
            />
          </Row>
        </Form>
      </Loading>
    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { bomonList } = store.bomon;
  const { teacherList } = store.giaovien;

  return { isLoading , bomonList, teacherList};
}
export default (connect(mapStateToProps)(ThemSuaDeTaiTTTN));

