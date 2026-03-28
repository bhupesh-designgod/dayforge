import { Header } from "@/components/planner/Header";
import { QuestLine } from "@/components/planner/QuestLine";
import { BattleSchedule } from "@/components/planner/BattleSchedule";
import { MinionSweep } from "@/components/planner/MinionSweep";
import { FocusTimer } from "@/components/planner/FocusTimer";
import { BattleLog } from "@/components/planner/BattleLog";
import { SideQuests } from "@/components/planner/SideQuests";

export default function PlannerPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0C0C0B",
        color: "#E8E6DF",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Top accent line */}
      <div style={{ height: 2, background: "linear-gradient(90deg, #E8423F 0%, #D4952B 40%, #2A2A28 100%)" }} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <Header />

        {/* Two-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <QuestLine />
            <BattleSchedule />
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 24 }}>
            <MinionSweep />
            <FocusTimer />
            <BattleLog />
            <SideQuests />
          </div>
        </div>
      </div>
    </div>
  );
}
