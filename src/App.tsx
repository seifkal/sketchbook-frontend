import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Auth from "./pages/Auth/Auth";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import './App.css'
import AppLayout from "./layouts/AppLayout";
import PixelDrawer from "./components/PixelDrawer";
import Feed from "./pages/Feed";

function App() {
  return (
    <BrowserRouter>
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
              <Route index element={<Feed></Feed>} />
              <Route path="create" element={<PixelDrawer />} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
