export default function Image({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={src} alt={alt} {...props} />;
}
