export class IMessageResponse {
  id: number; // IDENTITY implies it's automatically generated, but still part of the object when reading from the database
  text: string; // `text` SQL type corresponds to a large string in TypeScript
  type: string; // `nvarchar` maps directly to string
  sender: string; // `nvarchar` maps directly to string
  userId: number; // Direct mapping to number
  operatorId: number; // Direct mapping to number
  createdAt: Date; // `datetime2` maps to Date in TypeScript
  updatedAt: Date; // `datetime2` maps to Date in TypeScript
  status: string; // `nvarchar` maps directly to string, default 'active' is handled in SQL
  starred: boolean; // `bit` in SQL is commonly mapped to boolean in TypeScript
  templateId: number | null; // Nullable since `template_id` can be NULL
  subject: string; // `text` SQL type corresponds to a large string in TypeScript
  read: boolean; // `bit` in SQL is commonly mapped to boolean in TypeScript
  readAt: Date | null; // Nullable because `read_at` can be NULL
}
