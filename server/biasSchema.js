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
                        categories: {
                            type: 'array',
                            description: 'Every demonstrated bias category for this exact passage.',
                            items: {
                                type: 'string',
                                enum: [
                                    'loaded_language',
                                    'intent_attribution',
                                    'unbalanced_framing',
                                    'unsupported_speculation',
                                    'partisan_asymmetry'
                                ]
                            },
                            minItems: 1
                        },
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
                    required: ['categories', 'reason', 'line', 'fixed'],
                    additionalProperties: false
                }
            }
        },
        required: ['summary', 'biases'],
        additionalProperties: false
    }
};
