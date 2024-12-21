import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Components/Home/Home";
import Register from "./Pages/Register/Register";
import Community from "./Components/Community/Community";
import PrivateChat from "./Components/PrivateChat/PrivateChat";
import { AuthProvider } from "./Pages/AuthProvider/AuthProvider";
import PublicRoutes from "./Pages/ProtectedRutes/PublicRoutes";
import ProtectedRutes from "./Pages/ProtectedRutes/ProtectedRutes";
import Blogs from "./Components/Blogs/Blogs";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* private routes */}
            <Route element={<ProtectedRutes />}>
              <Route path="*" element={<Home />} />
              <Route path="/community" element={<Community />} />
              <Route path="/private-chat" element={<PrivateChat />} />
              <Route path="/blogs" element={<Blogs />} />
            </Route>
            {/* public routes */}

            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
