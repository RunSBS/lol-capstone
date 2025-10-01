const STORAGE_KEY = "dummyComments";

function loadComments() {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

function saveComments(comments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

const commentApi = {
  getCommentsByPostId: (postId) =>
    new Promise((resolve) => {
      const comments = loadComments();
      resolve(comments.filter(c => c.postId === postId));
    }),

  createComment: (comment) =>
    new Promise((resolve) => {
      const comments = loadComments();
      const newComment = {
        ...comment,
        id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
        createdAt: new Date().toISOString(),
      };
      comments.push(newComment);
      saveComments(comments);
      resolve(newComment);
    }),

  deleteComment: (id) =>
    new Promise((resolve, reject) => {
      let comments = loadComments();
      const index = comments.findIndex(c => c.id === id);
      if (index === -1) reject("댓글을 찾을 수 없습니다.");
      else {
        comments.splice(index, 1);
        saveComments(comments);
        resolve(true);
      }
    }),
};

export default commentApi;
