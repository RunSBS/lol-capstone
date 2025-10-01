import React, { useEffect, useState } from "react";
import boardApi from "../api/boardApi";
import { Link } from "react-router-dom";

function BoardPage({ category }) {
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchBy, setSearchBy] = useState("all"); // all, writer, title, comment
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    boardApi.getPosts(0, 100, category).then((data) => {
      setPosts(data.content);
      setSearching(false);
      setSearchKeyword("");
      setSearchBy("all");
    });
  }, [category]);

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      boardApi.getPosts(0, 100, category).then((data) => {
        setPosts(data.content);
        setSearching(false);
      });
      return;
    }

    if (searchBy === "all") {
      boardApi.searchPosts(searchKeyword, category).then((res) => {
        setPosts(res);
        setSearching(true);
      });
    } else {
      boardApi.getPosts(0, 100, category).then(({ content }) => {
        let filtered = [];
        switch (searchBy) {
          case "writer":
            filtered = content.filter((p) => p.writer.includes(searchKeyword));
            break;
          case "title":
            filtered = content.filter((p) => p.title.includes(searchKeyword));
            break;
          case "comment":
            const commentsJson = localStorage.getItem("dummyComments") || "[]";
            const comments = JSON.parse(commentsJson);
            filtered = content.filter((p) =>
              comments.some(
                (c) => c.postId === p.id && c.text.includes(searchKeyword)
              )
            );
            break;
          default:
            filtered = content;
        }
        setPosts(filtered);
        setSearching(true);
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>
        {category === "free"
          ? "자유게시판"
          : category === "guide"
          ? "공략"
          : "롤문철"}{" "}
        게시판
      </h2>

      {posts.length === 0 && <p>게시글이 없습니다.</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{ borderBottom: "1px solid gray", marginBottom: 10 }}
        >
          <Link to={`/post/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
          <div>
            {post.writer} | {new Date(post.createdAt).toLocaleString()}
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
              setSearchKeyword("");
              setSearchBy("all");
              boardApi.getPosts(0, 100, category).then((data) => {
                setPosts(data.content);
                setSearching(false);
              });
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

export default BoardPage;
