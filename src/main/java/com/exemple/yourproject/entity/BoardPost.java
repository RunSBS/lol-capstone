//게시글 엔티티+이미지 첨부
@Entity
public class BoardPost {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String category;
    private String title;
    @Lob
    private String content;
    private String writer;
    private LocalDateTime createdAt = LocalDateTime.now();

    private String imageUrl; // 이미지 URL 저장용

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    // getters, setters...
}
