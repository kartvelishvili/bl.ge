import LocationFooterIcon from "../../../../../../../public/icons/location-footer.svg";
import MailFooterIcon from "../../../../../../../public/icons/email-footer.svg";
import PhoneFooterIcon from "../../../../../../../public/icons/phone-footer.svg";
import ContactListItem from "@/components/Footer/components/FooterContactInfo/components/ContactList/components/ContactListItem";
import {FC} from "react";

interface Props {
    dictionary: Record<string, string>
}

const ContactList: FC<Props> = (props) => {
  return (
    <ul className="flex flex-col gap-6 justify-center items-start">
      <ContactListItem
        icon={{ src: LocationFooterIcon, alt: "ლოკაციის აიქონი" }}
        href="https://maps.app.goo.gl/7ZhKB4jKDwp4pPf19"
        text={props.dictionary['ᲗᲑᲘᲚᲘᲡᲘ, ᲛᲐᲠᲨᲐᲚ ᲒᲔᲚᲝᲕᲐᲜᲘᲡ ᲒᲐᲛᲖᲘᲠᲘ № 13']}
      />
      <ContactListItem
        icon={{ src: MailFooterIcon, alt: 'მეილის აიქონი' }}
        href="mailto:info@bolero.ge"
        text="info@bolero.ge"
      />
      <ContactListItem
        icon={{ src: PhoneFooterIcon, alt: "ტელეფონის აიქონი" }}
        href="tel:322433322"
        text="(+995) 322433322"
      />
    </ul>
  );
};

export default ContactList;
