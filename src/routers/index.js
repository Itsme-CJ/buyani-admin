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
            <Route path="/" exact><Redirect to="/BuyAni/dashboard" /></Route>
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/dashboard" component={Dashboard} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/inventories" component={Inventories} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/messages" component={Messages} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/users" component={Users} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/users/create" component={User} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/users/update/:id" component={User} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/inventories/create-category" component={Category} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/inventories/update-category/:id" component={Category} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/inventories/create-product" component={ProductItem} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/inventories/update-product/:id" component={ProductItem} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/settings" component={Settings} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/profile" component={Profile} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/pending-applications" component={SellerApplications} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/manage-users" component={ManageUsers} />
            <RoutesLayout exact layout={PortalLayout} path="/BuyAni/manage-sellers" component={ManageSellers} />
          </EnhancedSwitch>
        :
          token && user.role.name === 'PCASHIER' ?
            <EnhancedSwitch>
              <RoutesLayout exact layout={PortalLayout} path="/BuyAni/profile" component={Profile} />
            </EnhancedSwitch>
          :
          token && user.role.name === 'ADMIN' ?
            <EnhancedSwitch>
              <Route path="/" exact><Redirect to="/BuyAni/stores" /></Route>
              <RoutesLayout exact layout={PortalLayout} path="/BuyAni/stores" component={Stores} />
              <RoutesLayout exact layout={PortalLayout} path="/BuyAni/stores/create" component={Store} />
              <RoutesLayout exact layout={PortalLayout} path="/BuyAni/stores/update/:id" component={Store} />
              <RoutesLayout exact layout={PortalLayout} path="/BuyAni/system-admins" component={SystemAdmins} />
              <RoutesLayout exact layout={PortalLayout} path="/BuyAni/system-admins/update/:id" component={SystemAdmin} />
              <RoutesLayout exact layout={PortalLayout} path="/BuyAni/system-admins/create" component={SystemAdmin} />
              <RoutesLayout exact layout={PortalLayout} path="/BuyAni/messages" component={Messages} />
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