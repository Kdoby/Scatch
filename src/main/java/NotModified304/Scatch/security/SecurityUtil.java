package NotModified304.Scatch.security;

import org.springframework.security.access.AccessDeniedException;

public class SecurityUtil {

    public static void validateOwner(String resourceOwnerName, String currentUserName) {
        if(!resourceOwnerName.equals(currentUserName)) {
            throw new AccessDeniedException("접근 권한이 없습니다.");
        }
    }
}
