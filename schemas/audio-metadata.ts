import { z } from "zod";

export const TechnicalInfoSchema = z
  .object({
    durationSeconds: z.number().optional(),
    bitrateBps: z.number().optional(),
    sampleRateHz: z.number().optional(),
    channels: z.number().optional(),
    fileSizeBytes: z.number().optional(),
    fileExtension: z.string().optional(),
    audioFormatName: z.string().optional(),
    isFlacMd5Valid: z.boolean().optional(),
  })
  .passthrough();

export type TechnicalInfo = z.infer<typeof TechnicalInfoSchema>;

export const AudioMetadataDetailedSchema = z.object({
  technicalInfo: TechnicalInfoSchema.nullable().optional(),
  unifiedMetadata: z.unknown(),
  metadataFormat: z.unknown(),
  headers: z.unknown(),
  rawMetadata: z.unknown(),
  formatPriorities: z.unknown(),
});

export type AudioMetadataDetailed = z.infer<typeof AudioMetadataDetailedSchema>;
