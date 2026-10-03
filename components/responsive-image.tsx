import { asset } from "@/lib/content";
const variants: Record<
  string,
  { width: number; height: number; webp: number[]; avif?: boolean }
> = {
  gaomiao: { width: 1920, height: 959, webp: [640, 960], avif: true },
  reception: { width: 1600, height: 900, webp: [640, 960], avif: true },
  potala: { width: 1400, height: 673, webp: [640, 960], avif: true },
  liye: { width: 1080, height: 651, webp: [640, 960], avif: true },
  "liye-cinema": { width: 1080, height: 659, webp: [640, 960], avif: true },
  "liye-details": { width: 1080, height: 764, webp: [640] },
  "cultural-study": { width: 1536, height: 1024, webp: [640, 960], avif: true },
};
export function ResponsiveImage({
  name,
  alt,
  priority = false,
  sizes = "(max-width:767px) 100vw,65vw",
  className = "",
}: {
  name: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const v = variants[name];
  return (
    <picture className={className}>
      {name === "gaomiao" && sizes === "100vw" && (
        <source
          srcSet={asset("/brand/gaomiao-portrait.avif")}
          type="image/avif"
          media="(max-width:767px)"
        />
      )}
      {v?.avif && (
        <source
          srcSet={asset("/brand/" + name + ".avif")}
          type="image/avif"
          media="(min-width:1280px)"
        />
      )}
      <img
        src={asset("/brand/" + name + ".webp")}
        srcSet={
          v
            ? [
                ...v.webp.map(
                  (w) =>
                    asset("/brand/" + name + "-" + w + ".webp") + " " + w + "w",
                ),
                asset("/brand/" + name + ".webp") + " " + v.width + "w",
              ].join(", ")
            : undefined
        }
        sizes={
          sizes === "100vw" && v
            ? `(max-width:767px) ${Math.ceil((v.width / v.height) * 100)}svh, 100vw`
            : sizes
        }
        width={v?.width || 1080}
        height={v?.height || 720}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
