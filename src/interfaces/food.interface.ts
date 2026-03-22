import {IFile} from "@/interfaces/file.interface";

export interface IFood {
    id: number;
    name: { en: string; ge: string; ru: string };
    imageId: string;
    image: IFile;
}
