import React, { useEffect, useState } from "react";
import boardApi from "../api/boardApi";
import { Link } from "react-router-dom";

function AllBoardPosts() {
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchBy, setSearchBy] = useState("all"); // all, writer, title, comment
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadAllPosts();
  }, []);

  const loadAllPosts = () => {
    boardApi.getPosts(0, 1000, "all").then((data) => {
      const sorted = [...data.content].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sorted);
      setSearching(false);
      setSearchKeyword("");
      setSearchBy("all");
    });
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      loadAllPosts();
      return;
    }

    if (searchBy === "all") {
      boardApi.searchPosts(searchKeyword).then((res) => {
        setPosts(res);
        setSearching(true);
      });
    } else {
      loadAllPosts();
      setTimeout(() => {
        let filtered = [];
        switch (searchBy) {
          case "writer":
            filtered = posts.filter((p) => p.writer.includes(searchKeyword));
            break;
          case "title":
            filtered = posts.filter((p) => p.title.includes(searchKeyword));
            break;
          case "comment":
            const commentsJson =
              localStorage.getItem("dummyComments") || "[]";
            const comments = JSON.parse(commentsJson);
            filtered = posts.filter((p) =>
              comments.some(
                (c) => c.postId === p.id && c.text.includes(searchKeyword)
              )
            );
            break;
          default:
            filtered = posts;
        }
        setPosts(filtered);
        setSearching(true);
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>전체 게시판 글 목록</h3>

      {posts.length === 0 && <p>게시글이 없습니다.</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            borderBottom: "1px solid #ddd",
            marginBottom: 10,
            paddingBottom: 5,
          }}
        >
          <Link to={`/post/${post.id}`}>
            <h4>{post.title}</h4>
          </Link>
          <div>
            {post.writer} | {new Date(post.createdAt).toLocaleString()} | [
            {post.category}]
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
        </div>
      ))}

      {/* 검색창 글 목록 밑에 위치 */}
      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="검색어 입력 후 Enter"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ width: 300, marginRight: 10 }}
        />

        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          style={{ marginRight: 10 }}
        >
          <option value="all">전체 (작성자, 제목, 댓글)</option>
          <option value="writer">작성자</option>
          <option value="title">제목</option>
          <option value="comment">댓글</option>
        </select>

        <button onClick={handleSearch}>검색</button>

        {searching && (
          <button onClick={loadAllPosts} style={{ marginLeft: 10 }}>
            검색 초기화
          </button>
        )}
      </div>
    </div>
  );
}

export default AllBoardPosts;
