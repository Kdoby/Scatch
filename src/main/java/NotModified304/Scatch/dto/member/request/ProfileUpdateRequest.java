package NotModified304.Scatch.dto.member.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private Integer paletteNumber;
    private String nickname;
    private String intro;
}
