import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Nav from "@/components/nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Nav />
        <div className="flex-1 flex flex-col">
          <div className="p-2 md:hidden border-b">
            <SidebarTrigger />
          </div>
          <SidebarInset className="flex-1 w-full">
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
