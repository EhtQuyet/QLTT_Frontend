import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function AddNewButton({ onClick, linkTo, label, disabled, loading }) {


  return <React.Fragment>
    <div className='clearfix mb-3'>
      {onClick && <Button
        disabled={disabled}
        loading={loading}
        type="primary" className='float-right' size='small' icon={<i className='fa fa-plus mr-1'/>} onClick={onClick}>
        {label}
      </Button>}

      {linkTo && <Link to={linkTo}>
        <Button size='small' type="primary" className='float-right' icon={<i className='fa fa-plus mr-1'/>}>
          {label}
        </Button>
      </Link>}
    </div>
  </React.Fragment>;

}

export default (AddNewButton);

AddNewButton.propTypes = {
  onClick: PropTypes.func,
  linkTo: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  label: PropTypes.string,
};

AddNewButton.defaultProps = {
  onClick: null,
  linkTo: null,
  disabled: false,
  loading: false,
  label: 'Thêm mới',
};
