import Image from "next/image";
import LocationIcon from "../../../../../../../../../public/icons/contact-location.svg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { FC } from "react";

interface Props {
  image: {
    src: StaticImport;
    alt: string;
  };
  text: string;
  link: {
    href: string;
    content: string;
  };
}

const ContactListItem: FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-4 items-start justify-center">
      <Image
        src={props.image.src}
        alt={props.image.alt}
        width={40}
        height={40}
      />
      <div className="flex flex-col gap-2 items-start justify-center">
        <h3 className="font-notoSansGeo text-base/[22px] font-medium text-white">
          {props.text}
        </h3>
        <a
          href={props.link.href}
          target='_blank'
          className="font-notoSansGeo font-semibold text-base/[22px] text-[#D2AE6D] underline"
        >
          {props.link.content}
        </a>
      </div>
    </div>
  );
};

export default ContactListItem;
