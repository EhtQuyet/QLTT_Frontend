import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Table, Divider, Col } from 'antd';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, PAGINATION_CONFIG, RULES } from '@constants';
import { connect } from 'react-redux';
import moment from 'moment';
import * as namhoc from '@app/store/ducks/namhoc.duck';
import * as dotthuctap from '@app/store/ducks/dotthuctap.duck';
import Loading from '@components/Loading';
import { DownloadOutlined } from '@ant-design/icons';
import { generateDocx, loadResources } from '@app/common/generateDocx';
import { formatDate } from '@app/common/functionCommons';
import { getAllDKTT } from '@app/services/ThucTap/DKThucTap/dangkythuctapService';
import { DOT_THUC_TAP } from '@src/constants/contans';

function ReportSinhVienDKTT({ isLoading, namhocList, dotthuctapList, ...props }) {
  const [reportBySuppliesForm] = Form.useForm();
  const [reportData, setReportData] = useState([]);
  const [dotTT, setDotTT] = useState([]);

  useEffect(() => {
    (async () => {
      await loadResources();
    })();

    if (!namhocList?.length) {
      props.getNamHoc();
    }
    if (!props?.dotthuctapList?.length) {
      props.getDotThucTap();
    }
  }, []);

  async function handleChangeNamHoc(namhocSelected) {
    if (!namhocSelected) return;
    const data = dotthuctapList.filter(item => {
      if (item.namhoc._id === namhocSelected) return item;
    });
    console.log('data', data);
    setDotTT(data);
  }

  // let dataSource = [];
  const dataSource = reportData.map((data, index) => ({
    key: index + 1,
    tenSinhVien: data?.sinh_vien.ten_sinh_vien,
    maSinhVien: data?.sinh_vien.ma_sinh_vien,
    diaDiem: data?.dia_diem_thuc_tap,
    giangVien: data?.giao_vien_huong_dan,
    diem_tbtl: data?.diem_tbtl,
    so_tctl: data?.so_tctl,
    dkTTTN: 'Đủ điều kiện',
  }));
  const columns = [
    { title: 'TT', dataIndex: 'key', align: 'center', width: 50 },
    { title: 'Họ và tên', dataIndex: 'tenSinhVien', align: 'center', width: 200 },
    { title: 'Mã SV', dataIndex: 'maSinhVien', align: 'center', width: 100 },
    { title: 'Địa điểm thực tập', dataIndex: 'diaDiem', align: 'center', width: 200 },
    {
      title: 'Giảng viên hướng dẫn',
      dataIndex: 'giangVien',
      render: value => value?.ten_giao_vien,
      align: 'center',
      width: 200,
    },
    { title: 'Điểm TBTL', dataIndex: 'diem_tbtl', align: 'center', width: 100 },
    { title: 'Số TCTL', dataIndex: 'so_tctl', align: 'center', width: 100 },
    { title: 'Đề nghị xét ĐK TTTN', dataIndex: 'dkTTTN', width: 100, align: 'center' },
  ];

  async function handleFindStudent() {
    const { dotThucTap } = reportBySuppliesForm.getFieldsValue();
    const apiResponse = await getAllDKTT(1, 0, { dot_thuc_tap: dotThucTap });
    if (apiResponse) {
      setReportData(apiResponse.docs);
    }
    console.log('apiResponse', apiResponse.docs);
  }

  function printReport() {
    // // const values = reportBySuppliesForm.getFieldsValue();
    // // const {
    // //   donVi, lyDoChuyen, diaDiemBanGiao,
    // //   donViChuyen, cmndNguoiChuyen, ngayCapCmndNguoiChuyen, noiCapCmndNguoiChuyen,
    // //   donViNhan, cmndNguoiNhan, ngayCapCmndNguoiNhan, noiCapCmndNguoiNhan,
    // // } = values;
    // // const nguoiChuyen = staffOptions.sender.find(staff => staff._id === values.nguoiChuyen);
    // // const nguoiNhan = staffOptions.receiver.find(staff => staff._id === values.nguoiNhan);
    // //
    //
    // let danhSach = [];
    // reportData.forEach((row, index) => {
    //   if (!row.notEdited) {
    //     const dataPush = {
    //       stt: index + 1,
    //       vatTu: row.id_vattu.ten_vat_tu,
    //       donViTinh: row.id_vattu.ma_don_vi_tinh.ten_don_vi_tinh,
    //       tgDauKy: moment(row.thoigian_dauky).format('DD-MM-YYYY'),
    //       tgCuoiKy: moment(row.thoigian_cuoiky).format('DD-MM-YYYY'),
    //       tonKhoDauKy: row.tonkho_dauky,
    //       soLuongTang: row.soluong_tang,
    //       soLuongGiam: row.soluong_tang,
    //       tonKhoCuoiKy: row.tonkho_cuoiky,
    //     };
    //     danhSach = [...danhSach, dataPush];
    //   }
    // });
    // const dataDocx = {
    //   danhSach,
    // };
    //
    // generateDocx(dataDocx, 'BaoCaoThucLucTheoVatTu', `Báo cáo thực lực theo vật tư`);
  }

  return (
    <Form id='reportDKTT' size='small' form={reportBySuppliesForm} onFinish={handleFindStudent}>
      <Row gutter={0}>
        <CustomSkeleton
          label="Năm học" name="namHoc"
          type={CONSTANTS.SELECT}
          layoutCol={{ xs: 24, xl: 12 }}
          labelCol={{ xs: 6, sm: 6, md: 6, lg: 8, xl: 6, xxl: 8 }}
          options={{ data: namhocList, valueString: '_id', labelString: 'name' }}
          onChange={(namhocSelected) => handleChangeNamHoc(namhocSelected)}
          rules={[RULES.REQUIRED]}
          showSearch
          fullLine
          labelLeft/>

        <CustomSkeleton
          label="Đợt thực tập" name="dotThucTap"
          type={CONSTANTS.SELECT}
          layoutCol={{ xs: 24, xl: 12 }}
          labelCol={{ xs: 6, sm: 6, md: 6, lg: 8, xl: 6, xxl: 8 }}
          options={{ data: dotTT, valueString: '_id', labelString: 'name' }}
          rules={[RULES.REQUIRED]}
          showSearch
          fullLine
          labelLeft
        />


        <Col xs={24} xl={24} className='mb-2'>
          <Button type="primary" className='float-right' size='small' htmlType='submit'>
            Tra cứu
          </Button>
        </Col>
      </Row>

      <Loading active={isLoading}>
        <Table
          size='small'
          bordered
          columns={columns}
          dataSource={dataSource}
          // pagination={PAGINATION_CONFIG}
          scroll={{ x: 'max-content' }}
        />
      </Loading>

      <div className='clearfix mt-2'>
        <Button size='small' className='float-right' disabled={!reportData.length} type='primary'
                onClick={printReport}>
          <DownloadOutlined/>Tải xuống báo cáo
        </Button>
      </div>
    </Form>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { namhocList } = store.namhoc;
  const { dotthuctapList } = store.dotthuctap;

  return { isLoading, dotthuctapList, namhocList };
}

export default (connect(mapStateToProps, {
  ...namhoc.actions,
  ...dotthuctap.actions,
})
(ReportSinhVienDKTT));
