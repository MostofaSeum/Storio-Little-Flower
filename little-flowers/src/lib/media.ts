/**
 * Pure client-safe utility functions for media URL resolution.
 * Does not import any Next.js server-only modules (like next/headers).
 */

/**
 * Resolves full image URL for a blog post.
 */
export function getBlogPostImageUrl(post: {
  featured_image_url?: string;
  featured_image_data?: { file?: string };
}): string | null {
  const rawPath = post.featured_image_url || post.featured_image_data?.file;
  if (!rawPath) return null;

  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }

  if (rawPath.startsWith('/media/')) {
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://api.storio.cloud';
    return `${backendUrl.replace(/\/$/, '')}${rawPath}`;
  }

  return rawPath;
}

/**
 * Resolves full image URL for staff / team members.
 */
export function getStaffMemberPhoto(member: unknown): string {
  if (!member || typeof member !== 'object') return '/icons/user.png';

  const m = member as {
    photo_url?: string;
    profile_pic_data?: { file_url?: string; file?: string };
    image_data?: { file_url?: string; file?: string };
    profile_pic?: string | number;
    image?: string | number;
  };

  const rawPath =
    m.photo_url ||
    m.profile_pic_data?.file_url ||
    m.profile_pic_data?.file ||
    m.image_data?.file_url ||
    m.image_data?.file ||
    (typeof m.profile_pic === 'string' ? m.profile_pic : undefined) ||
    (typeof m.image === 'string' ? m.image : undefined);

  if (!rawPath) return '/icons/user.png';

  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }

  if (rawPath.startsWith('/media/')) {
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://api.storio.cloud';
    return `${backendUrl.replace(/\/$/, '')}${rawPath}`;
  }

  return rawPath;
}

/**
 * General purpose media URL resolver for any raw relative or absolute file path.
 */
export function resolveMediaUrl(rawPath?: string | null): string {
  if (!rawPath) return '';
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }
  if (rawPath.startsWith('/media/')) {
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://api.storio.cloud';
    return `${backendUrl.replace(/\/$/, '')}${rawPath}`;
  }
  return rawPath;
}
