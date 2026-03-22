import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  dictionary: Record<string, string>;
}

const Copyright: FC<Props> = (props) => {
  const date = new Date;
  const year = date.getFullYear();

  return (
    <div className="flex items-center justify-center flex-col sm:flex-row gap-6 sm:gap-0 sm:justify-between font-dejavuSans md:text-base/[24px] w-full sm:text-sm text-xs text-[rgba(255,255,255,0.5)] text-center sm:text-left">
        © 2015-{year}  {props.dictionary['შ.პ.ს. "Bolero & Co". ყველა უფლება დაცულია.']}
        <div className='flex items-center justify-center gap-2'>
          <span className='font-dejavuSans text-base text-[rgba(255, 255, 255, 0.7)]'>Created by</span>
          <Link  target='_blank' href={'https://smarketer.ge'} className='flex items-center justify-center gap-1'>
            <Image alt={'icon'} src={'/icons/smarketer.svg'} width={24} height={24} />
            <span className='font-notoSansGeo text-base font-semibold'>ᲡᲛᲐᲠᲙᲔᲢᲔᲠᲘ</span>
          </Link>
        </div>
    </div>
  );
};

export default Copyright;
