import React, {useEffect, useState} from 'react';
import { Pie , Column} from '@ant-design/charts';
import { Row, Col, Card, Divider } from 'antd'
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, RULES, TRANG_THAI } from '@constants';
import  {getThongKeSinhVien, getThongKeSVTheoDiaDiem} from '@app/services/ThongKe/ThongKeService';
import { getAllDetai } from '@app/services/DeTaiTTTN/DeTaiService';


export default function Dashboard() {
  const [svthuctap, setSvthuctap] = useState([])
  const [svthuctaptheodiadiem, setSvthuctaptheodiadiem] = useState([])


  useEffect(() => {
    (async () => {
      await getdataSV();
      await getdataSVTheoDiaDiem();
    })();

  }, []);

  async function getdataSV() {
    const dataSV = await getThongKeSinhVien()
    setSvthuctap(dataSV)
  }
  async function getdataSVTheoDiaDiem() {
    const dataSVTheoDiaDiem = await getThongKeSVTheoDiaDiem()
    setSvthuctaptheodiadiem(dataSVTheoDiaDiem)
  }

  var config1 = {
    appendPadding: 10,
    data: svthuctaptheodiadiem,
    angleField: 'SoSV',
    colorField: 'diadiem',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };
  var config = {
    appendPadding: 10,
    data: svthuctaptheodiadiem,
    angleField: 'SoSV',
    colorField: 'diadiem',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref) {
        var percent = _ref.percent.toFixed(2);
        return ''.concat(percent * 100, '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  var configColumn = {
    data: svthuctap,
    colorField : 'TrangThai',
    autoFit: true,
    xField: 'TrangThai',
    yField: 'SoSV',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    axis : {
      label: {
        autoRotate: true
      }

    },
    meta: {
      type: { alias: '' },
      sales: { alias: '' },
    },
  };

  return (
    <h1>
      <Row>
        <CustomSkeleton
          size='default'
          label="Năm học" name="namHoc"
          type={CONSTANTS.SELECT}
          layoutCol={{ xs: 8 , lg : 8 , xl : 8 }}
          layoutItem={{ labelCol: { xs: 8 } }}
          labelLeft
          options={{ data: [{
              _id :"603e025b68501a22b45d0341",
              name :"2019 -2020"
            },
              {
                _id :"603e025b68501a22b45d0341",
                name :"2021 -2022"
              }
            ],
            valueString: '_id',
            labelString: 'name' }}
        />
      </Row>
      <Row gutter={24}>
        <Col lg={8} xl={8}>
          <Divider orientation="left">Sinh viên đăng kí thực tập</Divider>

          <Column {...configColumn} />
        </Col>
        <Col lg={16} xl={16}>
          <Divider orientation="left">Sinh viên thực  tại các địa điểm</Divider>

          <Pie {...config} />
        </Col>
      </Row>

    </h1>
  );
}
