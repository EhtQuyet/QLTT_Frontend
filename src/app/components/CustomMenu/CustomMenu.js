import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import logocntt from '../../../assets/images/logocntt.jpg'
import { ConstantsRoutes } from '@app/router/ConstantsRoutes';
import { connect } from 'react-redux';


import './CustomMenu.scss';
import * as app from '@app/store/ducks/app.duck';
import * as user from '@app/store/ducks/user.duck';

function CustomMenu({ history, myInfo, siderCollapsed, isBroken, ...props }) {
  const { pathname } = history.location;
  let defaultOpenKeys = [];

  function isEmpty(obj) {
    for(let key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  function getMenu()
  {
    let routeList = []
    if(isEmpty(myInfo.role) == false){
      ConstantsRoutes.forEach(rt => {
        if(rt.role.indexOf(myInfo.role)!== -1){
          if(rt.children && Array.isArray(rt.children)){
            let children = rt.children
            children = children.filter(data => {
              return data.role.indexOf(myInfo.role) !== -1
            })
            rt.children = children
          }
          routeList.push(rt)
        }
      })
    }
    return routeList
  }


  const menuItem = getMenu().map((menu) => {
    if (menu.menuGroup && !siderCollapsed) {
      return <Menu.ItemGroup key={menu.menuGroup} title={menu.menuGroup}
        // style={{height:'15px'}}
        // className='py-2'
      />;
    }
    if (menu.menuName && !menu.children) {
      return <Menu.Item key={menu.path} icon={menu.icon}>
        <Link to={menu.path}>{menu.menuName}</Link>
      </Menu.Item>;
    }
    if (menu.menuName && Array.isArray(menu.children)) {
      return <Menu.SubMenu key={menu.path} title={menu.menuName} icon={menu.icon}>
        {menu.children.map((child) => {
          if (pathname === child.path) {
            defaultOpenKeys = [menu.path];
          }
          return <Menu.Item key={child.path} icon={child.icon}>
            <Link to={child.path}>{child.menuName}</Link>
          </Menu.Item>;
        })}
      </Menu.SubMenu>;
    }
  });

  return <div style={{ height: '100%', overflow: 'hidden' }}>
    <div className={`sider-logo ${(siderCollapsed && !isBroken) ? 'collapsed' : ''}`}>
      <div className='img'>
        <img src={logocntt} alt=''
             style={{ height: '100%' }}/>
      </div>
      <div className='text'>QLSVTT</div>
    </div>
    <div style={{ height: 'calc(100% - 50px)' }} className='custom-scrollbar aside-menu'>
      <Menu
        mode="inline"
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={[pathname]}
        expandIcon={({ isOpen }) => {
          if (!siderCollapsed)
            return <div className='expand-icon'>
              <i className={`fa fa-chevron-right ${isOpen ? 'fa-rotate-90' : ''}`} aria-hidden="true"/>
            </div>;
          return null;
        }}
      >
        {menuItem}
      </Menu>
    </div>
  </div>;

}

function mapStateToProps(store) {
  const { siderCollapsed, isBroken } = store.app;
  const { myInfo } = store.user;

  return { siderCollapsed, isBroken, myInfo };
}

export default connect(mapStateToProps,{...user.actions })(withRouter(CustomMenu));
