import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import boardApi from "../api/boardApi";
import CommentSection from "../components/CommentSection";
import AllBoardPosts from "./AllBoardPosts";

function PostDetailPage({ currentUser, adminId }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    boardApi.getPost(id).then((data) => {
      setPost(data);
      setEditTitle(data.title);
      setEditContent(data.content);
    });
  }, [id]);

  const handleDelete = () => {
    if (!post) return;
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (post.writer !== currentUser && currentUser !== adminId) {
      alert("삭제는 작성자 또는 관리자만 가능합니다.");
      return;
    }
    if (window.confirm("정말 삭제하시겠습니까?")) {
      boardApi
        .deletePost(post.id, currentUser)
        .then(() => {
          alert("삭제되었습니다.");
          navigate(`/${post.category}`);
        })
        .catch((err) => alert(err));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    await boardApi.updatePost(post.id, {
      ...post,
      title: editTitle,
      content: editContent,
    });
    setPost({ ...post, title: editTitle, content: editContent });
    setIsEditing(false);
    alert("수정되었습니다.");
  };

  const handleCancel = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(false);
  };

  if (!post) return <div>로딩중...</div>;

  const canEdit = post.writer === currentUser;

  return (
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ width: "100%", height: 150 }}
          />
          <div>
            <button onClick={handleSave}>저장</button>
            <button onClick={handleCancel} style={{ marginLeft: 10 }}>
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <div>
            <b>{post.writer}</b> | {new Date(post.createdAt).toLocaleString()}
          </div>
          {(canEdit || currentUser === adminId) && (
            <button
              onClick={handleDelete}
              style={{ margin: "10px 10px 10px 0", backgroundColor: "red", color: "white" }}
            >
              삭제
            </button>
          )}
          {canEdit && (
            <button onClick={handleEdit} style={{ marginBottom: 10 }}>
              수정
            </button>
          )}
          <hr />
          {/* HTML 문자열을 안전하게 렌더링: dangerouslySetInnerHTML 사용 */}
          <div
            style={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* 댓글창은 수정/삭제 후 바로 아래 위치 */}
          {!isEditing && <CommentSection postId={post.id} currentUser={currentUser} />}

          {/* 댓글 밑에 전체 게시판 글 목록 */}
          <AllBoardPosts />
        </>
      )}
    </div>
  );
}

export default PostDetailPage;
