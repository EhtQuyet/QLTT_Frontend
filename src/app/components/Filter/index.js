import React, { useState } from 'react';
import { Button, Col, Collapse, DatePicker, Divider, Form, Input, InputNumber, Row, Select } from 'antd';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { CaretRightOutlined, ClearOutlined } from '@ant-design/icons';

import { CONSTANTS } from '@constants';
import './Filter.scss';

const layoutCol = { 'xs': 24, 'sm': 24, 'md': 12, 'lg': 12, 'xl': 8, 'xxl': 6 };

const layoutItem = {
  labelAlign: 'left',
  labelCol: { span: 10 },
  wrapperCol: { span: 16 },
};

function Filter({ loading, dataSearch, clearWhenChanged, onSearchChange, ...props }) {
  const [formFilter] = Form.useForm();

  const [isCollapse, setCollapse] = useState(false);
  const [isChanged, setChanged] = useState(false);
  const [activeKey, setActiveKey] = useState([]);

  function renderFilterText(data) {
    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <Input placeholder={data.label} disabled={loading} allowClear/>
      </Form.Item>
    </Col>;
  }

  function renderFilterNumber(data) {
    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <InputNumber placeholder={data.label} disabled={loading} allowClear style={{ width: '100%' }}/>
      </Form.Item>
    </Col>;
  }

  function renderFilterSelect(data) {
    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <Select placeholder={`Chọn ${data.label}`} disabled={loading} dropdownClassName='small'
                allowClear showSearch={data.showSearch}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
          {Array.isArray(data.options) && data.options.map(option => {
            return <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>;
          })}

          {(typeof data.options === 'object' && Array.isArray(data.options.data))
          && data.options.data.map(option => {
            return <Select.Option
              key={option.value || option[data.options.valueString]}
              value={option.value || option[data.options.valueString]}>
              {option.label || option[data.options.labelString]}
            </Select.Option>;
          })}
        </Select>
      </Form.Item>
    </Col>;
  }

  function renderFilterMultiSelect(data) {
    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <Select placeholder={`Chọn ${data.label}`} disabled={loading} dropdownClassName='small'
                allowClear mode="multiple">
          {Array.isArray(data.options) && data.options.map(option => {
            return <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>;
          })}
        </Select>
      </Form.Item>
    </Col>;
  }

  function renderFilterDate(data) {
    return <Col {...layoutCol} key={data.name}>
      <Form.Item label={data.label} name={data.name} {...layoutItem}>
        <DatePicker size='small' style={{ width: '100%' }} format="DD-MM-YYYY"
                    placeholder={`Chọn ${data.label}`} disabled={loading}
                    dropdownClassName='small'/>
      </Form.Item>
    </Col>;
  }

  function clearSearch() {
    formFilter.resetFields();
    if (!isChanged)
      setChanged(true);
  }

  function filter(values) {
    const query = {};
    dataSearch.forEach(item => {
      Object.entries(values).forEach(([key, value]) => {
        if (key === item.name && value) {
          query[key] = item.type === CONSTANTS.TEXT ? `/${value}/i` : [value];
        }
      });
    });
    setChanged(false);
    if (props.handleFilter) {
      props.handleFilter(query);
    }
  }

  function onValuesChange(changedValues, allValues) {
    if (!isChanged) {
      setChanged(true);
    }
    if (onSearchChange)
      onSearchChange(
        JSON.parse(JSON.stringify(changedValues)),
        JSON.parse(JSON.stringify(allValues)));

    if (clearWhenChanged) {
      Object.keys(changedValues).forEach(key => {
        clearWhenChanged.forEach(item => {
          if (key === item.change) {
            formFilter.setFieldsValue({ [item.clear]: undefined });
          }
        });
      });
    }
  }

  function handleChange(activeKey) {
    setActiveKey(activeKey);
  }

  // isCollapse;
  // setCollapse;
  return <div>
    <Collapse
      ghost
      // onChange={handleChange}
      className='filter-header'
      activeKey={isCollapse ? '1' : ''}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
    >
      <Collapse.Panel
        showArrow={false}
        className='p-0'
        header={<Divider orientation="left" className='m-0 cursor-default'>
          <div onClick={() => setCollapse(!isCollapse)} className='cursor-pointer d-flex'>
            <span style={{ fontSize: '14px', marginBottom: '15px' }} className='mr-2'>Lọc dữ liệu</span>
            <div>
              <i className={`fa fa-chevron-right ${isCollapse ? 'fa-rotate-90' : ''}`} aria-hidden="true"/>
            </div>
          </div>
        </Divider>}
        key="1">
        <Form form={formFilter} autoComplete='off' size='small' colon={false}
              className='form-no-feedback'
              onValuesChange={onValuesChange.bind(this)}
              onFinish={filter}>
          <Row gutter={15}>
            {dataSearch.map(search => {
              if (search.type === CONSTANTS.TEXT)
                return renderFilterText(search);
              if (search.type === CONSTANTS.SELECT)
                return renderFilterSelect(search);
              if (search.type === CONSTANTS.MULTI_SELECT)
                return renderFilterMultiSelect(search);
              if (search.type === CONSTANTS.DATE)
                return renderFilterDate(search);
              if (search.type === CONSTANTS.NUMBER)
                return renderFilterNumber(search);
            })}

            <Col {...layoutCol} className='ml-auto'>
              <div className='ant-form-item d-block clearfix'>
                <Button htmlType='submit' size='small' type='primary' className='pull-right'
                        disabled={loading || !isChanged}
                        icon={<i className="fa fa-filter mr-1"/>}>
                  Tìm kiếm
                </Button>
                <Button htmlType='button' size='small' className='pull-right mr-2' disabled={loading}
                        danger
                        icon={<ClearOutlined/>} onClick={clearSearch}>
                  Xoá bộ lọc
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Collapse.Panel>
    </Collapse>
  </div>;

}

export default Filter;
