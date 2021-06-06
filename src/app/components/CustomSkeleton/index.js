import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, DatePicker, Empty, Form, Input, Select, Skeleton, Spin, Switch, Checkbox } from 'antd';
import { CONSTANTS, RULES } from '@constants';

import './CustomSkeleton.scss';

class FullLine extends Component {
  render() {
    if (this.props.isFullLine) {
      return <Col xs={24}>
        <Row>
          {this.props.children}
        </Row>
      </Col>;
    } else {
      return this.props.children;
    }
  }
}

class CustomSkeleton extends Component {

  renderDatePicker(type = CONSTANTS.DATE) {
    const { allowClear, placeholder, label, size, showInputLabel, disabled, disabledDate } = this.props;
    return <DatePicker
      style={{ width: '100%' }}
      className={showInputLabel ? 'input-label' : ''}
      format={type === CONSTANTS.DATE ? 'DD-MM-YYYY' : 'DD-MM-YYYY HH:mm'}
      showTime={type === CONSTANTS.DATE_TIME}
      allowClear={allowClear}
      placeholder={placeholder || label}
      disabledDate={disabledDate}
      size={size}
      disabled={showInputLabel || disabled}/>;
  }

  renderInput() {
    const { label, prefix, suffix, size, placeholder, disabled, showInputLabel } = this.props;
    return <Input
      className={showInputLabel ? 'input-label' : ''}
      placeholder={placeholder || label}
      onBlur={() => this.onBlur()}
      prefix={prefix}
      suffix={suffix}
      size={size}
      disabled={disabled || showInputLabel}
    />;
  }
  renderFile() {
    const { label, prefix, suffix, size, placeholder, disabled, showInputLabel } = this.props;
    return <Input
      className={showInputLabel ? 'input-label' : ''}
      type='file'
      placeholder={placeholder || label}
      onBlur={() => this.onBlur()}
      prefix={prefix}
      suffix={suffix}
      size={size}
      disabled={disabled || showInputLabel}
    />;
  }
  renderCheckbox() {
    const { label, prefix, suffix, size, placeholder, disabled, showInputLabel } = this.props;
    return <Checkbox
      className={showInputLabel ? 'input-label' : ''}
      onBlur={() => this.onBlur()}
      prefix={prefix}
      suffix={suffix}
      size={size}
      disabled={disabled || showInputLabel}
      onChange={onChange}
    />;
  }

  async onBlur() {
    const { form, name } = this.props;
    if (!form) return;
    const value = form.getFieldsValue()?.[name];
    if (value !== value?.trim()) {
      await form.setFieldsValue({ [name]: value.trim() });
      await form.validateFields([name]);
    }
  }

  renderCheckBox() {
    return <Checkbox onChange={this.props.onChange}/>;
  }

  renderSwitch() {
    return <Switch size={this.props.size}/>;
  }

  renderPassword() {
    return <Input.Password placeholder={this.props.placeholder || this.props.label}
                           autoComplete="new-password"
                           prefix={this.props.prefix}
                           suffix={this.props.suffix}
                           size={this.props.size}
                           disabled={this.props.disabled}/>;
  }

  renderSelect() {
    const { label, options, placeholder, filterOption, fetching, labelInValue, allowClear, showInputLabel } = this.props;
    const { size, disabled, showSearch, onSearch, onChange, value, type, suffix, mode } = this.props;
    // const mode = type === CONSTANTS.SELECT ? '' : 'multiple';
    return <Select
      className={showInputLabel ? 'select-label' : ''}
      placeholder={placeholder || `Chọn ${label}`}
      size={size}
      disabled={showInputLabel || disabled}
      dropdownClassName='small'
      showSearch={showSearch}
      onSearch={onSearch}
      onChange={onChange}
      mode={mode}
      suffixIcon={suffix}
      notFoundContent={fetching
        ? <Spin size="small"/>
        : <Empty className='m-0' image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
      filterOption={filterOption}
      labelInValue={labelInValue}
      allowClear={allowClear}
    >
      {Array.isArray(options?.data) && options.data.map(item => {
        return <Select.Option
          key={item.value || item[options.valueString]}
          value={item.value || item[options.valueString]}
          extra={item}>
          {item.label || item[options.labelString]}
        </Select.Option>;
      })}
    </Select>;
  }

  renderArea() {
    const { label, showInputLabel, autoSize, size, disabled, placeholder } = this.props;

    return <Input.TextArea
      className={showInputLabel ? 'input-label' : ''}
      size={size}
      onBlur={() => this.onBlur()}
      placeholder={placeholder || label}
      disabled={showInputLabel || disabled}
      autoSize={autoSize}
    />;
  }

  renderLabel() {
    const { prefix, suffix, size } = this.props;
    return <Input className='input-label' prefix={prefix} suffix={suffix} size={size} disabled/>;
  }

  renderSelectLabel() {
    const { options, labelInValue, size } = this.props;

    return <Select className='select-label' size={size} dropdownClassName='small' labelInValue={labelInValue} disabled>
      {Array.isArray(options?.data) && options.data.map(item => {
        return <Select.Option
          key={item.value || item[options.valueString]}
          value={item.value || item[options.valueString]}>
          {item.label || item[options.labelString]}
        </Select.Option>;
      })}
    </Select>;
  }

  render() {
    const {
      type, isShowSkeleton, rules, labelStrong, validateTrigger,
      showInputLabel, hasFeedback, disabled,
      layoutCol,
    } = this.props;

    const labelCol = this.props.labelCol || this.props.layoutItem.labelCol;

    const wrapperCol = {};
    Object.entries(labelCol).forEach(([key, value]) => {
      wrapperCol[key] = 24 - value;
    });

    const label = labelStrong
      ? <strong>{this.props.label}</strong>
      : this.props.label;

    let inputHtml = this.props.children;
    switch (type) {
      case CONSTANTS.TEXT:
        inputHtml = this.renderInput();
        break;
      case CONSTANTS.DATE:
        inputHtml = this.renderDatePicker();
        break;
      case CONSTANTS.DATE_TIME:
        inputHtml = this.renderDatePicker(CONSTANTS.DATE_TIME);
        break;
      case CONSTANTS.SELECT:
      case CONSTANTS.SELECT_MULTI:
        inputHtml = this.renderSelect();
        break;
      case CONSTANTS.TEXT_AREA:
        inputHtml = this.renderArea();
        break;
      case CONSTANTS.FILE:
        inputHtml = this.renderFile();
        break;
      case CONSTANTS.PASSWORD:
        inputHtml = this.renderPassword();
        break;
      case CONSTANTS.CHECK_BOX:
        inputHtml = this.renderCheckBox();
        break;
      case CONSTANTS.SWITCH:
        inputHtml = this.renderSwitch();
        break;
      case CONSTANTS.LABEL:
        inputHtml = this.renderLabel();
        break;
      case CONSTANTS.SELECT_LABEL:
        inputHtml = this.renderSelectLabel();
        break;
      default:
        break;
    }

    if (isShowSkeleton) {
      return <FullLine isFullLine={this.props.fullLine}>
        <Col {...layoutCol}
             className={(this.props.helpInline ? 'help-inline' : 'help-not-inline') + (this.props.className ? ` ${this.props.className}` : '')}>
          <Form.Item
            label={label}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
            name={this.props.name}
            hasFeedback={rules.includes(RULES.REQUIRED) && hasFeedback && !showInputLabel}
            className={this.props.itemClassName || ''}
            style={this.props.itemStyle || {}}
            colon={this.props.colon}
            rules={this.props.rules}
            size={this.props.size}
            dependencies={this.props.dependencies}
            labelAlign={this.props.labelLeft ? 'left' : 'right'}
            validateTrigger={validateTrigger || (Array.isArray(rules) && rules.length ? ['onChange', 'onBlur'] : false)}>
            <Skeleton.Input active size={this.props.size} className='w-100'/>
          </Form.Item>
        </Col>
      </FullLine>;
    }
    return <FullLine isFullLine={this.props.fullLine}>
      <Col {...layoutCol}
           className={(this.props.helpInline ? 'help-inline' : 'help-not-inline') + (this.props.className ? ` ${this.props.className}` : '')}>
        <Form.Item
          label={label}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          name={this.props.name}
          hasFeedback={rules.includes(RULES.REQUIRED) && hasFeedback && !disabled && !showInputLabel}
          className={this.props.itemClassName || ''}
          style={this.props.itemStyle || {}}
          colon={this.props.colon}
          rules={this.props.rules}
          size={this.props.size}
          dependencies={this.props.dependencies}
          labelAlign={this.props.labelLeft ? 'left' : 'right'}
          validateTrigger={validateTrigger || (Array.isArray(rules) && rules.length ? ['onChange', 'onBlur'] : false)}
          valuePropName={type === CONSTANTS.SWITCH ? 'checked' : 'value'}
        >
          {inputHtml}
        </Form.Item>
      </Col>
    </FullLine>;
  }
}

CustomSkeleton.propTypes = {
  className: PropTypes.string,
  allowClear: PropTypes.bool,
  fullLine: PropTypes.bool,
  helpInline: PropTypes.bool,
  labelInValue: PropTypes.bool,
  rules: PropTypes.array,
  hasFeedback: PropTypes.bool,
  labelStrong: PropTypes.bool,
  colon: PropTypes.bool,
  hidden: PropTypes.bool,
  size: PropTypes.string,
  layoutCol: PropTypes.object,
  itemStyle: PropTypes.object,
  labelLeft: PropTypes.bool,
  fetching: PropTypes.bool,
  showInputLabel: PropTypes.bool,
  filterOption: PropTypes.any,
  itemClassName: PropTypes.string,
  form: PropTypes.any,
  autoSize: PropTypes.object,
};

CustomSkeleton.defaultProps = {
  className: '',
  allowClear: false,
  fullLine: false,
  helpInline: true,
  labelInValue: false,
  rules: [],
  hasFeedback: true,
  labelStrong: false,
  colon: true,
  hidden: false,
  size: 'small',
  layoutCol: { xs: 24 },
  itemStyle: {},
  labelLeft: true,
  fetching: false,
  showInputLabel: false,
  filterOption: (input, option) => option.children.toLowerCase().includes(input.toLowerCase()),
  itemClassName: '',
  form: null,
  autoSize: { minRows: 5, maxRows: 5 },
};

export default (CustomSkeleton);
