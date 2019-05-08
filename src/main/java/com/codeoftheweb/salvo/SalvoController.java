//package com.codeoftheweb.salvo;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
//
//public class SalvoController {
//
//    @Configuration
//    public class MyConfiguration {
//
//        @Bean
//        public WebMvcConfigurer corsConfigurer() {
//            return new WebMvcConfigurerAdapter() {
//                @Override
//                public void addCorsMappings(CorsRegistry registry) {
//                    registry.addMapping("/**")
//                            .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH");
//                }
//            };
//        }
//    }
//
//}
//disables all of CORS