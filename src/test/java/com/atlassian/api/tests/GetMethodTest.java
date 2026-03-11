package com.atlassian.api.tests;

import com.atlassian.api.base.BaseAPI;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;

/**
 * GetMethodTest demonstrates HTTP GET requests to
 * https://parusonly.atlassian.net using Basic Authentication configured in
 * BaseAPI.
 *
 * Atlassian REST API v3 examples: - GET /rest/api/3/myself -> returns the
 * currently authenticated user - GET /rest/api/3/project -> returns all
 * projects - GET /rest/api/3/issue/{issueKey} -> returns a specific Jira issue
 */
public class GetMethodTest extends BaseAPI {

    // ----------------------------------------------------------------
    // Test 1: GET /rest/api/3/myself
    //         Verifies that Basic Auth is working and the current
    //         authenticated user details are returned (status 200).
    // ----------------------------------------------------------------
    //@Test(description = "GET - Verify authenticated user details")
    @Test(groups = {"api"})
    public void testGetCurrentUser() {
        Response response = given()
                .spec(requestSpec)
                .when()
                .get("/rest/api/3/myself")
                .then()
                .log().body()
                .extract().response();

        int statusCode = response.getStatusCode();
        System.out.println("Status Code : " + statusCode);
        System.out.println("Response Body: " + response.getBody().asPrettyString());

        Assert.assertEquals(statusCode, 200,
                "Expected status 200 for GET /rest/api/3/myself");

        // Verify accountId field is present in the response
        String accountId = response.jsonPath().getString("accountId");
        Assert.assertNotNull(accountId, "accountId should not be null");
        System.out.println("Logged in as accountId: " + accountId);
    }

    // ----------------------------------------------------------------
    // Test 2: GET /rest/api/3/project
    //         Returns a list of all Jira projects accessible to the user.
    // ----------------------------------------------------------------
    // @Test(description = "GET - Retrieve all Jira projects")
    @Test(groups = {"api"})
    public void testGetAllProjects() {
        Response response = given()
                .spec(requestSpec)
                .when()
                .get("/rest/api/3/project")
                .then()
                .log().body()
                .extract().response();

        int statusCode = response.getStatusCode();
        System.out.println("Status Code  : " + statusCode);
        System.out.println("Response Body: " + response.getBody().asPrettyString());

        Assert.assertEquals(statusCode, 200,
                "Expected status 200 for GET /rest/api/3/project");
    }

    // ----------------------------------------------------------------
    // Test 3: GET /rest/api/3/serverInfo
    //         Returns server information (no project/issue keys needed).
    // ----------------------------------------------------------------
    //@Test(description = "GET - Retrieve Jira server info")
    @Test(groups = {"api"})
    public void testGetServerInfo() {
        Response response = given()
                .spec(requestSpec)
                .when()
                .get("/rest/api/3/serverInfo")
                .then()
                .log().body()
                .extract().response();

        int statusCode = response.getStatusCode();
        System.out.println("Status Code  : " + statusCode);
        System.out.println("Response Body: " + response.getBody().asPrettyString());

        Assert.assertEquals(statusCode, 200,
                "Expected status 200 for GET /rest/api/3/serverInfo");

        String baseUrl = response.jsonPath().getString("baseUrl");
        Assert.assertNotNull(baseUrl, "baseUrl in serverInfo should not be null");
        System.out.println("Server Base URL: " + baseUrl);
    }

    // ----------------------------------------------------------------
    // Test 4: GET /rest/api/3/issue/{issueKey}
    //         Replace PROJ-1 with an actual issue key from your project.
    // ----------------------------------------------------------------
    //@Test(description = "GET - Retrieve a specific Jira issue by key")
    @Test(groups = {"api"})
    public void testGetIssueByKey() {
        String issueKey = "PROJ-1"; // TODO: Replace with a valid issue key

        Response response = given()
                .spec(requestSpec)
                .when()
                .get("/rest/api/3/issue/" + issueKey)
                .then()
                .log().body()
                .extract().response();

        int statusCode = response.getStatusCode();
        System.out.println("Status Code  : " + statusCode);
        System.out.println("Issue Key    : " + issueKey);
        System.out.println("Response Body: " + response.getBody().asPrettyString());

        // 200 = found, 404 = not found (adjust based on your data)
        Assert.assertTrue(statusCode == 200 || statusCode == 404,
                "Expected 200 or 404 for GET /rest/api/3/issue/" + issueKey);
    }
}
