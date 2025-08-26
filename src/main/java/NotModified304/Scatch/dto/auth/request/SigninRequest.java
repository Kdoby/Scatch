package NotModified304.Scatch.dto.auth.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SigninRequest {
    private String username;
    private String password;
}
