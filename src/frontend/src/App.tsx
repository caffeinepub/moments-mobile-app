import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import MobileSplashScreen from './pages/MobileSplashScreen';
import WelcomePage from './pages/WelcomePage';
import HomeScreen from './pages/HomeScreen';
import CameraScreen from './pages/CameraScreen';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import MomentsPage from './pages/MomentsPage';

// Root component without forced redirects
function RootComponent() {
    return <Outlet />;
}

const rootRoute = createRootRoute({
    component: RootComponent
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: MobileSplashScreen
});

const welcomeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/welcome',
    component: WelcomePage
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/home',
    component: HomeScreen
});

const cameraRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/camera',
    component: CameraScreen
});

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: SettingsPage
});

const calendarRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/calendar',
    component: CalendarPage
});

const momentsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/moments',
    component: MomentsPage
});

const routeTree = rootRoute.addChildren([indexRoute, welcomeRoute, homeRoute, cameraRoute, settingsRoute, calendarRoute, momentsRoute]);

const router = createRouter({ routeTree });

function App() {
    return <RouterProvider router={router} />;
}

export default App;
