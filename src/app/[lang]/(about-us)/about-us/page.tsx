import ManagementTeam from "@/app/[lang]/(about-us)/about-us/components/ManagementTeam/ManagementTeam";
import Description from "@/app/[lang]/(about-us)/about-us/components/Description/Description";
import Blogs from "@/app/[lang]/(about-us)/about-us/components/Blogs/Blogs";
import { get } from "@/lib/api/get-function";
import { IManagementTeam } from "@/interfaces/management-team.interface";
import { IBlog } from "@/interfaces/blog.interface";
import { BlogTypeEnum } from "@/enums/blog-type.enum";
import { NextPage } from "next";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import TimeLine from "@/components/TimeLine/TimeLine";
import AboutUsTimelineBackground from "../../../../../public/images/about-us-timeline.png";

const AboutUsPage: NextPage<{ params: any }> = async ({ params }) => {
  const { lang } = await params;
  const managementTeam = await get<IManagementTeam[]>({
    url: "management-team",
  });
  const blogs = await get<IBlog[]>({
    url: "blogs",
    queryParameters: { type: BlogTypeEnum.AboutUs },
  });
  const dictionary = (await getDictionary(lang)) as any;

  return (
    <>
      <ManagementTeam
        data={managementTeam}
        locale={lang}
        dictionary={JSON.parse(JSON.stringify(dictionary))}
      />
      <div className="mt-[74px] sm:mt-[124px] md:mt-[204px]">
        <TimeLine backgroundImageUrl={AboutUsTimelineBackground.src} locale={lang} dictionary={JSON.parse(JSON.stringify(dictionary))} />
      </div>
      <Blogs
        dictionary={JSON.parse(JSON.stringify(dictionary))}
        data={blogs}
        locale={lang}
      />
    </>
  );
};

export default AboutUsPage;
