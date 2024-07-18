// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Spots from './components/Spots/Spots';
import SpotDetails from './components/SpotDetails/SpotDetails';
import CreateSpot from './components/CreateSpot/CreateSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdatedSpot from './components/UpdateSpot/UpdateSpot';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // {
      //   path: '/',
      //   element: <h1>Welcome!</h1>
      // },
      {
        path: '/',
        element: <div className='spots-div'><Spots /></div>
      },
      {
        path: 'spots/:spotId',
        element: <SpotDetails />,
      },
      {
				path: '/spots/new',
				element: <CreateSpot />,
			},
      {
				path: '/spots/current',
				element: <ManageSpots />,
			},
      {
				path: '/spots/:spotId/edit',
				element: <UpdatedSpot />,
			},
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;