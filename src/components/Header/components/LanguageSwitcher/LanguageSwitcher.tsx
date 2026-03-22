"use client";
import { FC, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

const LANGUAGE_ITEMS = {
  ge: "GE",
  ru: "RU",
  en: "EN",
};

interface Props {
  hiddenOnMobile?: boolean;
}

const LanguageSwitcher: FC<Props> = (props) => {
  const hiddenOnMobile =
    typeof props?.hiddenOnMobile !== "undefined" ? props?.hiddenOnMobile : true;

  const { lang } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGE_ITEMS["ge"]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleLanguageChange = (newLanguage: "ge" | "ru" | "en") => {
    const newPath = pathname.replace(`/${lang}`, `/${newLanguage}`);
    router.push(newPath, { scroll: false });
    setCurrentLanguage(LANGUAGE_ITEMS[newLanguage]);
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    if (lang && (LANGUAGE_ITEMS as any)[lang as string]) {
      setCurrentLanguage((LANGUAGE_ITEMS as any)[lang as string]);
    }
  }, [lang]);

  return (
    <div
      className={`relative ${hiddenOnMobile ? "md:inline-block hidden" : "inline-block"}`}
      onMouseEnter={() => setIsDropdownVisible(true)}
      onMouseLeave={() => setIsDropdownVisible(false)}
    >
      <span
        onClick={toggleDropdown}
        className="font-dejavuSans block cursor-pointer"
      >
        {currentLanguage}
      </span>
      <div
        className={`absolute w-[100px] ${isDropdownVisible ? "block" : "hidden"}`}
      >
        {Object.entries(LANGUAGE_ITEMS).map(([key, label]) => {
          return (
            currentLanguage !== (LANGUAGE_ITEMS as any)[key] && (
              <span
                key={key}
                onClick={() => handleLanguageChange(key as "ge" | "ru" | "en")}
                className={`font-dejavuSans block cursor-pointer ${currentLanguage === label ? "text-bold" : ""}`}
              >
                {label}
              </span>
            )
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
