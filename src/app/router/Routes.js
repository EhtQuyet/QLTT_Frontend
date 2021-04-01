import React, { Suspense } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import { URL } from '@url';
import '@src/app/common/prototype';
import { ConstantsRoutes } from './ConstantsRoutes';
import Loading from '@components/Loading';

const Routes = (props) => {
  return (
    <Suspense fallback={<Loading/>}>
      <Switch>
        {ConstantsRoutes.map(({ isRedirect, exact, from, to, path, component, children, menuGroup }, index) => {
          if (!menuGroup) {
            if (to) {
              to = to.charAt(0) !== '/' ? `/${to}` : to;
            }
            if (path) {
              path = path.charAt(0) !== '/' ? `/${path}` : path;
            }
            if (isRedirect) {
              return <Redirect exact={exact} from={from} to={to} key={index}/>;
            } else {
              if (!children) {
                return <Route exact={exact} path={path} component={component} key={index}/>;
              } else {
                return children.map((child, childIndex) => {
                  return <Route exact={child.exact} path={child.path} component={child.component} key={childIndex}/>;
                });
              }
            }
          }
        })}

        <Redirect to={URL.MENU.DASHBOARD}/>
      </Switch>
    </Suspense>
  );
};


export default withRouter(Routes);
