export default function Home() {
  return (
    <div>
      <h1>Environment: {process.env.VERCEL_ENV}</h1>
    </div>
  );
}
