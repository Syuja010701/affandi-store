export default function FilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid sm:grid-cols-1 xl:grid-cols-4 gap-4 items-center my-2 ">
     {children}
    </div>
  );
}
