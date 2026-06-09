import clsx from 'clsx';

function LoadingContainer() {
  return (
    <div className='mt-8 md:mt-16'>
      <Loading />
    </div>
  );
}
export default LoadingContainer;

type LoadingProps = { size?: string };

export function Loading({ size = 'size-6' }: LoadingProps) {
  return (
    <div
      aria-label='loading'
      className={clsx(
        'mx-auto border-2 border-border border-b-border/30 rounded-full animate-spin',
        size,
      )}
    />
  );
}
