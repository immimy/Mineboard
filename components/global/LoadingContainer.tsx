function LoadingContainer() {
  return (
    <div className='mt-8 md:mt-16'>
      <Loading />
    </div>
  );
}
export default LoadingContainer;

export function Loading() {
  return (
    <div
      aria-label='loading'
      className='mx-auto size-6 border-2 border-border border-b-border/30 rounded-full animate-spin'
    />
  );
}
