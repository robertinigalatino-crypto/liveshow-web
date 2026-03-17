import { createBrowserClient } from "@supabase/ssr"

type SupabaseClient = ReturnType<typeof createBrowserClient>

export type StorageBucket = "artists" | "artists-gallery" | "shows" | "channels" | "settings" | "gallery"

/**
 * Upload a file to a Supabase Storage bucket.
 * Returns the public URL on success, or null on error.
 */
export async function uploadFile(
  supabase: SupabaseClient,
  bucket: StorageBucket,
  file: File,
  folder?: string,
): Promise<string | null> {
  const VALID_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"]
  const parts = file.name.split(".")
  const ext = parts.length > 1 ? (parts.pop()?.toLowerCase() || "jpg") : "jpg"
  const safeExt = VALID_EXTENSIONS.includes(ext) ? ext : "jpg"

  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const path = folder
    ? `${folder}/${timestamp}-${random}.${safeExt}`
    : `${timestamp}-${random}.${safeExt}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error(`Upload error (${bucket}):`, error.message)
    return null
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}

/**
 * Delete a file from a Supabase Storage bucket by its public URL.
 */
export async function deleteFile(
  supabase: SupabaseClient,
  bucket: StorageBucket,
  publicUrl: string,
): Promise<boolean> {
  // Extract the path from the public URL
  const marker = `/storage/v1/object/public/${bucket}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return false

  const path = decodeURIComponent(publicUrl.substring(idx + marker.length))
  if (!path) return false

  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) {
    console.error(`Delete error (${bucket}):`, error.message)
    return false
  }
  return true
}
