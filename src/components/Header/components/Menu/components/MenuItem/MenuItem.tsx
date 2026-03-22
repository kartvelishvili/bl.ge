"use client";
import { IMenuItem } from "@/components/Header/components/Menu/utils/types/interfaces/menu-item.interface";
import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";

interface Props {
  content: string;
  href: string;
  locale: string
}

const MenuItem: FC<Props> = (props) => {
  const pathName = usePathname();
  const isActive = pathName.includes(props.href);

  return (
    <li>
      <Link
        href={`/${props.locale}${props.href}`}
        scroll={false}
        className={`font-notoSansGeoSemi font-feature-case-on ${isActive ? "text-[#D2AE6D]" : ""} sm:text-sm md:text-base hover:text-[#D2AE6D]`}
      >
        {props.content}
      </Link>
    </li>
  );
};

export default MenuItem;
