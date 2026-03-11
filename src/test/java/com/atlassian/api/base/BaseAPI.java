package com.atlassian.api.base;

import com.atlassian.api.utils.ConfigReader;
import io.restassured.RestAssured;
import io.restassured.authentication.PreemptiveBasicAuthScheme;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.filter.log.LogDetail;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.testng.annotations.BeforeClass;

/**
 * BaseAPI sets up REST Assured configuration with: - Base URL:
 * https://parusonly.atlassian.net/ - Basic Authentication (username + password
 * from config.properties) - Default headers and logging
 */
public class BaseAPI {

    protected static RequestSpecification requestSpec;

    @BeforeClass(alwaysRun = true)
    public void setupBaseConfig() {
        String baseUrl = ConfigReader.get("base.url");
        String username = ConfigReader.get("auth.username");
        String password = ConfigReader.get("auth.password");

        // Configure Basic Auth globally on RestAssured
        PreemptiveBasicAuthScheme authScheme = new PreemptiveBasicAuthScheme();
        authScheme.setUserName(username);
        authScheme.setPassword(password);
        RestAssured.authentication = authScheme;

        // Build a reusable RequestSpecification
        requestSpec = new RequestSpecBuilder()
                .setBaseUri(baseUrl)
                .setContentType(ContentType.JSON)
                .setAccept(ContentType.JSON)
                .log(LogDetail.ALL)
                .build();

        System.out.println("=== BaseAPI Setup Complete ===");
        System.out.println("Base URL : " + baseUrl);
        System.out.println("Username : " + username);
    }
}
