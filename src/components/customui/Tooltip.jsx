/* eslint-disable react/prop-types */
const classNames = (...classes) => classes.filter(Boolean).join(" ");

const Tooltip = ({ position, content, children,TooltipStyle,style }) => {
    return (
        <>
        <div className="relative cursor-pointer group">{children}
            <span
            style={style}
            className={classNames(
                        `absolute rounded-full px-3 py-1 text-sm font-semibold z-10`,
                        TooltipStyle
                        ,
                        position === "top"
                          ? "bottom-[100%] -left-1/2 mb-2 invisible opacity-20 translate-y-3 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
                          : "",
                        position === "bottom"
                          ? "top-[100%] -left-1/2 mt-2 invisible opacity-20 -translate-y-3 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
                          : "",
                        position === "left"
                          ? "top-0 right-[100%] mr-2 invisible opacity-20 translate-x-3 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
                          : "",
                        position === "right"
                          ? "top-0 left-[100%] ml-2 invisible opacity-20 -translate-x-3 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
                          : ""
                      )}
             >
                {content}
            </span>
        </div>
        </>
    )
}


export default Tooltip