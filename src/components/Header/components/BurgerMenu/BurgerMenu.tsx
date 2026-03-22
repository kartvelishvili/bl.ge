import Image from "next/image";
import BurgerMenuLogo from "@/../public/icons/burger-menu-logo.svg";
import CloseBurgerIcon from "@/../public/icons/close-burger-icon.svg";
import { FC } from "react";
import { MENU_ITEMS } from "@/components/Header/components/Menu/utils/menu-items";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/Header/components/LanguageSwitcher/LanguageSwitcher";

interface Props {
  setIsOpen: (data: boolean) => void;
  isOpen: boolean;
  locale: string;
  dictionaries: Record<string, string>
}

const BurgerMenu: FC<Props> = (props) => {
  const pathName = usePathname();

  return (
    <div
      className="fixed h-screen min-w-full bg-[#0D1116] transition-transform duration-300 ease-in-out p-4 sm:p-8 flex flex-col items-start justify-start gap-6 w-full"
      style={{
        zIndex: 9999,
        transform: `translateX(${props.isOpen ? "0%" : "100%"})`,
      }}
    >
      <div className="flex items-center justify-between w-full">
        <Image src={BurgerMenuLogo} alt={"Logo"} />
        <Image
          src={CloseBurgerIcon}
          onClick={() => props.setIsOpen(false)}
          alt={"Close Burger Menu"}
        />
      </div>
      <div className="flex flex-col items-start justify-center gap-6 sm:gap-8">
        {MENU_ITEMS.map((item) => {
          const isActive = pathName.includes(item.href);
          return (
            <Link
              href={`/${props.locale}${item.href}`}
              className="font-notoSansGeoSemi text-[24px]"
              key={item.href}
              onClick={() => props.setIsOpen(false)}
              style={{
                color: isActive ? "#D2AE6D" : "rgba(255, 255, 255, 0.8)",
              }}
            >
              {props.dictionaries[item.content]}
            </Link>
          );
        })}
      </div>
      <LanguageSwitcher hiddenOnMobile={false} />
    </div>
  );
};

export default BurgerMenu;
