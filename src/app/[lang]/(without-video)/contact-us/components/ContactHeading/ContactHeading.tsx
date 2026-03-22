import {FC} from "react";

interface Props {
    dictionary: Record<string, string>;
}

const ContactHeading: FC<Props> = (props) => {
  return (
    <div className="flex flex-col sm:gap-4 gap-2 items-center justify-center">
      <h1 className="font-dejavuSans sm:text-[32px]/[40px] text-base/6">{props.dictionary['ᲡᲐᲙᲝᲜᲢᲐᲥᲢᲝ ᲤᲝᲠᲛᲐ']}</h1>
      <span className="text-[#D2AE6D] font-dejavuSans sm:text-2xl text-sm/4">
        {props.dictionary['ᲓᲐᲒᲕᲘᲙᲐᲕᲨᲘᲠᲓᲘᲗ']}
      </span>
    </div>
  );
};

export default ContactHeading;
