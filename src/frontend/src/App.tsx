import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import MobileSplashScreen from './pages/MobileSplashScreen';
import WelcomePage from './pages/WelcomePage';
import HomeScreen from './pages/HomeScreen';
import CameraScreen from './pages/CameraScreen';
import SaveMomentConfirmPage from './pages/SaveMomentConfirmPage';
import MomentFeelingCheckPage from './pages/MomentFeelingCheckPage';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import VaultPage from './pages/VaultPage';
import VaultMomentPage from './pages/VaultMomentPage';
import ProfilePage from './pages/ProfilePage';
import {
  logBuildInfo,
  needsCacheRefresh,
  performCacheRefresh,
  storeCurrentBuildVersion,
  verifyBuildVersion
} from './utils/buildInfo';

// Root component with build version guard
function RootComponent() {
    const hasCheckedBuild = useRef(false);

    useEffect(() => {
        // Only run once on mount
        if (hasCheckedBuild.current) return;
        hasCheckedBuild.current = true;

        // Log build info for diagnostics
        logBuildInfo();

        // Verify we're running the correct build
        if (!verifyBuildVersion()) {
            console.warn('Build version mismatch detected in DOM!');
        }

        // Check if we need to refresh due to version change
        if (needsCacheRefresh()) {
            console.log('Stale build detected, performing cache refresh...');
            performCacheRefresh();
            return;
        }

        // Store current version for future checks
        storeCurrentBuildVersion();
    }, []);

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

const saveMomentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/save-moment',
    component: SaveMomentConfirmPage
});

const feelingCheckRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/feeling-check',
    component: MomentFeelingCheckPage
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

const vaultRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/vault',
    component: VaultPage
});

const vaultMomentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/vault/$momentId',
    component: VaultMomentPage
});

const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/profile',
    component: ProfilePage
});

const routeTree = rootRoute.addChildren([
    indexRoute, 
    welcomeRoute, 
    homeRoute, 
    cameraRoute, 
    saveMomentRoute,
    feelingCheckRoute,
    settingsRoute, 
    calendarRoute, 
    vaultRoute,
    vaultMomentRoute,
    profileRoute
]);

const router = createRouter({ routeTree });

function App() {
    return <RouterProvider router={router} />;
}

export default App;
