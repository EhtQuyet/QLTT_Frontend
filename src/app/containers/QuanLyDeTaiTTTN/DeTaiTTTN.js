import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import CreateOrModifyStaff from './CreateOrModifyStaff';
import { createDeTai, deleteDeTai, getAllDeTai, updateDeTai } from '@app/services/Staff/StaffService';
import ActionCell from '@components/ActionCell';
import { CONSTANTS, PAGINATION_CONFIG, PAGINATION_INIT } from '@constants';
import { columnIndex, toast } from '@app/common/functionCommons';
import moment from 'moment';
import { connect } from 'react-redux';

import Filter from '@components/Filter';
import Loading from '@components/Loading';

function DetaiTTTN({ isLoading, ...props }) {
  const [detai, setDetai] = useState(PAGINATION_INIT);
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  useEffect(() => {
    (async () => {
      await getDataDeTai();
    })();
  }, []);
  // useEffect(() => {
  //   if (!props?.unitList?.length) {
  //     props.getUnit();
  //   }
  //   if (!staffList.length) {
  //     props.getStaff();
  //   }
  // }, []);

  async function getDataStaff(
    currentPage = detai.currentPage,
    pageSize = detai.pageSize,
    query = detai.query,
  ) {
    const apiResponse = await getAllDeTai(currentPage, pageSize, query);
    if (apiResponse) {
      setDetai({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  const dataSource = detai.docs.map((data, index) => ({
    key: data._id,
    tenNhanVien: data.ten_nhan_vien,
    sdt: data.sdt,
    cmnd: data.cmnd,
    ngayCap: data.ngay_cap ? moment(data.ngay_cap) : null,
    donVi: data?.id_don_vi,
    noiCap: data.noi_cap,
    _id: data._id,
  }));

  const columns = [
    columnIndex(staff.pageSize, staff.currentPage),

    {
      title: 'Tên nhân viên',
      dataIndex: 'tenNhanVien',
      key: 'tenNhanVien',
      width: 200
    },
    {
      title: 'Số chứng minh',
      dataIndex: 'cmnd',
      key: 'cmnd',
      width: 200
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'sdt',
      key: 'sdt',
      width: 200
    },
    {
      title: 'Đơn vị',
      dataIndex: 'donVi',
      key: 'donVi',
      render: (value => value?.ten_don_vi),
      width: 350
    },
    {
      align: 'center',
      render: (value) => <ActionCell value={value} handleEdit={handleEdit} handleDelete={handleDelete}/>,
      width: 300,
    },
  ];

  function handleShowModal(isShowModal, userSelected = null) {
    setState({
      isShowModal,
      userSelected,
    });
  }

  function handleEdit(userSelected) {
    setState({ isShowModal: true, userSelected });
  }

  async function handleDelete(userSelected) {
    const apiResponse = await deleteStaff(userSelected._id);
    if (apiResponse) {
      getDataStaff();
      toast(CONSTANTS.SUCCESS, 'Xóa nhân viên thành công');
      updateStoreStaff(CONSTANTS.DELETE,apiResponse);
    }
  }

// function create or modify
  async function createAndModifyStaff(type, dataForm) {

    const dataRequest = {
      ten_nhan_vien: dataForm.tenNhanVien,
      cmnd: dataForm.cmnd,
      ngay_cap: dataForm.ngayCap ? dataForm.ngayCap.toString() : null,
      id_don_vi: dataForm.idDonVi,
      noi_cap: dataForm.noiCap,
      sdt: dataForm.sdt,
    };
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createStaff(dataRequest);
      if (apiResponse) {
        getDataStaff();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Thêm mới nhân viên thành công');
        updateStoreStaff(type,apiResponse);
      }
      // getDataStaff();
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateStaff(dataRequest);
      if (apiResponse) {
        const docs = staff.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setStaff(Object.assign({}, staff, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin nhân viên thành công');
        updateStoreStaff(type,apiResponse);
      }
    }
  }
  function updateStoreStaff(type, dataResponse) {
    if (!type || !dataResponse || !staffList.length) return;

    const dataChanged = {
      _id: dataResponse._id,
      code: dataResponse.ma_nhan_vien,
      name: dataResponse.ten_nhan_vien,
    };
    let staffListUpdated = [];
    if (type === CONSTANTS.UPDATE) {
      staffListUpdated = staffList.map(staff => {
        if (staff._id === dataChanged._id) {
          return dataChanged;
        }
        return staff;
      });
    }

    if (type === CONSTANTS.DELETE) {
      staffListUpdated = staffList.filter(staff => {
        return staff._id !== dataChanged._id;
      });
    }

    if (type === CONSTANTS.CREATE) {
      staffListUpdated = [...staffList, dataChanged];
    }

    props.setCalUnit(staffListUpdated);
  }

  function handleChangePagination(current, pageSize) {
    getDataStaff(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = staff.currentPage;
  pagination.total = staff.totalDocs;
  pagination.pageSize = staff.pageSize;
  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'ten_nhan_vien', label: 'Tên nhân viên', type: CONSTANTS.TEXT },
          {
            name: 'id_don_vi', label: 'Đơn vị ', type: CONSTANTS.SELECT,
            options: { data: unitList, valueString: '_id', labelString: 'name' },
          },
        ]}
        handleFilter={(query) => getDataStaff(1, staff.pageSize, query)}/>

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table dataSource={dataSource} size='small' columns={columns} pagination={pagination} bordered/>
      </Loading>
      <CreateOrModifyStaff
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyStaff}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}

export default (connect(mapStateToProps)(DetaiTTTN));
