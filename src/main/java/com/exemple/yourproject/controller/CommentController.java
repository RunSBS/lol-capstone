@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentRepository repo;

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        return repo.save(comment);
    }

    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable Long id, @RequestBody Comment newComment) {
        Comment comment = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        comment.setText(newComment.getText());
        return repo.save(comment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
