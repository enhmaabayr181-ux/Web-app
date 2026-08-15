import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { useProjectStore } from "../../store/useProjectStore";
import { StudioPanel } from "../studio/StudioPanel";
import { FramesPanel } from "../frames/FramesPanel";
import { TimelinePanel } from "../timeline/TimelinePanel";
import { SubtitlePanel } from "../subtitle/SubtitlePanel";
import { CaptionPanel } from "../caption/CaptionPanel";

export function AppShell() {
  const activeTab = useProjectStore((s) => s.activeTab);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header />
        <main className="flex-1 px-4 sm:px-6 pb-28 lg:pb-10 pt-2 max-w-5xl w-full mx-auto lg:mx-0">
          <div key={activeTab} className="animate-fade-up">
            {activeTab === "studio" && <StudioPanel />}
            {activeTab === "frames" && <FramesPanel />}
            {activeTab === "timeline" && <TimelinePanel />}
            {activeTab === "subtitle" && <SubtitlePanel />}
            {activeTab === "caption" && <CaptionPanel />}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
