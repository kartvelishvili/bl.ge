import { IProductItem } from "@/interfaces/product-item.interface";

export interface WineCardProps {
  imageSrc: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  href: string;
}

export interface WineSectionProps {
  iconSrc: string;
  wines: IProductItem[];
  locale: 'en' | 'ge' | 'ru'
  companyId: number
}

export interface NavigationItemProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface NavigationIconProps {
  src: string;
  alt: string;
  onClick?: () => void;
}

export interface ProductsState {
  activeCategory: string;
  selectedWine: string | null;
}
