import React, { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = e => {
    e.preventDefault();
    alert(`로그인 시도: ${username}`);
    // JWT 로그인 API 구현 필요
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>로그인</h2>
      <input placeholder="아이디" value={username} onChange={e => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginPage;
