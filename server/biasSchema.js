export const biasResponseFormat = {
    type: 'json_schema',
    name: 'bias_analysis',
    strict: true,
    schema: {
        type: 'object',
        properties: {
            summary: {
                type: 'string'
            },
            biases: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        reason: {
                            type: 'string'
                        },
                        line: {
                            type: 'string'
                        },
                        fixed: {
                            type: 'string'
                        }
                    },
                    required: ['reason', 'line', 'fixed'],
                    additionalProperties: false
                }
            }
        },
        required: ['summary', 'biases'],
        additionalProperties: false
    }
};
