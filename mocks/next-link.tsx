import { AnchorHTMLAttributes, forwardRef } from 'react';

const NextLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>(({ href, children, ...props }, ref) => (
  <a ref={ref} href={href} {...props}>
    {children}
  </a>
));

NextLink.displayName = 'Link';
export default NextLink;
