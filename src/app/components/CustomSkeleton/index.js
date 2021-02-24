import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, DatePicker, Empty, Form, Input, Select, Skeleton, Spin, Switch, Checkbox } from 'antd';
import { CONSTANTS, RULES } from '@constants';

import './CustomSkeleton.scss';

class CustomSkeleton extends Component {

  renderDatePicker() {
    return <DatePicker style={{ width: '100%' }}
                       format="DD-MM-YYYY"
                       placeholder={this.props.placeholder || this.props.label}
                       size={this.props.size}
                       disabled={this.props.disabled}/>;
  }

  renderInput() {
    return <Input placeholder={this.props.placeholder || this.props.label}
                  prefix={this.props.prefix}
                  suffix={this.props.suffix}
                  size={this.props.size}
                  disabled={this.props.disabled}/>;
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

  renderOption() {
    const { label, options, placeholder, filterOption, fetching } = this.props;
    return <Select placeholder={placeholder || `Chọn ${label}`}
                   size={this.props.size}
                   disabled={this.props.disabled} dropdownClassName='small'
                   showSearch={this.props.showSearch}
                   onSearch={this.props.onSearch}
                   mode={this.props.mode}
                   suffixIcon={this.props.suffix}
                   notFoundContent={fetching
                     ? <Spin size="small"/>
                     : <Empty className='m-0' image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                   filterOption={filterOption}>
      {options.data.map(item => {
        return <Select.Option
          key={item.value || item[options.valueString]}
          value={item.value || item[options.valueString]}>
          {item.label || item[options.labelString]}
        </Select.Option>;
      })}
    </Select>;
  }

  renderArea() {
    const { autoSize } = this.props;

    return <Input.TextArea
      size={this.props.size}
      placeholder={this.props.placeholder || this.props.label}
      disabled={this.props.disabled}
      autoSize={autoSize || { minRows: 5, maxRows: 5 }}/>;
  }

  renderLabel() {
    return <Input className='input-label'
                  prefix={this.props.prefix}
                  suffix={this.props.suffix}
                  size={this.props.size}
                  disabled/>;
  }

  render() {
    const { type, isShowSkeleton, rules, layoutCol, labelStrong, validateTrigger } = this.props;

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
      case CONSTANTS.SELECT:
        inputHtml = this.renderOption();
        break;
      case CONSTANTS.TEXT_AREA:
        inputHtml = this.renderArea();
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
      default:
        break;
    }

    if (isShowSkeleton) {
      return <Col {...layoutCol}
                  className={(this.props.helpInline ? 'help-inline ' : 'help-not-inline ') + this.props.className}>
        <Form.Item
          label={label}
          {...this.props.layoutItem}
          name={this.props.name}
          hasFeedback={rules.includes(RULES.REQUIRED) && this.props.hasFeedback}
          className={this.props.itemClassName || ''}
          style={this.props.itemStyle || {}}
          colon={this.props.colon}
          rules={this.props.rules}
          size={this.props.size}
          dependencies={this.props.dependencies}
          labelAlign={this.props.labelLeft ? 'left' : 'right'}
          validateTrigger={validateTrigger || (Array.isArray(rules) && rules.length ? ['onChange', 'onBlur'] : false)}>
          <Skeleton.Input active size='small' className='w-100'/>
        </Form.Item>
      </Col>;
    }

    return <Col {...layoutCol}
                className={(this.props.helpInline ? 'help-inline ' : 'help-not-inline ') + this.props.className}>
      <Form.Item
        label={label}
        {...this.props.layoutItem}
        name={this.props.name}
        hasFeedback={rules.includes(RULES.REQUIRED) && this.props.hasFeedback && !this.props.disabled}
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
    </Col>;

  }
}

CustomSkeleton.propTypes = {
  helpInline: PropTypes.bool,
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
  filterOption: PropTypes.any,
  itemClassName: PropTypes.string,
};

CustomSkeleton.defaultProps = {
  helpInline: true,
  rules: [],
  hasFeedback: true,
  labelStrong: false,
  colon: true,
  hidden: false,
  size: 'small',
  layoutCol: { xs: 24 },
  itemStyle: {},
  labelLeft: false,
  fetching: false,
  filterOption: (input, option) => option.children.toLowerCase().includes(input.toLowerCase()),
  itemClassName: '',
};

export default (CustomSkeleton);
