import Image from "next/image";

export default function LogoMark({ size = 36, className = "" }) {
  return (
    <Image
      src="/images/brand/logo-tile.png"
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
      className={`block ${className}`}
    />
  );
}