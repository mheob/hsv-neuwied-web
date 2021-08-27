type HomeProps = { whatEver?: string };

export default function Home({ whatEver }: HomeProps): JSX.Element {
  return (
    <div>
      <h1>Hello Next.js 👋</h1>
      {whatEver && <p>{whatEver}</p>}
    </div>
  );
}
