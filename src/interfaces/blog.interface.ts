import { IFile } from "@/interfaces/file.interface";
import { BlogTypeEnum } from "@/enums/blog-type.enum";

export interface IBlog {
  id: number;
  title: { en: string; ru: string; ge: string };
  description: { en: string; ru: string; ge: string };
  fileId: number;
  file: IFile;
  type: BlogTypeEnum;
  gallery: IFile[];
  createdAt: string;
  visibleOnHome: boolean;
}
