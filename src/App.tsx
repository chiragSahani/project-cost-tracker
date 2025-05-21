import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import { supabase } from './lib/supabaseClient';
import { setUser } from './store/authSlice';
import { RootState, AppDispatch } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Items from './pages/Items';
import OtherCosts from './pages/OtherCosts';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check for existing session on load
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        dispatch(
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
          })
        );
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          dispatch(
            setUser({
              id: session.user.id,
              email: session.user.email || '',
            })
          );
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          dispatch(setUser(null));
          navigate('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch, navigate]);

  return (
    <Box minH="100vh">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" replace />} />
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="items" element={<Items />} />
          <Route path="other-costs" element={<OtherCosts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;