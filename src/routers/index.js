import { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AuthLayout from '../components/auth-layout';
import PortalLayout from '../components/portal-layout';
import { AuthContext } from '../context/AuthContext';
import Category from '../pages/category';
import Dashboard from '../pages/dashboard';
import ForgotPassword from '../pages/forgot-password';
import Inventories from '../pages/Inventories';
import Login from '../pages/login';
import Messages from '../pages/messages';
import NewPassword from '../pages/new-password';
import ProductItem from '../pages/product-item';
import Profile from '../pages/profile';
import Settings from '../pages/settings';
import SystemAdmins from '../pages/system-admins';
import User from '../pages/user';
import Users from '../pages/users';
import RoutesLayout from './RoutesLayout';
import SystemAdmin from '../pages/system-admin';
import Stores from '../pages/stores';
import Store from '../pages/store';
import SellerApplications from '../pages/pending-applications';
import ManageUsers from '../pages/manage-users';
import ManageSellers from '../pages/manage-sellers';

const EnhancedSwitch = (props) => {
  const { children } = props

  return (
    <Switch>
      {children}
      <Route><Redirect to="/" /></Route>
    </Switch>
  )
}

const Routes = () => {
  const { state } = useContext(AuthContext);
  const { token, user } = state;

  return (
    <Switch>
      {
        token && user.role.name === 'PADMIN' ?
          <EnhancedSwitch>
            <Route path="/" exact><Redirect to="/BayAni/dashboard" /></Route>
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/dashboard" component={Dashboard} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/inventories" component={Inventories} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/messages" component={Messages} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/users" component={Users} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/users/create" component={User} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/users/update/:id" component={User} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/inventories/create-category" component={Category} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/inventories/update-category/:id" component={Category} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/inventories/create-product" component={ProductItem} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/inventories/update-product/:id" component={ProductItem} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/settings" component={Settings} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/profile" component={Profile} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/pending-applications" component={SellerApplications} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/manage-users" component={ManageUsers} />
            <RoutesLayout exact layout={PortalLayout} path="/BayAni/manage-sellers" component={ManageSellers} />
          </EnhancedSwitch>
        :
          token && user.role.name === 'PCASHIER' ?
            <EnhancedSwitch>
              <RoutesLayout exact layout={PortalLayout} path="/BayAni/profile" component={Profile} />
            </EnhancedSwitch>
          :
          token && user.role.name === 'ADMIN' ?
            <EnhancedSwitch>
              <Route path="/" exact><Redirect to="/BayAni/stores" /></Route>
              <RoutesLayout exact layout={PortalLayout} path="/BayAni/stores" component={Stores} />
              <RoutesLayout exact layout={PortalLayout} path="/BayAni/stores/create" component={Store} />
              <RoutesLayout exact layout={PortalLayout} path="/BayAni/stores/update/:id" component={Store} />
              <RoutesLayout exact layout={PortalLayout} path="/BayAni/system-admins" component={SystemAdmins} />
              <RoutesLayout exact layout={PortalLayout} path="/BayAni/system-admins/update/:id" component={SystemAdmin} />
              <RoutesLayout exact layout={PortalLayout} path="/BayAni/system-admins/create" component={SystemAdmin} />
              <RoutesLayout exact layout={PortalLayout} path="/BayAni/messages" component={Messages} />
            </EnhancedSwitch>
          :
            <EnhancedSwitch>
              <RoutesLayout exact layout={AuthLayout} path="/" component={Login} />
              <RoutesLayout exact layout={AuthLayout} path="/forgot-password" component={ForgotPassword} />
              <RoutesLayout exact layout={AuthLayout} path="/new-password/:code" component={NewPassword} />
            </EnhancedSwitch>
      }
    </Switch>
  )
}

export default Routes;