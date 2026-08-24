import { File } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import { supabase } from "@/services/supabase/client";

export const PHOTOS_BUCKET = "plant-photos";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

export async function compressPhoto(uri: string) {
  const image = await ImageManipulator.manipulate(uri)
    .resize({ width: 1280 })
    .renderAsync();

  const result = await image.saveAsync({
    compress: 0.7,
    format: SaveFormat.JPEG,
  });

  return result.uri;
}

export async function uploadPhoto(params: {
  userId: string;
  uri: string;
  folder?: string;
}) {
  const { userId, uri, folder = "analyses" } = params;

  const compressedUri = await compressPhoto(uri);
  const bytes = await new File(compressedUri).arrayBuffer();
  const path = `${userId}/${folder}/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, bytes, { contentType: "image/jpeg", upsert: false });

  if (error) throw error;
  return path;
}

export async function getPhotoUrl(path: string) {
  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error) throw error;
  return data.signedUrl;
}

export async function removePhoto(path: string) {
  const { error } = await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
  if (error) throw error;
}
