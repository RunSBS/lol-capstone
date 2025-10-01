// CommentSection.js

import React, { useEffect, useState } from "react";
import commentApi from "../api/commentApi";

function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = () => {
    commentApi.getCommentsByPostId(postId).then(setComments);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    await commentApi.createComment({
      postId,
      writer: currentUser, // 로그인한 사용자로 고정
      text,
    });

    setText("");
    fetchComments();
  };

  const handleDelete = async (id, writer) => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (writer !== currentUser) {
      alert("본인의 댓글만 삭제할 수 있습니다.");
      return;
    }
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await commentApi.deleteComment(id);
      fetchComments();
    }
  };

  return (
    <div
      style={{
        //maxHeight: 200,
        //overflowY: "auto",
        border: "1px solid #ccc",
        padding: 8,
        backgroundColor: "#fafafa",
      }}
    >
      <h4>댓글</h4>

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            marginBottom: 6,
            borderBottom: "1px solid #eee",
            paddingBottom: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <b>{c.writer}</b> | {new Date(c.createdAt).toLocaleString()}
            <br />
            {c.text}
          </div>
          {c.writer === currentUser && (
            <button
              style={{ marginLeft: 10, color: "red", cursor: "pointer" }}
              onClick={() => handleDelete(c.id, c.writer)}
            >
              삭제
            </button>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
        <textarea
          placeholder="댓글 입력"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          style={{ width: "100%", resize: "none" }}
        />
        <button type="submit" style={{ marginTop: 5 }}>
          등록
        </button>
      </form>
    </div>
  );
}

export default CommentSection;
