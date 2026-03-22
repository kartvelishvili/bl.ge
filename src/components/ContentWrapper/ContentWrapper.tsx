import { CSSProperties, FC, ReactNode, ForwardedRef, forwardRef } from "react";

interface Props {
    children: ReactNode;
    wrapperClasses?: string;
    contentClasses?: string;
    wrapperClassesInline?: CSSProperties;
    ref?: ForwardedRef<HTMLDivElement>;
}

const ContentWrapper: FC<Props> = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div
            className={`${props.wrapperClasses} w-full flex items-center justify-center sm:px-8 px-4`}
            style={props.wrapperClassesInline}
            ref={ref}
        >
            <div className={`max-w-[1392px] w-full h-full ${props.contentClasses}`}>
                {props.children}
            </div>
        </div>
    );
});

export default ContentWrapper;
