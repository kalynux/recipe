import React, { Suspense, lazy } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useParams,
    useLocation,
    Navigate,
    useNavigate,
} from 'react-router-dom';
import AppVersionToDisplay from './screen/checkScreen';
import FavoritePage from './pages/favorite/favorite.page';
import RecipePage from './pages/recipe/recipe.page';
import ProfilePage from './pages/profile/profile.page';
import ConnectPage from './pages/connect/connect.page';
import DetailsPage from './pages/details/details.page';
import AddNewPage from './pages/new/new.page';
import { getUserInfo } from './db/supa';

const Mobile = lazy(() => import('./screen/mobile/mobile'));
const Desktop = lazy(() => import('./screen/desktop/desktop'));

const AppRouter = () => {
    const renderComponent = (deviceType) => {
        switch (deviceType) {
            case 'mobile':
                return <Mobile />;
            case 'desktop':
                return <Desktop />;
            default:
                return <Desktop />;
        }
    };

    return (
        <>
            <Suspense fallback={<div className="suspend_loader">Loading...</div>}>
                <Router>
                    <Routes>
                        <Route
                            path="/"
                            element={<AppVersionToDisplay renderComponent={renderComponent} />}
                        >
                            <Route index element={<RecipePage />} />
                            <Route path="/recipe" element={<RecipePage />} />
                            <Route path="/details/:id" element={<DetailsPage />} />
                            <Route path="/login" element={<ConnectPage />} />

                            <Route path="/favorite" element={<FavoritePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/new" element={<AddNewPage />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </Suspense>
        </>
    );
};

const NotFound = () => {
    return <Navigate to="/" replace />;
};

export default AppRouter;
