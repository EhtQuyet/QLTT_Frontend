import React, { useState, useEffect } from 'react';
import { Modal, Col, Form, Button, Progress } from 'antd';
import { connect } from 'react-redux';
import { PaperClipOutlined } from '@ant-design/icons';

import ModalFooter from '@components/ModalFooter/ModalFooter';
import { CONSTANTS, RULES } from '@constants';
import Dropzone from 'react-dropzone';
import { formatBytes, toast } from '@app/common/functionCommons';

function UploadFile({ isModalVisible, handleCancel, handleOk, ...props }) {
  const [fileUpload, setFileUpload] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(CONSTANTS.NOT_UPLOADED);
  const [progressUpload, setProgressUpload] = useState(0);
  const [importSupplyForm] = Form.useForm();

  useEffect(() => {
    if (isModalVisible) {
      setFileUpload(null);
      setUploadStatus(CONSTANTS.NOT_UPLOADED);
      setProgressUpload(0);
    }
  }, [isModalVisible]);

  async function handleUploadFile() {
    await setProgressUpload(0);
    await setUploadStatus(CONSTANTS.UPLOADING);
    const config = {
      onUploadProgress: function(progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgressUpload(percentCompleted === 100 ? 99 : percentCompleted);
      },
    };

    // const apiResponse = await uploadSuppliesFile(fileUpload, config);
    // console.log(apiResponse);
    // setProgressUpload(100);
    // if (apiResponse.success === true) {
    //   await setUploadStatus(CONSTANTS.UPLOADED);
    //   toast(CONSTANTS.SUCCESS, 'Tải lên thành công');
    //   handleOk(true);
    // } else if (apiResponse.success === false){
    //   await setUploadStatus(CONSTANTS.UPLOAD_ERROR);
    //   toast(CONSTANTS.ERROR, 'Tập tin không hợp lệ');
    // }
    handleCancel(true);
  }

  function onDrop(files) {
    if (!files || !files[0]) return;

    setUploadStatus(CONSTANTS.NOT_UPLOADED);
    setFileUpload(files[0]);
    setProgressUpload(0);
  }

  const disableCancel = uploadStatus === CONSTANTS.UPLOADING;

  return (
    <Modal
      width='720px' maskClosable={false}
      closeIcon={<i className='fa fa-times'/>}
      title={'Thêm mới vật tư'}
      visible={isModalVisible} onCancel={disableCancel ? null : handleCancel}
      footer={<ModalFooter
        formId='formUpload'
        handleClose={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledSubmit={![CONSTANTS.NOT_UPLOADED, CONSTANTS.UPLOAD_ERROR].includes(uploadStatus) || !fileUpload}
        isDisabledClose={disableCancel}
        submitType={CONSTANTS.CONFIRM}
        cancelType={CONSTANTS.CLOSE}
      />}
      forceRender
    >
      <div className='clearfix'>
        <div className='clearfix'>
          <Dropzone accept=".xlsx .docs" onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className='float-left'>
                <input {...getInputProps()} />
                <Button type="primary" size='small'>
                  <i className='fa fa-file-upload mr-2'/>Chọn tập tin
                </Button>
              </div>
            )}
          </Dropzone>
        </div>

        {fileUpload && <ul className="ant-list-items">
          <li className="ant-list-item ant-row">
            <Col xs={24}>
              <PaperClipOutlined className='mr-1'/>
              {`${fileUpload.name} (${formatBytes(fileUpload.size)})`}
            </Col>
            <Col xs={24}>
              {progressUpload !== 0 &&
              <Progress strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                        status={uploadStatus === CONSTANTS.UPLOAD_ERROR
                          ? 'exception'
                          : uploadStatus === CONSTANTS.UPLOADING
                            ? 'active'
                            : ''}
                        percent={progressUpload}/>}
            </Col>
          </li>
        </ul>}

      </div>

      <Form form={importSupplyForm} name='formUpload' onFinish={handleUploadFile}/>


    </Modal>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default (connect(mapStateToProps, {})(UploadFile));

