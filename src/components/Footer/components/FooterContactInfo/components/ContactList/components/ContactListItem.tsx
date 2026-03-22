import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { FC } from "react";

interface Props {
  icon: {
    src: StaticImport;
    alt: string;
  };
  href: string;
  target?: string;
  text: string;
}

const ContactListItem: FC<Props> = (props) => {
  return (
    <li>
      <div className="flex items-center justify-center gap-3">
        <Image src={props.icon.src} alt={props.icon.alt} />
        <a
          className="font-dejavuSans text-base/6"
          href={props.href}
          target={props.target || '"_blank"'}
        >
          {props.text}
        </a>
      </div>
    </li>
  );
};

export default ContactListItem;
