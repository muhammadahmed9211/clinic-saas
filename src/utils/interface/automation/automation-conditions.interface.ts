export interface AutomationConditions {
  // Date conditions
  minCreationDate?: string;

  // Source filters
  excludeSources?: string[];

  // Affiliate filters
  excludeAffiliatePatterns?: string[];

  // Retention filters
  excludeRetention?: boolean;

  // Time restrictions
  timeRestriction?: {
    startHour: number;
    endHour: number;
  };

  // Additional conditions can be added here
  [key: string]: any;
}
