package com.atlassian.api.utils;

import java.io.InputStream;
import java.util.Properties;

/**
 * ConfigReader loads key-value pairs from config.properties.
 * File must be present on the classpath: src/main/resources/config.properties
 */
public class ConfigReader {

    private static final Properties properties = new Properties();
    private static final String CONFIG_FILE = "config.properties";

    static {
        try (InputStream input = ConfigReader.class
                .getClassLoader()
                .getResourceAsStream(CONFIG_FILE)) {

            if (input == null) {
                throw new RuntimeException("config.properties not found on classpath.");
            }
            properties.load(input);

        } catch (Exception e) {
            throw new RuntimeException("Failed to load " + CONFIG_FILE, e);
        }
    }

    /**
     * Returns the value for the given property key.
     *
     * @param key property name
     * @return property value
     */
    public static String get(String key) {
        String value = properties.getProperty(key);
        if (value == null || value.isBlank()) {
            throw new RuntimeException("Property '" + key + "' not found in " + CONFIG_FILE);
        }
        return value.trim();
    }
}
