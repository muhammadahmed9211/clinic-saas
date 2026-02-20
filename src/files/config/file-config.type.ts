export type FileConfig = {
  driver: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsDefaultS3Url?: string;
  awsS3Region?: string;
  maxFileSize: number;
  awss3SignedUrlTimeout?: number;
  sharedBucketDirectory?: string;
  defaultBucketDirectory?: string;
  awsExcelSheetDirectory?: string;
  contactUsBucketDirectory?: string;
  contactUsSignedUrlTimeout?: string;
  chatBucketDirectory?: string;
};
