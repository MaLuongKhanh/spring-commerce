package com.example.demo.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Converter
public class StringArrayConverter implements AttributeConverter<String[], String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger log = LoggerFactory.getLogger(StringArrayConverter.class);

    @Override
    public String convertToDatabaseColumn(String[] attribute) {
        try {
            if (attribute == null || attribute.length == 0) {
                return "[]";
            }
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            log.error("Error converting String array to JSON", e);
            return "[]";
        }
    }

    @Override
    public String[] convertToEntityAttribute(String dbData) {
        try {
            if (dbData == null || dbData.trim().isEmpty()) {
                return new String[0];
            }
            String[] result = objectMapper.readValue(dbData, String[].class);
            return result;
        } catch (Exception e) {
            log.error("Error converting JSON to String array: " + dbData, e);
            return new String[0];
        }
    }
}