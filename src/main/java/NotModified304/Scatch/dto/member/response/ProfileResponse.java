package NotModified304.Scatch.dto.member.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {
    private Integer paletteNumber;
    private String nickname;
    private String intro;
    private String profileImagePath;
}
