import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Typography,
  Form,
  InputNumber,
  Row,
  Table,
  Card, Col, Divider, Tag, Popconfirm, Switch, Input,
} from 'antd';
import { DeleteOutlined, SaveFilled } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'react-redux';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, CONSTANTS_ERROR, RULES, TOAST_MESSAGE, TRANG_THAI } from '@constants';
import { getKeHoachById, createKeHoach, updateKeHoach } from '@app/services/KeHoach/keHoach.service';
import Loading from '@components/Loading';
import { URL } from '@url';
import ActionCell from '@components/ActionCell';

function keHoachDetail({ isLoading, ...props }) {

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const kehoachID = useParams()?.id;

  const [form] = Form.useForm();
  const [isFormEdited, setFormEdited] = useState(false);
  const [isShowModal, toggleModal] = useState(false);
  const [isFinish, setFinish] = useState(false);

  const [stateUpload, setStateUpload] = useState(false);
  useEffect(() => {
  }, []);

  useEffect(() => {
    (async () => {
      if (kehoachID) {
        await getDataRecord();
      } else {
      }
    })();
  }, []);


  async function getDataRecord() {
    const apiResponse = await getKeHoachById(kehoachID)
  }


  async function handleSaveData() {

  }


  const columns = [
    { title: 'Thời gian bắt đầu', dataIndex: 'batDau', width: 150 },
    { title: 'Thời gian kết thúc', dataIndex: 'ketThuc', width: 150 },
    { title: 'Nội dung công việc', dataIndex: 'noiDung', width: 200 },
    { title: 'Kết quả công việc', dataIndex: 'ketQua', width: 200 },
  ];

  let dataSource = [];

  async function onValuesChange(changedValues, allValues) {

    if (!isFormEdited) {
      setFormEdited(true);
    }
  }

  async function handleApprove(e) {

  }

  return (
    <>
      <Form size="small" form={form} onFinish={handleSaveData} scrollToFirstError={true}
            onValuesChange={onValuesChange}>
        <Row>
          <CustomSkeleton
            label="Mã sinh viên" name="maSinhVien"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24, lg: 15 }}
            layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 } }}
            showSearch
            disabled={isLoading}
            rules={[RULES.REQUIRED]}
            showInputLabel={isFinish}
            labelLeft
            labelInValue
            fullLine
          />
          <CustomSkeleton
            label="Họ và tên" name="tenSinhVien"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24, lg: 15 }}
            layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 } }}
            rules={[RULES.REQUIRED]}
            showSearch
            disabled={isLoading}
            showInputLabel={isFinish}
            labelLeft
            labelInValue
            fullLine
          />
          <CustomSkeleton
            label="Ghi chú" name="ghiChu"
            type={CONSTANTS.TEXT}
            layoutCol={{ xs: 24, lg: 15 }}
            layoutItem={{ labelCol: { xs: 6, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 } }}
            showSearch
            disabled={isLoading}
            rules={[RULES.REQUIRED]}
            showInputLabel={isFinish}
            labelLeft
            labelInValue
            fullLine
          />
        </Row>
        <Divider orientation="left" plain={false} className="m-0">
          {'Chi tiết kế hoạch thực tập'}
        </Divider>

        <Loading active={isLoading}>
          <Table
            dataSource={dataSource}
            columns={columns}
            // pagination={false}
          />
        </Loading>

        <Row className="clearfix mt-2">
          <Col xs={24} lg={15} xl={8}>
            <Row>
              <p>Xác nhận kế hoạch: </p>
              <Popconfirm
                onConfirm={(e) => handleApprove(e)}
                okText="Xác nhận"
                title={isFinish ? `Hủy xác nhận kế hoạch thực tập` : `Xác nhận kế hoạch thực tập`}
              >
                <Switch className="ml-2" size="default" checked={isFinish} loading={isLoading}
                />
              </Popconfirm>
            </Row>

          </Col>
          {!isFinish && <Col xs={24} lg={9} xl={16}>
            <Button
              size="small" type="primary"
              htmlType="submit"
              className="pull-right"
              loading={isLoading}
              icon={<SaveFilled/>}
            >
              {kehoachID ? `Cập nhật kế hoạch thực tập` : `Tạo kế hoạch thực tập`}
            </Button>
          </Col>}
        </Row>
      </Form>
    </>
  )
    ;
}

function mapStateToProps(store) {
  const { isLoading } = store.app;

  return { isLoading };
}

const actions = {};


export default (connect(mapStateToProps, actions)(keHoachDetail));

