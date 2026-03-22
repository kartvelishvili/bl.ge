import { IFile } from "@/interfaces/file.interface";

export interface IProduct {
  id: number;
  name: { en: string; ge: string; ru: string };
  imageId: number;
  file: IFile;
  categories: any;
}
