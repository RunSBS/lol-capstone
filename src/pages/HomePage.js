import React, { useEffect, useState } from "react";
import boardApi from "../api/boardApi";
import { Link } from "react-router-dom";

function HomePage() {
  const [allPosts, setAllPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadAllPosts();
  }, []);

  function loadAllPosts() {
    const categories = ["free", "guide", "lolmuncheol"];
    let combinedPosts = [];

    Promise.all(
      categories.map((cat) => boardApi.getPosts(0, 1000, cat))
    ).then((results) => {
      results.forEach((res) => {
        combinedPosts = combinedPosts.concat(res.content);
      });
      combinedPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAllPosts(combinedPosts);
      setSearching(false);
      setSearchKeyword("");
      setSearchBy("all");
    });
  }

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      loadAllPosts();
      return;
    }

    if (searchBy === "all") {
      boardApi.searchPosts(searchKeyword).then((res) => {
        setAllPosts(res);
        setSearching(true);
      });
    } else {
      loadAllPosts(); // 먼저 전체 로딩 후 조건별 필터링 하자
      setTimeout(() => {
        let filtered = [];
        switch (searchBy) {
          case "writer":
            filtered = allPosts.filter((p) => p.writer.includes(searchKeyword));
            break;
          case "title":
            filtered = allPosts.filter((p) => p.title.includes(searchKeyword));
            break;
          case "comment":
            const commentsJson = localStorage.getItem("dummyComments") || "[]";
            const comments = JSON.parse(commentsJson);
            filtered = allPosts.filter((p) =>
              comments.some(
                (c) => c.postId === p.id && c.text.includes(searchKeyword)
              )
            );
            break;
          default:
            filtered = allPosts;
        }
        setAllPosts(filtered);
        setSearching(true);
      }, 200); // 약간 지연시켜 전체 로딩 후 필터링
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>홈 (최신순 전체 게시판)</h2>

      {allPosts.length === 0 && <p>게시글이 없습니다.</p>}

      {allPosts.map((post) => (
        <div
          key={post.id}
          style={{ borderBottom: "1px solid gray", marginBottom: 10 }}
        >
          <Link to={`/post/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
          <div>
            {post.writer} | {new Date(post.createdAt).toLocaleString()} | [
            {post.category}]
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
        </div>
      ))}

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
          <button
            onClick={() => {
              loadAllPosts();
            }}
            style={{ marginLeft: 10 }}
          >
            검색 초기화
          </button>
        )}
      </div>
    </div>
  );
}

export default HomePage;
