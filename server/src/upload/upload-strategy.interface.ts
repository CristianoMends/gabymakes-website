export interface UploadStrategy {
  upload(file: Express.Multer.File): Promise<string>;
  getImageBuffer?(filename: string);
}
