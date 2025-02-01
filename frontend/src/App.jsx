import react from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import UploadPage from "./components/Upload"
import MainContent from "./components/Main"
import Header from "./components/Header"
import HomePage from "./components/Mainpage"
import "./styles/Header.css"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}


function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />}></Route>
        {/* <Route path="/*" element={<MainContent />}></Route> */}
        <Route path="/upload/:uniqueLink" element={<UploadPage />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
