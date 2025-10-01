import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import boardApi from "../api/boardApi";

function WritePost({ currentUser }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("free");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const inputFileRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  // 이미지 선택 후 미리보기 생성
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null; // 선택 초기화
  };

  // 이미지 미리보기 삭제
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  // 이미지 태그를 글 본문 커서 위치에 삽입
  const insertImageToContent = () => {
    if (!imagePreviewUrl) return;
    const textarea = textareaRef.current;
    const imgTag = `<img src="${imagePreviewUrl}" alt="첨부 이미지" style="max-width: 100%; height: auto;" />`;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    const before = content.substring(0, startPos);
    const after = content.substring(endPos);

    const newContent = before + imgTag + after;
    setContent(newContent);

    // 커서 위치 수정
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = startPos + imgTag.length;
      textarea.focus();
    }, 0);

    // 삽입 후 미리보기 초기화
    handleRemoveImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await boardApi.createPost({
        title,
        content,
        category,
        writer: currentUser,
        // 이미지 파일 업로드는 별도 구현 필요
      });
      alert("글이 등록되었습니다.");
      // 등록 후 해당 게시판으로 이동
      navigate(`/${category}`);
    } catch (error) {
      alert("글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>글쓰기</h3>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginBottom: 10, width: 150, height: 30 }}
      >
        <option value="free">자유게시판</option>
        <option value="guide">공략</option>
        <option value="lolmuncheol">롤문철</option>
      </select>

      <br />

      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <textarea
        id="contentTextarea"
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{ width: "100%", marginBottom: 10 }}
        ref={textareaRef}
      />

      <div style={{ position: "relative", marginBottom: 10 }}>
        <button
          type="button"
          onClick={() => inputFileRef.current.click()}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
            backgroundColor: "#f0f0f0",
          }}
        >
          이미지 첨부
        </button>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={inputFileRef}
          onChange={handleImageChange}
        />

        {imagePreviewUrl && (
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginTop: 10,
            }}
          >
            <img
              src={imagePreviewUrl}
              alt="첨부 이미지 미리보기"
              style={{ maxWidth: "300px", maxHeight: "200px", display: "block" }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                cursor: "pointer",
                fontWeight: "bold",
                lineHeight: "24px",
                textAlign: "center",
                padding: 0,
              }}
              title="이미지 취소"
            >
              ×
            </button>
            <button
              type="button"
              onClick={insertImageToContent}
              style={{
                marginTop: 5,
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              삽입
            </button>
          </div>
        )}
      </div>

      <button type="submit">등록</button>
    </form>
  );
}

export default WritePost;
