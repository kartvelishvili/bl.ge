import { IFile } from "@/interfaces/file.interface";
import {LocaleType} from "@/types/locale.type";

export interface IManagementTeam {
  id: number;
  firstName: { en: string; ge: string; ru: string };
  lastName: { en: string; ge: string; ru: string };
  profession: { en: string; ge: string; ru: string };
  imageId: string;
  image: IFile;
}
