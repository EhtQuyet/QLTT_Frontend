import React from 'react';
import { Breadcrumb, Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { ConstantsRoutes } from '@app/router/ConstantsRoutes';
import { Link, withRouter } from 'react-router-dom';

import { URL } from '@url'

function CustomBreadcrumb(history) {
  let { pathname } = history.location;

  if (pathname.includes(`${URL.MENU.TRANSFER_REQUEST}/`) && !pathname.includes(URL.MENU.TRANSFER_REQUEST_CREATE)) {
    pathname = URL.MENU.TRANSFER_REQUEST_ID.format(':id');
  }

  return (
    <Breadcrumb style={{ margin: '10px 16px 10px 16px' }}>
      <Breadcrumb.Item>
        <Link to={URL.MENU.DASHBOARD}>
          <HomeOutlined/>
        </Link>
      </Breadcrumb.Item>

      {ConstantsRoutes.map((menu, index) => {
        if (!menu.children && menu.path === pathname) {
          return <Breadcrumb.Item key={index}>{menu.breadcrumbName || menu.menuName}</Breadcrumb.Item>;
        }
        if (Array.isArray(menu.children)) {
          return menu.children.map((child, childIndex) => {
            if (child.path === pathname)
              return <Breadcrumb.Item key={childIndex}>
                {child.menuName}
              </Breadcrumb.Item>;
          });
        }
      })}
    </Breadcrumb>
  );
}

export default withRouter(CustomBreadcrumb);
