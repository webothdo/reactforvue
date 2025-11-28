import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../lib/s3Client";

export const useS3Client = () => {
  const uploadObject = async (key: string, type: string, body: any) => {
    const putCommand = new PutObjectCommand({
      Bucket: "reactforvue",
      Key: `images/${key}`,
      Body: body,
      ContentType: type || "application/octet-stream",
    });
    try {
      const response = await s3Client.send(putCommand);
      return response;
    } catch (error) {
      return error;
    }
  };
  return {
    uploadObject,
  };
};
