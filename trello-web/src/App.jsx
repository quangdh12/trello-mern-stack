import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Board from '~/pages/Boards/_id';
import NotFound from './pages/404/NotFound';
import Auth from './pages/Auth/Auth';
import AccountVerification from './pages/Auth/AccountVerification';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './redux/user/userSlice';
import Boards from './pages/Boards';
import SettingsUser from '~/pages/SettingsUser/SettingsUser';

const ProtectedRoute = ({ user }) => {
    if (!user) return <Navigate to={'/login'} replace={true} />;

    return <Outlet />;
};

function App() {
    const currentUser = useSelector(selectCurrentUser);

    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to={'/boards'} replace={true} />}
            />

            <Route element={<ProtectedRoute user={currentUser} />}>
                <Route path="/boards" element={<Boards />} />
                <Route path="/boards/:boardId" element={<Board />} />

                {/* User settings */}
                <Route path="/settings/account" element={<SettingsUser />} />
                <Route path="/settings/security" element={<SettingsUser />} />
            </Route>

            <Route path="*" element={<NotFound />} />

            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/account/verification" element={<AccountVerification />} />
        </Routes>
    );
}

export default App;
