import { asset } from "@/lib/content";
/** Official logo geometry, cached once. Dark variant changes neutral ink only. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`official-logo ${className}`} aria-hidden="true">
      <img
        className="brand-logo-light"
        src={asset("/brand/logo.svg")}
        width={172}
        height={45}
        alt=""
      />
      <img
        className="brand-logo-dark"
        src={asset("/brand/logo-dark.svg")}
        width={172}
        height={45}
        alt=""
      />
    </span>
  );
}
