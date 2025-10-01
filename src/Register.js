import React, { useState } from "react";

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function loadUsers() {
    const json = localStorage.getItem("users");
    return json ? JSON.parse(json) : [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    const users = loadUsers();
    if (users.find(u => u.username === username.trim())) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }

    const newUser = {
      username: username.trim(),
      password: password.trim(),
    };
    users.push(newUser);
    saveUsers(users);

    alert("회원가입 성공!");
    onRegister();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>회원가입</h3>
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
      <button type="submit">가입하기</button>
    </form>
  );
}

export default Register;
