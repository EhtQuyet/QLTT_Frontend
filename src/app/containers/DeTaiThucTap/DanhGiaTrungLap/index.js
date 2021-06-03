import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllDetai, getListDetai } from '@app/services/DeTaiTTTN/DeTaiService';
import { CONSTANTS, TRANG_THAI, TRANG_THAI_LABEL } from '@constants';
import { connect } from 'react-redux';
import { DOT_THUC_TAP, ROLE } from '@src/constants/contans';
import Detail from './detail';
import { columnIndex } from '@app/common/functionCommons';
import moment from 'moment';
import { Button, Popconfirm, Table, Tag, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { URL } from '@url';
import Loading from '@components/Loading';


function Index({ isLoading, myInfo, ...props }) {
  const [detai, setDeTai] = useState([]);
  const [index, setIndex] = useState()
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });
  const recordId = useParams()?.id;

  useEffect(() => {
    getDeTai();
  }, []);

  async function getDeTai() {
    const apiResponse = await getAllDetai(1, 0, {});
    const itemDeTai = await getAllDetai(1, 0, { _id: recordId });
    if (apiResponse && itemDeTai) {
      setIndex(itemDeTai.docs[0]);
      let arr = [];
      let item = itemDeTai.docs[0];
      for (let i = 0; i < apiResponse.docs.length; i++) {
        let rs = printSimilarity(item.ten_de_tai, apiResponse.docs[i].ten_de_tai);
        let x = Math.round(rs * 100) / 100;
        if (item._id !== apiResponse.docs[i]._id && x > 0.3) {
          arr = [...arr, apiResponse.docs[i]];
        }
      }
      setDeTai(arr);
    }
  }

  function handleCompare(userSelected) {
    setState({ isShowModal: true, userSelected });
  }

  function handleShowModal(isShowModal, userSelected = null) {
    setState({
      isShowModal,
      userSelected,
    });
  }

  const dataSource = detai.map((data, index) => ({
    _id: data._id,
    key: data._id,
    tenDeTai: data.ten_de_tai,
    maDeTai: data.ma_de_tai,
    ngayTao: data.created_at,
    trangThai: data.trang_thai,
    giangVien: data?.ma_giang_vien,
    noiDung: data?.noi_dung,
    tuKhoa: data?.tu_khoa,
    linhVuc: data?.ma_linh_vuc,
    nguoiTao: data?.ma_nguoi_tao,
    namHoc: data?.nam_hoc,
  }));

  const columns = [
    columnIndex(1, 1),
    {
      title: 'Tên đề tài',
      dataIndex: 'tenDeTai',
      key: 'tenDeTai',
      width: 300,
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'linhVuc',
      key: 'linhVuc',
      render: value => value?.ten_linh_vuc,
      width: 200,
    },
    {
      title: 'Giảng viên hướng dẫn',
      dataIndex: 'giangVien',
      key: 'giangVien',
      render: (value => value?.ten_giao_vien),
      width: 250,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: value => value ? moment(value).format('DD/MM/YYYY') : '',
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: value => <>
        {value === TRANG_THAI.CHUA_DUOC_DUYET ? <Tag color='gold'>Chưa được duyệt</Tag>
          : value === TRANG_THAI.DA_DUOC_DUYET ? <Tag color='cyan'>Đã được duyệt</Tag>
            : value === TRANG_THAI.DA_DANG_KY ? <Tag color='cyan'>Đã đăng ký</Tag>
              : value === TRANG_THAI.DA_HOAN_THANH ? <Tag color='green'>Đã hoàn thành</Tag>
                : value === TRANG_THAI.CHUA_DANG_KY ? <Tag color='lime'>Chưa đăng ký</Tag>
                  : value === TRANG_THAI.DANG_THUC_HIEN ? <Tag color='blue'>Đang thực hiện</Tag>
                    : <Tag color='red'></Tag>}
      </>,
      width: 150,
    },
    {
      align: 'center',
      render: record => {
        const daDuyet = record.trangThai === TRANG_THAI.DA_DUOC_DUYET;
        const chuaDuocDuyet = record.trangThai === TRANG_THAI.CHUA_DUOC_DUYET;
        return <>
          {(isAdmin || isGiaoVu) &&
          <Tooltip title="So sánh" placement="left" color='primary' key='primary'>
            <Button size='small'
                    type="primary"
                    style={{ borderColor: 'white' }}
                    onClick={() => handleCompare(record)}
            >
              <CopyOutlined/>
            </Button>
          </Tooltip>}

        </>;
      },
    },
  ];

  const isAdmin = myInfo && myInfo.role.includes(ROLE.ADMIN);
  const isSinhVien = myInfo && myInfo.role.includes(ROLE.SINH_VIEN);
  const isGiangVien = myInfo && myInfo.role.includes(ROLE.GIANG_VIEN);
  const isGiaoVu = myInfo && myInfo.role.includes(ROLE.GIAO_VU);
  const isBanChuNiem = myInfo && myInfo.role.includes(ROLE.BAN_CHU_NHIEM);

  function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / longerLength;
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  function printSimilarity(string1, string2) {
    return similarity(string1, string2);
  }

  return (
    <>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={false} bordered/>
      </Loading>
      <Detail
        isModalVisible={state.isShowModal}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
        index={index}
      />
    </>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default (connect(mapStateToProps, {})(Index));
;
