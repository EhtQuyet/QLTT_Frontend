import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Form, Input, InputNumber, Popconfirm, Row, Select, Switch, Table, Tooltip , Card} from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';

import ActionCell from '@components/ActionCell';
import CustomSkeleton from '@components/CustomSkeleton';
import { URL } from '@url';
import { CONSTANTS, RULES, TRANG_THAI } from '@constants';

import { getDotthuctapByID } from '@app/services/ThucTap/danhsachthuctapService';
import { columnIndex, toast } from '@app/common/functionCommons';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import { PlusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import axios from 'axios';
import Filter from '@components/Filter';
import AddNewButton from '@AddNewButton';
import Loading from '@components/Loading';
import ThemSuaDanhSachThucTap from '@containers/ThucTap/DanhSachThucTap/ThemSuaDanhSachThucTap';


function DotThucTap({ isLoading, namhocList, ...props }) {
  const dotthuctapId = useParams()?.id;
  const [dotthuctapForm] = Form.useForm();
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  useEffect(() => {
    console.log('123', namhocList);
    if (!namhocList?.length) {
      props.getNamHoc();
    }
    (async () => {
      await getDataDotThucTap();
    })();
  }, []);

  async function getDataDotThucTap() {
    if (dotthuctapId) {
      const apiResponse = await getDotthuctapByID(dotthuctapId);
      if (apiResponse) {
        dotthuctapForm.setFieldsValue({
          dotThucTap: apiResponse.ten_thuc_tap,
          namHoc: apiResponse.namhoc_id,
          thoiGianBatDau: apiResponse.thoi_gian_bat_dau ? moment(apiResponse.thoi_gian_bat_dau).format('DD/MM/YYYY') : '',
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
  return (
    <div>

      <Card title="Chi tiết đợt thực tập">
        <Form size='small' form={dotthuctapForm}>
          <Row style={{ display: 'flex', justifyContent: 'center' }}>
            <CustomSkeleton
              label="Năm học" name="namHoc"
              type={CONSTANTS.SELECT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 6, sm: 24, md: 24, lg: 8, xl: 6, xxl: 4 } }}
              options={{data: namhocList, valueString: '_id', labelString: 'name'}}
               disabled
              labelLeft
            />

            <CustomSkeleton
              label="Đợt thực tập" name="dotThucTap"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 6, sm: 24, md: 24, lg: 8, xl: 6, xxl: 4 } }}
              disabled labelLeft
            />
            <CustomSkeleton
              label="Thời gian bắt đầu" name="thoiGianBatDau"
              type={CONSTANTS.TEXT}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 6, sm: 24, md: 24, lg: 8, xl: 6, xxl: 4 } }}
              disabled labelLeft
            />

            <CustomSkeleton
              label="Ghi chú" name="ghiChu"
              type={CONSTANTS.TEXT_AREA}
              layoutCol={{ xs: 24 }}
              layoutItem={{ labelCol: { xs: 6, sm: 24, md: 24, lg: 8, xl: 6, xxl: 4 } }}
              disabled labelLeft
              autoSize={{ minRows: 2, maxRows: 3 }}
            />
          </Row>
        </Form>
        {/*<Card title="Danh sách nhóm đi thực tập">*/}
        {/*  <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>*/}
        {/*    <Card>*/}

        {/*    </Card>*/}
        {/*</Card>*/}
      </Card>,

    </div>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { namhocList } = store.namhoc;
  return { isLoading, namhocList };
}

export default (connect(mapStateToProps, { ...namhoc.actions })(DotThucTap));
