/**
 * Price History Config Type
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 */

export type PriceHistoryConfig = {
  supportedResolutions?: string[];
  supportsGroupRequest?: boolean;
  supportsMarks?: boolean;
  supportsSearch?: boolean;
  supportsTimescaleMarks?: boolean;
};

