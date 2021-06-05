import React, { useEffect } from 'react';
import { Modal, Row, Col, Tag } from 'antd';
import { TRANG_THAI } from '@constants';
import { connect } from 'react-redux';
import Loading from '@components/Loading';

function Detail({ isModalVisible, handleCancel, userSelected, index, ...props }) {


  useEffect(() => {

  }, []);


  function renderTrangThai(value) {
    return (
      <>
        {value === TRANG_THAI.CHUA_DUOC_DUYET ? <Tag color='gold'>Chưa được duyệt</Tag>
          : value === TRANG_THAI.DA_DUOC_DUYET ? <Tag color='cyan'>Đã được duyệt</Tag>
            : value === TRANG_THAI.DA_DANG_KY ? <Tag color='cyan'>Đã đăng ký</Tag>
              : value === TRANG_THAI.DA_HOAN_THANH ? <Tag color='green'>Đã hoàn thành</Tag>
                : value === TRANG_THAI.CHUA_DANG_KY ? <Tag color='lime'>Chưa đăng ký</Tag>
                  : value === TRANG_THAI.DANG_THUC_HIEN ? <Tag color='blue'>Đang thực hiện</Tag>
                    : <Tag color='red'></Tag>}
      </>
    );
  }

  return (
    <Modal
      width='720px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={'Đối chiếu đề tài trùng lặp'}
      visible={isModalVisible} onCancel={props.isLoading ? null : handleCancel}
      footer={null}
      forceRender
    >

      <Loading active={props.isLoading}>
        <Row>
          <Col span={4}
               style={{ padding: '10px', fontWeight: '700', textAlign: 'left', borderBottom: '1px #DDDDDD solid' }}>Tiêu
            chí</Col>
          <Col span={10}
               style={{ padding: '10px', fontWeight: '700', textAlign: 'left', borderBottom: '1px #DDDDDD solid' }}>Đề
            tài 1</Col>
          <Col span={10}
               style={{ padding: '10px', fontWeight: '700', textAlign: 'left', borderBottom: '1px #DDDDDD solid' }}>Đề
            tài 2</Col>
        </Row>
        <Row>
          <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Tên đề
            tài</Col>
          <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{userSelected?.tenDeTai}</Col>
          <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{index?.ten_de_tai}</Col>
        </Row>
        <Row>
          <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>lĩnh vực</Col>
          <Col span={10}
               style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{userSelected?.linhVuc.ten_linh_vuc}</Col>
          <Col span={10}
               style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{index?.ma_linh_vuc.ten_linh_vuc}</Col>
        </Row>
        <Row>
          <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Giảng
            viên</Col>
          <Col span={10} style={{
            padding: '10px',
            borderBottom: '1px #DDDDDD solid',
          }}>{userSelected?.giangVien.ten_giao_vien}</Col>
          <Col span={10}
               style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{index?.ma_giang_vien.ten_giao_vien}</Col>
        </Row>
        <Row>
          <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Nội dung</Col>
          <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{userSelected?.noiDung}</Col>
          <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{index?.noi_dung}</Col>
        </Row>
        <Row>
          <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Năm học</Col>
          <Col span={10}
               style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{userSelected?.namHoc.nam_hoc}</Col>
          <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>{index?.nam_hoc.nam_hoc}</Col>
        </Row>
        <Row>
          <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>Từ khóa</Col>
          <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>
            {userSelected?.tuKhoa.map((i, k) => {
              return <Tag style={{ marginBottom: '3px' }} key={k}>{i.tu_khoa}</Tag>;
            })}
          </Col>
          <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>
            {index?.tu_khoa.map((i, k) => {
              return <Tag style={{ marginBottom: '3px' }} key={k}>{i.tu_khoa}</Tag>;
            })}
          </Col>
        </Row>
        <Row>
          <Col span={4} style={{ padding: '10px', fontWeight: '500', borderBottom: '1px #DDDDDD solid' }}>
            Trạng thái
          </Col>
          <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>
            {renderTrangThai(userSelected?.trangThai)}
          </Col>
          <Col span={10} style={{ padding: '10px', borderBottom: '1px #DDDDDD solid' }}>
            {renderTrangThai(index?.trang_thai)}
          </Col>
        </Row>
      </Loading>

    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { bomonList } = store.bomon;

  return { isLoading, bomonList };
}

export default (connect(mapStateToProps)(Detail));

