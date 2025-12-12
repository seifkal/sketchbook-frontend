import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Auth from "./pages/Auth/Auth";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import AppLayout from "./layouts/AppLayout";
import PixelDrawer from "./pages/Create/PixelDrawer";
import { ToastContainer } from "react-toastify";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Users/Profile";
import HomeFeed from "./pages/Feed/HomeFeed";
import LikesFeed from "./pages/Feed/LikesFeed";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import ScrollToTop from "./components/ScrollToTop";

function App() {

  const userContext = useContext(UserContext);

  const userClaims = userContext?.user;

  const id = userClaims?.userId.toString();

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/auth"
            element={<Auth />}
          >
            <Route index element={<Navigate to="/auth/login" replace />} />
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
          </Route>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
            children={
              <>
                <Route index element={<HomeFeed />} />
                <Route path="create" element={<PixelDrawer />} />
                <Route path="settings" element={<Settings />} />
                <Route path="users/:id" element={<Profile />} />
                <Route path="likes" element={<LikesFeed id={id} />} />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </>
  )
}

export default App
