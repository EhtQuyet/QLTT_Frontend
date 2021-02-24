import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import AddNewButton from '@AddNewButton';
import CreateOrModifyUser from '@containers/User/CreateOrModifyUser';
import { createUser, deleteUserById, getAllUser, updateUserById } from '@app/services/User/UserService';
import { CONSTANTS, GENDER_OPTIONS, PAGINATION_CONFIG } from '@constants';
import ActionCell from '@components/ActionCell';
import { columnIndex, convertParam, toast } from '@app/common/functionCommons';
import Filter from '@components/Filter';
import { connect } from 'react-redux';
import Loading from '@components/Loading';


function User({ isLoading, ...props }) {
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  const [userData, setUserData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  useEffect(() => {
    getDataUser();
  }, []);

  async function getDataUser(
    currentPage = userData.currentPage,
    pageSize = userData.pageSize,
    query = userData.query,
  ) {
    const apiResponse = await getAllUser(currentPage, pageSize, query);

    if (apiResponse) {
      setUserData({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  function handleShowModal(isShowModal, userSelected = null) {
    setState({ isShowModal, userSelected });
  }

  async function createAndModifyUser(type, dataForm) {
    const dataRequest = {
      full_name: dataForm.fullName,
      gender: dataForm.gender,
      username: dataForm.username,
      role: dataForm.role,
      email: dataForm.email,
      phone: dataForm.phone,
    };

    if (type === CONSTANTS.CREATE) {
      dataRequest.password = dataForm.password;

      const apiResponse = await createUser(dataRequest);
      if (apiResponse) {
        getDataUser();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Tạo mới tài khoản thành công');
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.userSelected._id;
      const apiResponse = await updateUserById(dataRequest);
      if (apiResponse) {
        const docs = userData.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setUserData(Object.assign({}, userData, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, 'Chỉnh sửa thông tin tài khoản thành công');
      }
    }
  }

  async function handleDelete(userSelected) {
    const apiResponse = await deleteUserById(userSelected._id);
    if (apiResponse) {
      getDataUser();
      toast(CONSTANTS.SUCCESS, 'Xóa tài khoản thành công');
    }
  }

  async function handleSearch(key, value) {
    const newQuery = Object.assign({}, userData.query, { [key]: value });
    const newParams = convertParam(newQuery);
    const oldParams = convertParam(userData.query);
    if (newParams !== oldParams) {
      getDataUser(1, userData.pageSize, Object.assign({}, userData.query, { [key]: value }));
    }
  }

  const dataSource = userData.docs.map((user, index) => {
    user.key = index + 1;
    user.fullName = user.full_name;
    return user;
  });

  const columns = [
    columnIndex(userData.pageSize, userData.currentPage),
    {
      title: 'Tên',
      dataIndex: 'fullName',
      key: 'name',
      // ...searchColumnInput('full_name[like]', handleSearch, 'Tên'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // ...searchColumnInput('email[like]', handleSearch, 'Email'),
    },
    {
      title: 'Gới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (value) => GENDER_OPTIONS.find(gender => gender.value === value)?.label,
      // ...searchColumnCheckbox('gender', handleSearch, GENDER_OPTIONS),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      align: 'center',
      render: (value) => <ActionCell value={value} handleEdit={handleEdit} handleDelete={handleDelete}/>,
      width: 300,
    },
  ];

  function handleEdit(userSelected) {
    setState({ isShowModal: true, userSelected });
  }

  function handleChangePagination(current, pageSize) {
    getDataUser(current, pageSize);
  }

  const pagination = PAGINATION_CONFIG;
  pagination.onChange = handleChangePagination;
  pagination.current = userData.currentPage;
  pagination.total = userData.totalDocs;
  pagination.pageSize = userData.pageSize;

  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'full_name', label: 'Tên người dùng', type: CONSTANTS.TEXT },
          { name: 'email', label: 'Email', type: CONSTANTS.TEXT },
          {
            name: 'gender', label: 'Giới tính', type: CONSTANTS.SELECT,
            options: { data: GENDER_OPTIONS },
          },
        ]}
        handleFilter={(query) => getDataUser(1, userData.pageSize, query)}
      />

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading}/>
      <Loading active={isLoading}>
        <Table bordered dataSource={dataSource} size='small' columns={columns} pagination={pagination}/>
      </Loading>
      <CreateOrModifyUser
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyUser}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
      />
    </div>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default (connect(mapStateToProps)(User));
