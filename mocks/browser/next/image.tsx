export default function Image({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element -- test stub replacing next/image, plain img is intentional
  return <img src={src} alt={alt} {...props} />;
}
