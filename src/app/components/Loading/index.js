import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { Loading3QuartersOutlined } from '@ant-design/icons';

import './Loading.scss';

export default function Loading({ active, ...props }) {
  const style = {};
  if (!props.children) {
    style.height = '400px';
  }

  return (
    <div className="loading-component" style={style}>
      {active && <div className='loading-backdrop'>
        <Spin className='loading-spin'
              size='large'
              indicator={<Loading3QuartersOutlined spin/>}
        />
      </div>}
      {props.children}
    </div>
  );
}

Loading.propTypes = {
  active: PropTypes.bool,
};

Loading.defaultProps = {
  active: true,
};
