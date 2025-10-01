
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BoardPage from "./pages/BoardPage";
import PostDetailPage from "./pages/PostDetailPage";
import WritePost from "./pages/WritePost";
import Login from "./Login";
import Register from "./Register";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";

function initializeAdminAccount() {
  const usersJson = localStorage.getItem("users");
  const users = usersJson ? JSON.parse(usersJson) : [];
  const adminExists = users.some((u) => u.username === "admin1");
  if (!adminExists) {
    users.push({ username: "admin1", password: "1234" });
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    localStorage.getItem("currentUser")
  );
  const [showRegister, setShowRegister] = useState(false);
  const adminId = "admin1";

  useEffect(() => {
    initializeAdminAccount();
    const stored = localStorage.getItem("currentUser");
    if (stored) setCurrentUser(stored);
  }, []);

  const handleLogin = (username) => setCurrentUser(username);
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };
  const toggleRegister = () => setShowRegister((prev) => !prev);

  const handleForceLogout = (username) => {
    if (username === currentUser) {
      alert("본인이 강제 탈퇴 당했습니다. 로그아웃 처리 됩니다.");
      handleLogout();
    }
  };

  return (
    <BrowserRouter>
      <nav
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Link to="/">
            <button>홈</button>
          </Link>
          <Link to="/free">
            <button>자유게시판</button>
          </Link>
          <Link to="/guide">
            <button>공략</button>
          </Link>
          <Link to="/lolmuncheol">
            <button>롤문철</button>
          </Link>
          {currentUser ? (
            <Link to="/write">
              <button>글쓰기</button>
            </Link>
          ) : (
            <button disabled title="로그인 후 이용 가능">
              글쓰기
            </button>
          )}
        </div>

        <div>
          {currentUser ? (
            <>
              <span>{currentUser}님 환영합니다.</span>
              <button onClick={handleLogout} style={{ marginLeft: 10 }}>
                로그아웃
              </button>
              {currentUser === adminId && (
                <Link to="/admin">
                  <button
                    style={{
                      marginLeft: 20,
                      backgroundColor: "#444",
                      color: "white",
                    }}
                  >
                    관리자기능
                  </button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login">
                <button>로그인</button>
              </Link>
              <Link to="/register">
                <button>회원가입</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <hr style={{ marginBottom: 20 }} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/free" element={<BoardPage category="free" />} />
        <Route path="/guide" element={<BoardPage category="guide" />} />
        <Route path="/lolmuncheol" element={<BoardPage category="lolmuncheol" />} />
        <Route
          path="/post/:id"
          element={<PostDetailPage currentUser={currentUser} adminId={adminId} />}
        />
        <Route path="/write" element={<WritePost currentUser={currentUser} />} />
        <Route
          path="/login"
          element={
            showRegister ? (
              <Register onRegister={toggleRegister} />
            ) : (
              <Login onLogin={handleLogin} onShowRegister={toggleRegister} />
            )
          }
        />
        <Route path="/register" element={<Register onRegister={() => setShowRegister(false)} />} />
        <Route path="/admin" element={<AdminPage adminId={adminId} onForceLogout={handleForceLogout} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;