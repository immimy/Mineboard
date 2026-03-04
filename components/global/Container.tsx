type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  return <div className='px-8 mx-auto max-w-6xl xl:max-w-7xl'>{children}</div>;
}
export default Container;
