'use client'
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Logo from "../../../public/icons/logo.svg";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Header/components/Menu/Menu";
import {FC, useEffect, useState} from "react";
import LanguageSwitcher from "@/components/Header/components/LanguageSwitcher/LanguageSwitcher";
import BurgerMenuIcon from "../../../public/icons/burger-menu.svg";
import BurgerMenu from "@/components/Header/components/BurgerMenu/BurgerMenu";

interface Props {
  bgColor?: string;
  dictionary: Record<string, string>;
  lang: string;
}

const Header: FC<Props> = (props) => {
   const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
            const body = document.getElementsByTagName('body');
        if (isOpen) {
            body[0].style.overflow = 'hidden'
        } else {
            body[0].style.overflow = 'auto'
        }
    }, [isOpen]);

  return (
    <header>
      <BurgerMenu setIsOpen={setIsOpen} isOpen={isOpen} locale={props.lang} dictionaries={props.dictionary} />
      <ContentWrapper
        wrapperClasses={`h-[48px] sm:h-[64px] md:h-[117px] ${props.bgColor} absolute md:pt-0 py-2 z-20`}
        contentClasses="h-full flex items-center justify-between"
      >
        <Link href={`/${props.lang}`} scroll={false}>
          <Image
            src={Logo}
            alt={"Logo"}
            className="w-[30px] h-[32px] sm:w-[50px] sm:h-[56px] md:w-[53px] md:h-[78px]"
          />
        </Link>
        <Menu dictionary={props.dictionary} lang={props.lang} />
        <Image
          src={BurgerMenuIcon}
          alt={"Burger Menu Icon"}
          onClick={() => setIsOpen(true)}
          className="sm:hidden block cursor-pointer"
        />
        <LanguageSwitcher />
      </ContentWrapper>
    </header>
  );
};

export default Header;
