import { clsx } from "clsx";
import { Image } from "~/components/ui/image";

export function BookCover({
  image,
  alt,
  scale = 1,
}: {
  image: string;
  alt: string;
  scale?: number;
}) {
  // We apply the scale to the container so image and shadows scale together.
  const scaleClass = scale === 1 ? "" : `scale-[${scale}]`;
  const wrapperClasses = clsx(["break-inside-avoid"]);

  return (
    <div className={wrapperClasses}>
      <div
        className='relative'
        style={{ transform: scale === 1 ? undefined : `scale(${scale})` }}>
        <div
          className={clsx([
            "absolute top-[3px] bottom-1 left-3 w-11/12",
            "shadow-book-pages rounded-r-md bg-white",
            "border border-[gray]",
          ])}
        />
        <div
          className={clsx([
            "relative rounded-r-md leading-[0]",
            "transition-all duration-300 ease-in-out",
            "[transform:perspective(2000px)_rotateY(-15deg)_translateX(-10px)_scaleX(0.94)]",
            "[box-shadow:6px_6px_18px_-2px_rgba(0,0,0,0.2),24px_28px_40px_-6px_rgba(0,0,0,0.1)]",
            "hover:transform-3d",
            "hover:[transform:perspective(2000px)_rotateY(0deg)_translateX(0px)_scaleX(1)]",
            "hover:[box-shadow:6px_6px_12px_-1px_rgba(0,0,0,0.1),20px_14px_16px_-6px_rgba(0,0,0,0.1)]",
          ])}>
          <Image
            src={image}
            alt={alt}
            width={1000}
            height={1500}
            className='w-full rounded-r-md'
          />
          <div
            className={clsx([
              "ml-4 h-full w-5",
              "absolute top-0 z-5",
              "border-l-2 border-l-[#00000010]",
              "bg-[linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)]",
            ])}
          />
          <div
            className={clsx([
              "absolute top-0 right-0 z-4",
              "h-full w-[90%] rounded-[3px] opacity-10",
              "bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_100%)]",
            ])}
          />
        </div>
      </div>
    </div>
  );
}
