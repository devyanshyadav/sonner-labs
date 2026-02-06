import { Sidebar } from "@/components/forge/Sidebar";
import { PreviewSection } from "@/components/forge/PreviewSection";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-hidden font-sans">
      <Sidebar />
      <PreviewSection />
    </div>
  );
}
