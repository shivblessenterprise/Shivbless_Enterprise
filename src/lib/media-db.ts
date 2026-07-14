import { ObjectId, type GridFSBucket } from "mongodb";
import { Readable } from "stream";
import { getMediaBucket } from "@/lib/mongodb";

export type StoredMedia = {
  id: string;
  url: string;
  contentType: string;
  filename: string;
};

function toMediaUrl(id: string) {
  return `/api/media/${id}`;
}

export async function uploadBufferToGridFS(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<StoredMedia> {
  const bucket = await getMediaBucket();
  const uploadStream = bucket.openUploadStream(filename, {
    contentType,
    metadata: { uploadedAt: new Date().toISOString() },
  });

  await new Promise<void>((resolve, reject) => {
    Readable.from(buffer)
      .pipe(uploadStream)
      .on("error", reject)
      .on("finish", () => resolve());
  });

  const id = uploadStream.id.toString();
  return {
    id,
    url: toMediaUrl(id),
    contentType,
    filename,
  };
}

export async function openMediaDownload(
  id: string
): Promise<{ bucket: GridFSBucket; fileId: ObjectId } | null> {
  if (!ObjectId.isValid(id)) return null;
  const fileId = new ObjectId(id);
  const bucket = await getMediaBucket();
  const files = await bucket.find({ _id: fileId }).limit(1).toArray();
  if (!files.length) return null;
  return { bucket, fileId };
}

export async function getMediaMeta(id: string) {
  if (!ObjectId.isValid(id)) return null;
  const bucket = await getMediaBucket();
  const files = await bucket.find({ _id: new ObjectId(id) }).limit(1).toArray();
  return files[0] || null;
}
