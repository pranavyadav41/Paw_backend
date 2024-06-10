import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import crypto from 'crypto';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

 export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export default class S3Uploader {
  private bucketName: string;
  private bucketRegion: string;
  private s3AccessKey: string;
  private s3SecretAccessKey: string;
  private s3Client: S3Client;

  constructor() {
    this.bucketName = process.env.BUCKET_NAME as string;
    this.bucketRegion = process.env.BUCKET_REGION as string;
    this.s3AccessKey = process.env.S3_ACCESS_KEY as string;
    this.s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY as string;
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.s3AccessKey,
        secretAccessKey: this.s3SecretAccessKey,
      },
      region: this.bucketRegion,
    });
  }

  private generateRandomImageName = (bytes = 32): string => {
    return crypto.randomBytes(bytes).toString('hex');
  }

  public uploadImagesToS3 = async (files: IFile[]): Promise<string[]> => {
    const uploadedImageNames: string[] = [];

    for (const file of files) {
      const stream = Readable.from(file.buffer);
      const imageName = this.generateRandomImageName();
      const uploader = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: imageName,
          Body: stream,
          ContentType: file.mimetype,
        },
      });

      try {
        await uploader.done();
        console.log(`${file.originalname} uploaded successfully`);
        uploadedImageNames.push(imageName);
      } catch (error) {
        console.error(`Error uploading ${file.originalname} to S3:`, error);
      }
    }

    return uploadedImageNames;
  }

  public getSignedImageUrls = async (imageNames: string[]): Promise<string[]> => {
    const signedUrls: string[] = [];

    for (const imageName of imageNames) {
      const getObjectParams = {
        Bucket: this.bucketName,
        Key: imageName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // Signed URL expires in 1 hour
      signedUrls.push(url);
    }

    return signedUrls;
  }
}