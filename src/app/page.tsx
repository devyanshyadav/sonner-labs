import { Sidebar } from "@/components/sonner-labs/sidebar";
import { PreviewSection } from "@/components/sonner-labs/preview-section";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans">
      <Sidebar />
      <PreviewSection />
    </div>
  );
}
