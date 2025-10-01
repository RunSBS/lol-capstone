@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class BoardPostController {

    @Autowired
    private BoardPostRepository repo;

    @GetMapping
    public Page<BoardPost> getPosts(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String keyword) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (category != null && !category.isEmpty()) {
            if (keyword != null && !keyword.isEmpty()) {
                // 검색과 카테고리 조합 (예시)
                return repo.findByCategoryAndTitleContainingIgnoreCase(category, keyword, pageable);
            }
            return repo.findByCategory(category, pageable);
        } else if (keyword != null && !keyword.isEmpty()) {
            return repo.findByTitleContainingIgnoreCase(keyword, pageable);
        }
        return repo.findAll(pageable);
    }

    @GetMapping("/{id}")
    public BoardPost getPost(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public BoardPost createPost(@RequestBody BoardPost post) {
        post.setCreatedAt(LocalDateTime.now());
        return repo.save(post);
    }

    @PutMapping("/{id}")
    public BoardPost updatePost(@PathVariable Long id, @RequestBody BoardPost newPost) {
        BoardPost post = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        post.setTitle(newPost.getTitle());
        post.setContent(newPost.getContent());
        post.setCategory(newPost.getCategory());
        return repo.save(post);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
