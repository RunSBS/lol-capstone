import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function loadUsers() {
    const json = localStorage.getItem("users");
    return json ? JSON.parse(json) : [];
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    const users = loadUsers();
    const user = users.find(u => u.username === username.trim() && u.password === password.trim());

    if (user) {
      localStorage.setItem("currentUser", username.trim());
      onLogin(username.trim());
      navigate("/"); // 로그인 성공 후 메인 페이지 이동
    } else {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>로그인</h3>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>
      <button onClick={onShowRegister} style={{ marginTop: 10 }}>
        회원가입
      </button>
    </>
  );
}

export default Login;
