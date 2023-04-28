import Header from "@/components/Header";

type Props = {
  children: React.ReactNode;
};

const links = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Contact", link: "/contact" },
];

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Header links={links} />
      {children}
    </>
  );
}
