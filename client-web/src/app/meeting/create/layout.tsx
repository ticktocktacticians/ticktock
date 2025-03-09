import { CreateMeetingProvider } from "./context";

export default function CreateMeetingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CreateMeetingProvider>{children}</CreateMeetingProvider>;
}
