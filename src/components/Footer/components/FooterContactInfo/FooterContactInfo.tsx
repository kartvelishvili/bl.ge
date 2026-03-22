import Image from "next/image";
import BoleroSecondLogo from "../../../../../public/icons/logo.svg";
import SocialLinks from "@/components/Footer/components/FooterContactInfo/components/SocialLinks/SocialLinks";
import ContactList from "@/components/Footer/components/FooterContactInfo/components/ContactList/ContactList";
import { FC } from "react";

interface Props {
  dictionary: Record<string, string>;
}

const FooterContactInfo: FC<Props> = (props) => {
  return (
    <div className="flex flex-col items-start justify-center gap-8">
      <Image
        src={BoleroSecondLogo}
        width={96}
        height={104}
        alt={"ბოლეროს ლოგო"}
      />
      <ContactList dictionary={props.dictionary} />
      <SocialLinks />
    </div>
  );
};

export default FooterContactInfo;
