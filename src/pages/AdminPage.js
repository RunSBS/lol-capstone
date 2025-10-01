import React, { useEffect, useState } from "react";

function AdminPage({ adminId, onForceLogout }) {
  const [users, setUsers] = useState([]);

  // 로컬스토리지 사용자 불러오기
  const loadUsers = () => {
    const json = localStorage.getItem("users");
    return json ? JSON.parse(json) : [];
  };

  // 사용자 리스트 불러오기
  useEffect(() => {
    setUsers(loadUsers());
  }, []);

  // 강제 탈퇴 (탈퇴 대상 id)
  const handleForceDelete = (username) => {
    if (window.confirm(`${username} 를 강제 탈퇴시키겠습니까?`)) {
      let currentUsers = loadUsers();
      currentUsers = currentUsers.filter(u => u.username !== username);
      localStorage.setItem("users", JSON.stringify(currentUsers));

      // 강제 탈퇴시 해당 사용자가 쓴 글, 댓글 모두 삭제 처리(관리자 권한)
      // 모든 게시판 글 삭제 (작성자 username과 매칭)
      const categories = ["free", "guide", "lolmuncheol"];
      categories.forEach(cat => {
        const key = `dummyPosts_${cat}`;
        const postsJson = localStorage.getItem(key);
        if (postsJson) {
          let posts = JSON.parse(postsJson);
          posts = posts.filter(p => p.writer !== username);
          localStorage.setItem(key, JSON.stringify(posts));
        }
      });

      // 댓글 삭제를 위한 commentApi 내부 로컬스토리지 키 이름과 구조 필요
      // 여기서는 댓글 데이터가 dummyComments 라고 가정
      let commentsJson = localStorage.getItem("dummyComments");
      if (commentsJson) {
        let comments = JSON.parse(commentsJson);
        comments = comments.filter(c => c.writer !== username);
        localStorage.setItem("dummyComments", JSON.stringify(comments));
      }

      // 강제 탈퇴 후 사용자 리스트 갱신
      setUsers(loadUsers());
      onForceLogout(username);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>관리자 기능 (관리자 ID: {adminId})</h2>
      <hr />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {/* 관리자 아이디 맨 위에 선 구분해서 표시 */}
        <li style={{ padding: "8px 0", fontWeight: "bold", borderBottom: "1px solid black" }}>
          관리자: {adminId}
        </li>
        {users.filter(u => u.username !== adminId).map((user) => (
          <li key={user.username} style={{ padding: "6px 0", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc" }}>
            <div>
              아이디: {user.username} | 비밀번호: {user.password}
            </div>
            <button onClick={() => handleForceDelete(user.username)} style={{ color: "red" }}>
              탈퇴
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
