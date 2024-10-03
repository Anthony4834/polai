export const zodResponseFormat = {
        "type": "json_schema",
        "json_schema": {
            "name": "biases",
            "strict": true,
            "schema": {
                "type": "object",
                "properties": {
                    "summary": {
                        "type": "string"
                    },
                    "biases": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "reason": {
                                    "type": "string"
                                },
                                "line": {
                                    "type": "string"
                                },
                                "fixed": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "reason",
                                "line",
                                "fixed"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "required": [
                    "summary",
                    "biases"
                ],
                "additionalProperties": false,
                "$schema": "http://json-schema.org/draft-07/schema#"
            }
        }
    }