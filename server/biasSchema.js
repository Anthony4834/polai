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
            neutralText: {
                type: 'string',
                description: 'One complete neutral rewrite of the user text with the same line structure and no duplicated content.'
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
                            type: 'string',
                            description: 'The smallest exact, contiguous source passage that contains the bias.'
                        },
                        fixed: {
                            type: 'string',
                            description: 'A local neutral replacement for line only, without surrounding source text.'
                        }
                    },
                    required: ['reason', 'line', 'fixed'],
                    additionalProperties: false
                }
            }
        },
        required: ['summary', 'neutralText', 'biases'],
        additionalProperties: false
    }
};
