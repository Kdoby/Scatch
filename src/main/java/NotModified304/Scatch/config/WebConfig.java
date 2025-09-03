package NotModified304.Scatch.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
@EnableWebSecurity
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    // <img src="/uploads/basic.png"> → kkxxx.jpg → {프로젝트}/uploads/xxx.jpg
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/")
                .setCachePeriod(60 * 10 * 6)	//1시간
                .resourceChain(true)
                .addResolver(new PathResourceResolver());
    }
}
