/**
 * Contract for avatar generation and upload services.
 * Implementations handle creating profile images (e.g. via DiceBear or similar)
 * and uploading them to object storage, returning the public URL.
 */
export interface AvatarGenerator {
  /**
   * Generate a profile avatar for the given user and persist it to storage.
   * @param mykoId - Unique user identifier used for naming the avatar file
   * @param name   - Optional display name to derive initials or visual elements from
   * @returns      - Public URL of the uploaded avatar image
   */
  generateAndUpload: (mykoId: string, name?: string) => Promise<string>;
}
