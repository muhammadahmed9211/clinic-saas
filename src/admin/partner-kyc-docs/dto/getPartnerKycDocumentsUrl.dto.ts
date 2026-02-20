export interface PartnerKycDocumentDTO {
  id: number;
  userId: number;
  documentId: number;
  field_id: string;
  side: string | null;
  status: string;
  reasons: string | null;
  created_at: Date;
  updated_at: Date;
  url: string;
  kycStatusName: string;
}
