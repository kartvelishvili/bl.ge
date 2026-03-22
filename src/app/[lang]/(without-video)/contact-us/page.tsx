import ContactForm from "@/components/Footer/components/ContactForm/ContactForm";
import ContactList from "@/app/[lang]/(without-video)/contact-us/components/ContactList/ContactList";
import ContactHeading from "@/app/[lang]/(without-video)/contact-us/components/ContactHeading/ContactHeading";
import Image from "next/image";
import InstagramIcon from "../../../../../public/icons/instagram-icon-contact.svg";
import FacebookIcon from "../../../../../public/icons/facebook-icon-contact.svg";
import FacebookMessenger from "../../../../../public/icons/facebook-messenger-square.svg";
import {NextPage} from "next";
import {getDictionary} from "@/app/dictionaries/dictionaries";

const ContactUsPage: NextPage<{ params: any }> = async ({ params }) => {
  const { lang } = await params;
  const dictionary = await getDictionary(lang) as any;

  return (
    <div className="w-full flex justify-center sm:p-8 p-4 sm:pt-12 h-fit">
      <div className="w-full max-w-[1163px] flex flex-col justify-center items-center sm:gap-8 gap-4">
        <ContactHeading dictionary={dictionary} />
        <div className="flex items-start md:justify-between justify-center w-full flex-wrap content-center sm:gap-14 md:gap-0 gap-[48px]">
          <ContactForm dictionary={JSON.parse(JSON.stringify(dictionary))} />
          <div className="p-8 flex  items-start justify-center flex-col gap-10 bg-[#DADACE0D] rounded-3xl border-[#3D4145] border-[0.5px]  max-w-[400px]">
            <ContactList dictionary={dictionary} />
            <div className="flex flex-col items-start justify-center gap-4">
              <h3 className="font-notoSansGeo font-medium text-base/6">
                {dictionary['ᲓᲐᲒᲕᲘᲛᲔᲒᲝᲑᲠᲓᲘ']}
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/bolero_company"
                  target="_blank"
                >
                  <Image
                    width={24}
                    height={24}
                    src={InstagramIcon}
                    alt={"ინსტაგრამის აიქონი"}
                  />
                </a>
                <a href="https://www.facebook.com/boleroandco" target="_blank">
                  <Image
                    width={24}
                    height={24}
                    src={FacebookIcon}
                    alt={"ფეისბუქის აიქონი"}
                  />
                </a>
                <a target="_blank">
                  <Image
                    width={24}
                    height={24}
                    src={FacebookMessenger}
                    alt={"ფეისბუქ მესენჯერის აიქონი"}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
