import clsx from 'clsx';

type ErrorProps = {
  isMarginTop?: boolean;
};

function Error({ isMarginTop = true }: ErrorProps) {
  return (
    <div className={clsx(isMarginTop ? 'mt-8 md:mt-16' : '')}>
      <p className='text-center text-foreground'>An Error Occurred...</p>
    </div>
  );
}
export default Error;
