import React from 'react';
import { Breadcrumb, Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { ConstantsRoutes } from '@app/router/ConstantsRoutes';
import { Link, withRouter } from 'react-router-dom';

import { URL } from '@url';

function CustomBreadcrumb(history) {
  let { pathname } = history.location;

  Object.entries(URL.MENU).forEach(([key, value]) => {
      if (key.includes('_ID') && key.indexOf('_ID') === key.length - 3) {
        const valueTemp = value.slice(0, value.length - 3);
        if (pathname.includes(valueTemp)) {
          pathname = value.format(':id');
        }
      }
    },
  );

  return (
    <Breadcrumb style={{ margin: '10px 16px 10px 16px' }}>
      <Breadcrumb.Item>
        <Link to={URL.MENU.DASHBOARD}>
          <HomeOutlined/>
        </Link>
      </Breadcrumb.Item>

      {ConstantsRoutes.map((menu, index) => {
        if (!menu.menuGroup) {
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
        }
      })}
    </Breadcrumb>
  );
}

export default withRouter(CustomBreadcrumb);
