import { Sidebar } from "@/components/forge/sidebar";
import { PreviewSection } from "@/components/forge/preview-section";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans">
      <Sidebar />
      <PreviewSection />
    </div>
  );
}
