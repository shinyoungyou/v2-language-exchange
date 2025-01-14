import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import ConnectDashboard from '@/components/app/connect/ConnectDashboard';
import TestErrors from '@/components/errors/TestError';
import NotFound from '@/components/errors/NotFound';
import ServerError from '@/components/errors/ServerError';

import App from '@/components/layout/App';
import RequireAuth from './RequireAuth';
import Main from '@/components/layout/Main';
import EditPage from '@/components/app/account/EditPage';
import ProfilePage from '@/components/app/profile/ProfilePage';
import MessageDashboard from '@/components/app/messages/MessageDashboard';
import LocationDashboard from '@/components/app/location/LocationDashboard';
import AboutPage from '@/components/home/AboutPage';
import ConnectMessage from '@/components/app/connect/ConnectMessage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {element: <RequireAuth />, children: [
                {
                    path: '/',
                    element: <Main />,
                    children: [
                        {path: 'messages', element: <MessageDashboard key='all'/>},
                        {path: 'messages/unread', element: <MessageDashboard key='unread' />},
                        {path: 'connect', element: <ConnectDashboard />},
                        {path: 'location', element: <LocationDashboard />},
                        {path: 'about', element: <AboutPage />},
                        {path: 'errors', element: <TestErrors />}
                    ]
                },
               
                {path: 'members/:username', element: <ProfilePage />},
                {path: 'members/:username/messages', element: <ConnectMessage />},
                {path: 'edit/:username', element: <EditPage />},
            ]},
            {path: 'not-found', element: <NotFound />},
            {path: 'server-error', element: <ServerError />},
            {path: '*', element: <Navigate replace to='/not-found' />},
        ]
    }
]

export const router = createBrowserRouter(routes);