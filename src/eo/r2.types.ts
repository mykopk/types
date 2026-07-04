/**
 * Connection configuration for an S3-compatible object store (Cloudflare R2).
 * Passed to the R2 dynamic module at registration time to initialise
 * the underlying S3 client for avatar and file storage operations.
 */
export interface R2Options {
  /** S3-compatible endpoint URL (e.g. https://<account>.r2.cloudflarestorage.com) */
  endpoint: string;
  /** R2 access key identifier */
  accessKeyId: string;
  /** R2 secret access key */
  secretAccessKey: string;
  /** Target bucket name within the R2 namespace */
  bucket: string;
  /** Public base URL for generating readable file links */
  publicUrl: string;
}
