import { cn } from '@/icons/icons';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('px-8 mx-auto max-w-6xl xl:max-w-7xl', className)}>
      {children}
    </div>
  );
}
export default Container;
