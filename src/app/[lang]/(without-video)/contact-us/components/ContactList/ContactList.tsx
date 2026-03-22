import ContactListItem from "./components/ContactListItem/ContactListItem";
import MailIcon from "../../../../../../../public/icons/contact-mail.svg";
import PhoneIcon from "../../../../../../../public/icons/contact-phone.svg";
import LocationIcon from "../../../../../../../public/icons/contact-location.svg";
import {FC} from "react";

interface Props {
    dictionary: Record<string, string>
}

const ContactList: FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-10 items-start justify-center">
      <ContactListItem
        image={{ src: LocationIcon, alt: "ლოკაციის აიქონი" }}
        text={props.dictionary['ᲒᲕᲔᲡᲢᲣᲛᲠᲔᲗ']}
        link={{
          href: "https://maps.app.goo.gl/7ZhKB4jKDwp4pPf19",
          content: props.dictionary['ᲗᲑᲘᲚᲘᲡᲘ, ᲛᲐᲠᲨᲐᲚ ᲒᲔᲚᲝᲕᲐᲜᲘᲡ ᲒᲐᲛᲖᲘᲠᲘ № 13'],
        }}
      />
      <ContactListItem
        image={{ src: MailIcon, alt: "მეილის აიქონი" }}
        text={props.dictionary['ᲩᲕᲔᲜᲘ ᲒᲣᲜᲓᲘ ᲐᲥ ᲐᲠᲘᲡ ᲓᲐᲡᲐᲮᲛᲐᲠᲔᲑᲚᲐᲓ']}
        link={{
          href: "mailto:info@bolero.ge",
          content: "INFO@BOLERO.GE",
        }}
      />
      <ContactListItem
        image={{ src: PhoneIcon, alt: "ტელეფონის აიქონი" }}
        text={props.dictionary['ᲝᲠᲨᲐᲑᲐᲗᲘ-ᲞᲐᲠᲐᲡᲙᲔᲕᲘ (10 ᲡᲗ - 6 ᲡᲗ)']}
        link={{ href: "tel:+995 32 243 33 22", content: "+995 32 243 33 22" }}
      />
    </div>
  );
};

export default ContactList;
