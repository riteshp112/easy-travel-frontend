import React from 'react';
import {useAuth} from '../modules/user-management/hooks/useAuth';
import {LoadingScreen} from '../screens/LoadingScreen';
import {
  Navigate,
  useRoutes,
  useLocation,
  useRouteError,
  Outlet,
} from 'react-router-dom';

import {useNavigate} from 'react-router-dom';
import AuthRoutes from '../modules/user-management/Auth.Routes';
import ItineraryRoutes from '../screens/Routes';
import ResponsiveAppBar from './NavBar';
import FirstPage from '../modules/firstpage/firstpage';
import MainPage from '../screens/MainPage';
import PlanTripForm from '../components/Form/PlanTripForm';

const RouteHandler = ({children, isPublic}) => {
  let {isAuthenticated} = useAuth();
  if (!isAuthenticated && !isPublic) {
    return <Navigate to="/welcome" />;
  }

  if (isAuthenticated && isPublic) {
    return <Navigate to="/home" />;
  }
  return children;
};

const ErrorBoundary = props => {
  const error = useRouteError();
  return <div>{error.message}</div>;
};

const StackScreens = props => {
  const {screens, navigation, isPublic} = props || {};
  if (!screens?.length) {
    return [];
  }

  const location = useLocation();
  const propParams = location.state || {}; // This is where you access the passed props

  return screens.map(({name, path, component}) => {
    if (!path) {
      console.error('Path is must in the component', name);
      return;
    }

    const Component = component;

    return {
      name: name,
      path: path,
      element: (
        <RouteHandler isPublic={isPublic}>
          <Component navigation={navigation} params={propParams} />
        </RouteHandler>
      ),
      errorElement: <ErrorBoundary />,
    };
  });
};

export const AppNavigator = () => {
  const {loading} = useAuth();
  if (loading) {
    return <LoadingScreen />;
  }

  const navigate = useNavigate();

  const navigation = {
    navigate: (path, props = {}) => {
      navigate(path, {state: props});
    },
  };

  const screenRoutes = [
    ...StackScreens({
      screens: AuthRoutes.stack,
      navigation,
      isPublic: true,
    }),
    ...StackScreens({
      screens: [
        {
          name: 'Undiscover',
          path: '/home',
          component: FirstPage,
        },
        ...ItineraryRoutes.stack,
      ],
      navigation,
    }),
  ];

  return useRoutes([
    {
      path: '/',
      element: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100vh',
          }}
          className="background">
          <ResponsiveAppBar />
          <Outlet />
        </div>
      ),
      children: [
        ...screenRoutes,
        {path: '/', element: <Navigate to="/welcome" replace/>},
        {path: '*', element: <Navigate to="/welcome" replace/>},
      ],
    },
  ]);
};
