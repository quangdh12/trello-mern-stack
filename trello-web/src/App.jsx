import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Board from '~/pages/Boards/_id';
import NotFound from './pages/404/NotFound';
import Auth from './pages/Auth/Auth';
import AccountVerification from './pages/Auth/AccountVerification';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './redux/user/userSlice';
import Settings from './pages/Settings/Settings';

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to={'/login'} replace={true} />

  return <Outlet />
}

function App() {

  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route path='/' element={
        <Navigate to={'/boards/67aa696306d04128739c7eff'} replace={true} />
      } />

      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path='/boards/:boardId' element={<Board />} />

        {/* User settings */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>


      <Route path='*' element={<NotFound />} />

      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

    </Routes>
  )
}

export default App
