let globalId = parseInt(localStorage.getItem("globalPostId") || "0", 10);
const adminId = "admin1";

function getStorageKeyByCategory(category) {
  return `dummyPosts_${category || "all"}`;
}

function loadPosts(category) {
  if (category === "all") {
    const categories = ["free", "guide", "lolmuncheol"];
    let allPosts = [];
    categories.forEach((cat) => {
      const json = localStorage.getItem(`dummyPosts_${cat}`);
      const posts = json ? JSON.parse(json) : [];
      allPosts = allPosts.concat(posts);
    });
    return allPosts;
  } else {
    const key = getStorageKeyByCategory(category);
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : [];
  }
}

function savePosts(category, posts) {
  const key = getStorageKeyByCategory(category);
  localStorage.setItem(key, JSON.stringify(posts));
}

function getNextPostId() {
  globalId++;
  localStorage.setItem("globalPostId", globalId.toString());
  return globalId;
}

const boardApi = {
  getPosts: (page = 0, size = 10, category) =>
    new Promise((resolve) => {
      let posts = loadPosts(category);
      if (category !== "all") {
        posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      const pagedPosts = posts.slice(page * size, (page + 1) * size);
      resolve({ content: pagedPosts, totalPages: 1 });
    }),

  getPost: (id) =>
    new Promise((resolve, reject) => {
      const categories = ["free", "guide", "lolmuncheol"];
      let allPosts = [];
      categories.forEach((cat) => {
        allPosts = allPosts.concat(loadPosts(cat));
      });
      const post = allPosts.find((p) => p.id === Number(id));
      if (post) resolve(post);
      else reject("게시글이 없습니다.");
    }),

  createPost: (post) =>
    new Promise((resolve) => {
      const posts = loadPosts(post.category);
      const newPost = {
        ...post,
        id: getNextPostId(),
        createdAt: new Date().toISOString(),
        comments: [],
      };
      posts.push(newPost);
      savePosts(post.category, posts);
      resolve(newPost);
    }),

  deletePost: (id, requester) =>
    new Promise((resolve, reject) => {
      const categories = ["free", "guide", "lolmuncheol"];
      let deleted = false;
      categories.forEach((category) => {
        const posts = loadPosts(category);
        const index = posts.findIndex((p) => p.id === Number(id));
        if (index !== -1) {
          if (posts[index].writer === requester || requester === adminId) {
            posts.splice(index, 1);
            savePosts(category, posts);
            deleted = true;
          }
        }
      });
      if (deleted) resolve(true);
      else reject("삭제 권한이 없거나 게시글을 찾을 수 없습니다.");
    }),

  updatePost: (id, updatedPost) =>
    new Promise((resolve, reject) => {
      const categories = ["free", "guide", "lolmuncheol"];
      let updated = false;
      categories.forEach((category) => {
        const posts = loadPosts(category);
        const idx = posts.findIndex((p) => p.id === Number(id));
        if (idx !== -1) {
          posts[idx] = { ...posts[idx], ...updatedPost };
          savePosts(category, posts);
          updated = true;
        }
      });
      if (updated) resolve(true);
      else reject("수정 실패");
    }),

  searchPosts: (keyword, category) =>
    new Promise((resolve) => {
      const categories = category ? [category] : ["free", "guide", "lolmuncheol"];
      let results = [];

      const commentsJson = localStorage.getItem("dummyComments") || "[]";
      const comments = JSON.parse(commentsJson);

      categories.forEach((cat) => {
        const posts = loadPosts(cat);
        results = results.concat(
          posts.filter((post) => {
            const inTitle = post.title.includes(keyword);
            const inWriter = post.writer.includes(keyword);
            const hasCommentWithKeyword = comments.some(
              (c) => c.postId === post.id && c.text.includes(keyword)
            );
            return inTitle || inWriter || hasCommentWithKeyword;
          })
        );
      });

      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      resolve(results);
    }),
};

export default boardApi;
