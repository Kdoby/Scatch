package NotModified304.Scatch.util;

public class DurationUtils {
    public static int getHours(int seconds) {
        return seconds / 3600;
    }

    public static int getMinutes(int seconds) {
        return (seconds % 3600) / 60;
    }

    public static int getSeconds(int seconds) {
        return seconds % 60;
    }
}

