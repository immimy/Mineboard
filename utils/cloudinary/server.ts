import 'server-only';
import { v2 as cloudinary } from 'cloudinary';

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getCloudinaryServerClient() {
  cloudinary.config({
    cloud_name: getRequiredEnvironmentVariable(
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    ),
    api_key: getRequiredEnvironmentVariable('NEXT_PUBLIC_CLOUDINARY_API_KEY'),
    api_secret: getRequiredEnvironmentVariable('CLOUDINARY_API_SECRET'),
  });

  return cloudinary;
}
