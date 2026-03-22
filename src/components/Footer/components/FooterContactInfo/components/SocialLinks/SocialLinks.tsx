import Image from "next/image";
import InstagramIcon from "../../../../../../../public/icons/instagram-icon-v2.svg";
import FacebookIcon from "../../../../../../../public/icons/facebook-icon-v2.svg";

const SocialLinks = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <a href="https://www.facebook.com/boleroandco" target="_blank" className='w-6 h-6 flex items-center justify-center rounded-[50%] border-[1.5px] border-[#5E6164]'>
        <Image src={FacebookIcon} width={6} height={12} alt={"Facebook Icon"} />
      </a>
        <a href="https://www.instagram.com/bolero_company" target="_blank" className='w-6 h-6 flex items-center justify-center rounded-[50%] border-[1.5px] border-[#5E6164]'>
        <Image src={InstagramIcon} width={12} height={12} alt={"Instagram Icon"} />
      </a>
    </div>
  );
};

export default SocialLinks;
