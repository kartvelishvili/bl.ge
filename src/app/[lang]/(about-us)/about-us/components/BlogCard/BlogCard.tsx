import Link from "next/link";
import { IBlog } from "@/interfaces/blog.interface";
import {FC} from "react";
import {LocaleType} from "@/types/locale.type";
import Image from "next/image";

interface Props {
  data: IBlog;
  locale: LocaleType;
  dictionary: Record<string, string>
}

const BlogCard: FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-6 md:w-[452px] w-[353px]">
      <Image width={452} height={448} className='md:w-[452px] md:h-[448px] w-[353px] h-[350px]' src={props.data.file.url} alt={"Test Image"} style={{ width: 'auto', height: 'auto' }} />
      <div className="flex flex-col items-start justify-center gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-dejavuSans text-2xl/8 text-[#BBAA58]">
            {props.data.title[props.locale]}
          </h3>
          <p className="font-dejavuSans text-base/8 line-clamp-3">
            {props.data.description[props.locale]}
          </p>
        </div>

        <Link
          href={`/${props.locale}/about-us/${props.data.id}`}
          className="py-2 px-4 font-dejavuSans font-extralight text-base bg-[#DADBCE0D] rounded-lg w-fit self-start hover:bg-[#d2ae6d1a]"
        >
          {props.dictionary['ᲡᲠᲣᲚᲐᲓ ᲜᲐᲮᲕᲐ']}
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
