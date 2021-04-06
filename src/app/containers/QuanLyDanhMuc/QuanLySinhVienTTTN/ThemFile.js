import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Row, Col } from 'antd';
import ActionCell from '@components/ActionCell';
import { CONSTANTS } from '@constants';
import { SaveOutlined, EyeOutlined} from '@ant-design/icons';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import Loading from '@components/Loading';
import * as XLSX from 'xlsx';
import {createSinhVien} from '@app/services/SinhVienTTTN/sinhVienTTService';
import {getAllLopHoc} from '@app/services/LopHoc/lopHocService';
function ThemFile({ isLoading, ...props }) {

  const [file, setFile] = useState(null);
  const [classmate, setClassmate] = useState([]);
  const [dataImport, setDataImport] = useState(null);

  useEffect(() => {

    (async () => {
      getDataClass();
    })();
  }, []);


  async function getDataClass() {
    const apiResponse = await getAllLopHoc();
    console.log('claas', apiResponse.docs);
    if (apiResponse) {
      setClassmate(apiResponse.docs)
    }
  }
  function handleChangeClickInputFile() {
    document.getElementById("file").click();
  }

  async function handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) await setFile(files[0]);
  }

  function handleFile() {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = e => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true
      });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      console.log('data',data);
      setDataImport(data)
    };
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }

  console.log('dataImport',dataImport);

  async function handleClickButtonSave(){
    if(dataImport) {

      dataImport.forEach( data => {
        const lopId = classmate.find(item => item.ten_lop_hoc === data['Lớp']);
        const dataRequest = {
          ten_sinh_vien: data['Họ và tên'],
          ma_lop_hoc: lopId._id,
          ngay_sinh: data['Ngày sinh'] ? data['Ngày sinh'].toString() : null,
          ma_sinh_vien: data['Mã sinh viên'],
          dia_chi: data['Địa chỉ'] ? data['Địa chỉ'] : null,
          sdt: data['Số điện thoại'],
          email: data['Email'],
          gioi_tinh: data['Giới tính'],
        }
        createSinhVien(dataRequest);
      });
      // if (apiResponse) {
      //   toast(CONSTANTS.SUCCESS, 'Thêm mới sinh viên thành công');
      // }
    }
  }



  const dataSource = dataImport ? dataImport.map((data, index) => ({
    key: index + 1,
    tenSinhVien: data['Họ và tên'] || '',
    sdt: data['Số điện thoại']|| '',
    email: data['Email'] || '',
    ngaySinh: data['Ngày sinh'] || '',
    diaChi: data['Địa chỉ'] || '',
    tenLop: data['Lớp'] || '',
    maSinhVien: data['Mã sinh viên'] || '',
    gioiTinh: data['Giới tính'] || '',
  })) : [];

  const columns = [
    // columnIndex(sinhvien.pageSize, sinhvien.currentPage),
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      width: 50,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 200,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'tenSinhVien',
      key: 'tenSinhVien',
      render: (text, record, index) => <div>
        Họ và tên: <b>{record?.tenSinhVien}</b><br/>
        Ngày sinh: <b>{record?.ngaySinh ? moment(record.ngaySinh).format('DD/MM/YYYY') : ''}</b><br/>
        Giới tính: <b>{record?.gioiTinh}</b><br/>
      </div>,
      width: 300,
    },
    {
      title: 'Mã lớp',
      dataIndex: 'tenLop',
      key: 'tenLop',
      // render: value => value?.ten_lop_hoc,
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 300,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'sdt',
      key: 'sdt',
      width: 200,
    },

  ];


  return (
    <div>
      <Loading active={isLoading}>
      <Row style={{marginBottom:'10px'}} >
        <Col span={12}>
          <Row gutter={7}>
            <Col span={20}>
              <input style={hidden} type='file' id='file' onChange={ e => handleChange(e)}/>
                <Input
                  onClick={handleChangeClickInputFile}
                  placeholder="Chọn file"
                  style={{ float: 'left' }}
                  label={!file ? 'Chọn file' : 'File đã chọn'}
                  value={file ? file.name || '' : ''}
                />
            </Col>
            <Col span={4}>
              <Button
                type="primary" onClick={handleFile}
                disabled={ file ? false : true}
              >
                <EyeOutlined />
              Xem dữ liệu
              </Button>
            </Col>

          </Row>
        </Col>
        {dataImport !== null && <Col span={12}>
          <Button
            style={{float:'right'}}
            type="primary" onClick={handleClickButtonSave}
          >
            <SaveOutlined />
            Lưu dữ liệu
          </Button>
        </Col> }
      </Row>
        {dataImport !== null &&  <Table dataSource={dataSource} size='small' columns={columns} bordered/>}
      </Loading>

    </div>
  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default (connect(mapStateToProps)(ThemFile));


const  hidden = {
  height: 0,
  width: 0,
  hidden: 'hidden'
}
