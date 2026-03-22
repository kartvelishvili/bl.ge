import { IFile } from "@/interfaces/file.interface";
import { IProductItem } from "@/interfaces/product-item.interface";

export interface ICompany {
  id: number;
  name: string;
  file: IFile;
  productItems: IProductItem[];
  secondaryFileId: number;
  secondaryFile?: IFile;
  activeFile: IFile;
}
