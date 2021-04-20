import React from 'react';
import { Pie , Column} from '@ant-design/charts';
import { Row, Col, Card, Divider } from 'antd'
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, RULES } from '@constants';


export default function Dashboard() {
  var data = [
    {
      type: ' Đủ điều kiện thực tập',
      value: 27,
    },
    {
      type: 'Không đủ điều kiện',
      value: 3,
    },
  ];
  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref) {
        var percent = _ref.percent;
        return ''.concat(percent * 100, '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  var dataColumn = [
    {
      type: 'Công ty ThinkLab',
      soluong: 38,
    },
    {
      type: 'Công ty Hàm Rồng',
      soluong: 52,
    },
    {
      type: 'Công ty Minh Lộ',
      soluong: 61,
    },
    {
      type: 'Công ty 21B Ngọc Lan',
      soluong: 145,
    },
  ];
  var configColumn = {
    data: dataColumn,
    xField: 'type',
    yField: 'soluong',
    label: {
      autoRotate: true,
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      type: { alias: '' },
      sales: { alias: '' },
    },
  };

  console.log('Dashboard')
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
      <Divider orientation="left">Sinh viên tham gia thực tập-----</Divider>
      <Row gutter={24}>
        <Col lg={12} xl={12}>
          <Pie {...config} />
        </Col>
        <Col lg={12} xl={12}>
          <Column {...configColumn} />
        </Col>
      </Row>

    </h1>
  );
}
