import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import BlogCard from "@/app/[lang]/(without-video)/blogs/components/BlogCard/BlogCard";
import { get } from "@/lib/api/get-function";
import { IBlog } from "@/interfaces/blog.interface";
import { BlogTypeEnum } from "@/enums/blog-type.enum";
import {FC} from "react";
import {getDictionary} from "@/app/dictionaries/dictionaries";

const BlogsPage: FC<{ params: any }> = async ({ params }) => {
    const { lang } = await params;
    const dictionary = await getDictionary(lang) as any;
  const blogs = await get<IBlog[]>({
    url: "blogs",
    queryParameters: { type: BlogTypeEnum.Normal, visibleOnHome: 'false' },
  });
  return (
    <ContentWrapper contentClasses="flex flex-col gap-8 items-center justify-center pt-16">
      <h1 className="font-notoSansGeo font-semibold md:text-3xl sm:text-2xl text-base">
          {dictionary['ᲡᲘᲐᲮᲚᲔᲔᲑᲘ']}
      </h1>
      <div className="md:grid grid-cols-2 flex flex-wrap gap-x-5 gap-y-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} data={blog} locale={lang} dictionary={dictionary} />
        ))}
      </div>
    </ContentWrapper>
  );
};

export default BlogsPage;
