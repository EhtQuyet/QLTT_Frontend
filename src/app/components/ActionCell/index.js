import React, { Fragment } from 'react';
import { Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


function ActionCell({
                      handleEdit = null,
                      handleDelete = null,
                      allowEdit = true,
                      allowDelete = true,
                      disabledEdit = false,
                      disabledDelete = false,
                      confirmDelete = true,
                      linkToEdit = null,
                      labelDelete = 'Xoá',
                      title = 'Bạn chắc chắn muốn xoá?',
                      okText = 'Xóa',
                      cancelText = 'Huỷ',
                      value = {},
                      ...props
                    }) {

  const deleteButton = disabledDelete
    ? <Tag color='default' style={{ cursor: 'not-allowed' }}>
      <DeleteOutlined/>{labelDelete && <span className='ml-1'>{labelDelete}</span>}
    </Tag>
    : <Tag
      color='red' className='tag-action'
      onClick={() => confirmDelete ? null : handleDelete(value)}>
      <DeleteOutlined/>{labelDelete && <span className='ml-1'>{labelDelete}</span>}
    </Tag>;

  return <Fragment>
    {allowEdit && !disabledEdit && handleEdit &&
    <Tag color='cyan' className='tag-action' onClick={() => handleEdit(value)}>
      <EditOutlined/><span className='ml-1'>Chỉnh sửa</span>
    </Tag>}
    {allowEdit && !disabledEdit && linkToEdit && <Link to={linkToEdit}>
      <Tag color='cyan' className='tag-action'>
        <EditOutlined/><span className='ml-1'>Chỉnh sửa</span>
      </Tag>
    </Link>}

    {disabledEdit && <Tag color='default' style={{ cursor: 'not-allowed' }}>
      <EditOutlined/><span className='ml-1'>Chỉnh sửa</span>
    </Tag>}


    {!disabledDelete && allowDelete && confirmDelete && <Popconfirm
      key={value._id + value._id} title={title}
      onConfirm={() => handleDelete(value)}
      cancelText={cancelText} okText={okText} okButtonProps={{ type: 'danger' }}>
      {deleteButton}
    </Popconfirm>}

    {(disabledDelete || (allowDelete && !confirmDelete)) && deleteButton}
  </Fragment>;
}

export default ActionCell;
