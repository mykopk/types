/**
 * Configuration options for backup service.
 */
export interface BackupConfig {
  /** Database connection string */
  connectionString: string;
  /** Directory to store backup files */
  backupDir: string;
  /** Number of days to retain backups */
  retentionDays: number;
  /** Cron expression for scheduled backups */
  schedule?: string;
  /** Whether to compress backup files */
  compression?: boolean;
  /** Encryption configuration */
  encryption?: {
    /** Whether encryption is enabled */
    enabled: boolean;
    /** Encryption key */
    key: string;
  };
  /** S3 configuration for cloud storage */
  s3?: {
    /** Whether S3 upload is enabled */
    enabled: boolean;
    /** S3 bucket name */
    bucket: string;
    /** AWS region */
    region: string;
    /** AWS access key */
    accessKey: string;
    /** AWS secret key */
    secretKey: string;
  };
}

/**
 * Information about a backup file.
 */
export interface BackupInfo {
  /** Unique backup identifier */
  id: string;
  /** Backup filename */
  filename: string;
  /** Backup file size in bytes */
  size: number;
  /** When the backup was created */
  createdAt: Date;
  /** When the backup expires */
  expiresAt: Date;
  /** Backup status */
  status: 'created' | 'uploading' | 'uploaded' | 'failed';
  /** Backup location */
  location: 'local' | 's3';
}
