import Image from "next/image";
import Link from "next/link";
import {IBlog} from "@/interfaces/blog.interface";
import {FC} from "react";
import {LocaleType} from "@/types/locale.type";
import dayjs from "dayjs";
import 'dayjs/locale/ka'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'


interface Props {
  data: IBlog;
  locale: LocaleType;
  dictionary: Record<string, string>
}

const BlogCard: FC<Props> = (props) => {
  let t = 'წ';

  if (props.locale === 'en') {
    t = 'yr.';
  } else if (props.locale === 'ru') {
    t = 'г.';
  }

  return (
    <div className="max-w-[686px] flex-shrink w-full flex flex-col bg-[#171B1F] rounded-xl border border-[#5D5F62]">
      <Image src={props.data.file.url} width={684} height={347} className='md:h-[347px] rounded-t-xl  sm:h-[347px]  h-[347px]' alt={"Blog Test Image"} style={{ width: 'auto' }} />
      <div className="px-2 sm:px-3 md:px-4 pb-4 pt-4 md:pt-8 flex flex-col gap-4">
        <div className="flex items-start justify-center sm:items-start sm:justify-between w-full flex-col sm:flex-row">
          <h2 className="font-notoSansGeo font-semibold md:text-[20px] sm:text-base text-sm">
            {props.data.title[props.locale]}
          </h2>
          <span className="text-[#D2AE6D] md:text-base text-sm font-notoSansGeo whitespace-nowrap">
            {dayjs(props.data.createdAt).locale(props.locale).format(`DD MMMM YYYY ${t}`)}
          </span>
        </div>
        <p className="font-dejavuSans text-xs md:text-base line-clamp-3">
          { props.data.description[props.locale] }
        </p>
        <Link
          href={`/${props.locale}/blogs/${props.data.id}`}
          className="py-2 px-4 font-dejavuSans font-extralight text-base bg-[#DADBCE0D] rounded-lg w-fit self-end hover:bg-[#d2ae6d1a]"
        >
          {props.dictionary['ᲡᲠᲣᲚᲐᲓ ᲜᲐᲮᲕᲐ']}
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
