import { MENU_ITEMS } from "@/components/Header/components/Menu/utils/menu-items";
import MenuItem from "@/components/Header/components/Menu/components/MenuItem/MenuItem";
import Image from "next/image";
import BurgerMenuIcon from "../../../../../public/icons/burger-menu.svg";
import { FC } from "react";

interface Props {
  dictionary: Record<string, string>;
  lang: string;
}

const Menu: FC<Props> = (props) => {
  return (
    <>
      <ul className="items-center justify-center lg:gap-14 md:gap-10 sm:gap-8 hidden sm:flex">
        {MENU_ITEMS.map((item) => (
          <MenuItem
            href={item.href}
            content={props.dictionary[item.content]}
            key={item.href}
            locale={props.lang}
          />
        ))}
      </ul>
    </>
  );
};

export default Menu;
