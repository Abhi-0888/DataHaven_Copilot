import { z } from 'zod';
import { insertDatasetSchema, datasets, datasetAnalysis, insights, verificationLogs } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  datasets: {
    list: {
      method: 'GET' as const,
      path: '/api/datasets' as const,
      responses: {
        200: z.array(z.custom<typeof datasets.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/datasets/:id' as const,
      responses: {
        200: z.custom<typeof datasets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    upload: {
      method: 'POST' as const,
      path: '/api/datasets/upload' as const,
      // We accept multipart/form-data, so input schema is not strictly validated here
      input: z.any(),
      responses: {
        201: z.custom<typeof datasets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    analyze: {
      method: 'POST' as const,
      path: '/api/datasets/:id/analyze' as const,
      responses: {
        200: z.object({
          analysis: z.custom<typeof datasetAnalysis.$inferSelect>(),
          insights: z.array(z.custom<typeof insights.$inferSelect>())
        }),
        404: errorSchemas.notFound,
      },
    },
    report: {
      method: 'GET' as const,
      path: '/api/datasets/:id/report' as const,
      responses: {
        200: z.object({
          analysis: z.custom<typeof datasetAnalysis.$inferSelect>().optional(),
          insights: z.array(z.custom<typeof insights.$inferSelect>())
        }),
        404: errorSchemas.notFound,
      },
    },
    timeline: {
      method: 'GET' as const,
      path: '/api/datasets/:id/timeline' as const,
      responses: {
        200: z.array(z.any()),
      }
    },
    ledger: {
      method: 'GET' as const,
      path: '/api/datasets/:id/ledger' as const,
      responses: {
        200: z.array(z.any()),
      }
    },
    trust: {
      method: 'GET' as const,
      path: '/api/datasets/:id/trust' as const,
      responses: {
        200: z.object({
          completeness: z.number(),
          freshness: z.number(),
          consistency: z.number(),
          schema: z.number(),
          verification: z.number(),
          total: z.number()
        }),
      }
    },
    versions: {
      method: 'GET' as const,
      path: '/api/datasets/:id/versions' as const,
      responses: {
        200: z.array(z.any()),
      }
    },
    events: {
      method: 'GET' as const,
      path: '/api/datasets/:id/events' as const,
      responses: {
        200: z.array(z.any()),
      }
    }
  },
  copilot: {
    query: {
      method: 'POST' as const,
      path: '/api/copilot/query' as const,
      input: z.object({
        datasetId: z.coerce.number(),
        query: z.string()
      }),
      responses: {
        200: z.object({
          answer: z.string()
        }),
        404: errorSchemas.notFound,
      }
    }
  },
  blockchain: {
    register: {
      method: 'POST' as const,
      path: '/api/blockchain/register' as const,
      input: z.object({
        datasetId: z.coerce.number(),
      }),
      responses: {
        200: z.object({
          txHash: z.string(),
          status: z.string()
        }),
        404: errorSchemas.notFound,
      }
    },
    verify: {
      method: 'GET' as const,
      path: '/api/blockchain/verify/:hash' as const,
      responses: {
        200: z.object({
          verified: z.boolean(),
          timestamp: z.string().optional()
        }),
        404: errorSchemas.notFound,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
