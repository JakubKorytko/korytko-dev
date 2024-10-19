import Image from 'next/image';

export default function Home() {
  return (
    <main>
      <h1>Hello world!</h1>
      <Image src="/dog_hi.jpg" alt="Dog" width={180} height={50} priority />
    </main>
  );
}
