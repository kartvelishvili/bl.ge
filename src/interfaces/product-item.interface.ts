import { IFile } from "@/interfaces/file.interface";
import { GlassType } from "@/enums/glass-type.enum";
import { IFood } from "@/interfaces/food.interface";

export interface IProductItem {
  id: number;
  name: { en: string; ru: string; ge: string };
  imageId: number;
  image: IFile;
  description: { en: string; ru: string; ge: string };
  alcohol: number;
  temperature: string;
  color: { en: string; ru: string; ge: string };
  vinificationId: number;
  vinification: IFile;
  productCategoryId: number;
  tannins: number;
  fruitTones: number;
  sweetness: number;
  body: number;
  glass: GlassType;
  productCategory: { name: { en: string; ge: string; ru: string } };
  foods: IFood[];
  isPopular: boolean;
  composition?: { en: string; ge: string; ru: string };
  aged?: { en: string; ge: string; ru: string };
  viticulture?: { en: string; ge: string; ru: string };
  volume?: { en: string; ge: string; ru: string };
  awards: IFile[];
  images: IFile[];
}
