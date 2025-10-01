@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password; // 암호화 저장 필수

    // roles, 활성화 상태 등 추가 가능
}
