"use client";
import { usePlannerStore } from "@/stores/plannerStore";
import { TierIcon } from "./TierIcon";
import { TierBadge } from "./TierBadge";
import { SectionLabel } from "./SectionLabel";
import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FocusItem } from "@/types/planner";

const SLOT_CONFIG = [
  { rank: 1 as const, tier: "boss" as const, placeholder: "Set your boss task — the hardest thing today" },
  { rank: 2 as const, tier: "elite" as const, placeholder: "Elite task #1" },
  { rank: 3 as const, tier: "elite" as const, placeholder: "Elite task #2" },
];

const TIER_STYLES = {
  boss:  { bg: "#1C0A0A", border: "#3D1515", accent: "#E8423F", text: "#E8E6DF" },
  elite: { bg: "#1A1208", border: "#3A2A10", accent: "#D4952B", text: "#B0AEA6" },
};

const HOURS = Array.from({ length: 16 }, (_, i) => i + 8);
function formatHour(h: number) {
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

function SortableItem({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: FocusItem;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);
  const [glowing, setGlowing] = useState(false);
  const prevCompleted = useRef(item.completed);
  const s = TIER_STYLES[item.tier];

  // Trigger boss glow when item transitions to completed
  useEffect(() => {
    if (!prevCompleted.current && item.completed && item.tier === "boss") {
      setGlowing(true);
      const t = setTimeout(() => setGlowing(false), 950);
      return () => clearTimeout(t);
    }
    prevCompleted.current = item.completed;
  }, [item.completed, item.tier]);

  const commit = () => {
    if (draft.trim()) onEdit(item.id, draft.trim());
    else setDraft(item.text);
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={glowing ? "boss-glow" : ""}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : item.completed ? 0.45 : 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 14px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderLeft: `3px solid ${item.completed ? s.accent + "55" : s.accent}`,
        borderRadius: "0 6px 6px 0",
      }}
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        style={{ cursor: isDragging ? "grabbing" : "grab", color: "#3A3A36", fontSize: 14, lineHeight: 1, flexShrink: 0, touchAction: "none" }}
      >
        ⠿
      </span>

      {/* Checkbox */}
      <span
        onClick={() => onToggle(item.id)}
        style={{
          width: 16,
          height: 16,
          borderRadius: 3,
          flexShrink: 0,
          cursor: "pointer",
          border: item.completed ? `1.5px solid ${s.accent}55` : `1.5px solid ${s.accent}88`,
          background: item.completed ? s.accent + "22" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: s.accent,
          fontSize: 10,
          transition: "all 0.2s",
        }}
      >
        {item.completed ? "✓" : ""}
      </span>

      <TierIcon tier={item.tier} size={15} />

      {editing && !item.completed ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setDraft(item.text); setEditing(false); }
          }}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: s.text, fontSize: 14, fontFamily: "inherit" }}
        />
      ) : (
        <span
          onClick={() => { if (!item.completed) { setDraft(item.text); setEditing(true); } }}
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: item.tier === "boss" ? 500 : 400,
            color: s.text,
            cursor: item.completed ? "default" : "text",
            textDecoration: item.completed ? "line-through" : "none",
          }}
        >
          {item.text}
        </span>
      )}

      <TierBadge tier={item.tier} />

      <button
        onClick={() => onDelete(item.id)}
        style={{ background: "transparent", border: "none", color: "#3A3A36", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
        title="Remove"
      >
        ×
      </button>
    </div>
  );
}

export function QuestLine() {
  const { focusItems, updateFocusItem, setFocusItems, toggleFocusItem, addFocusItem } = usePlannerStore();
  const [adding, setAdding] = useState<{ rank: 1 | 2 | 3; tier: "boss" | "elite" } | null>(null);
  const [draft, setDraft] = useState("");
  const [scheduleHour, setScheduleHour] = useState<number | "">("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filledSlots = new Set(focusItems.map((f) => f.rank));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = focusItems.findIndex((f) => f.id === active.id);
    const newIndex = focusItems.findIndex((f) => f.id === over.id);
    const reordered = arrayMove(focusItems, oldIndex, newIndex).map((f, i) => ({
      ...f,
      rank: SLOT_CONFIG[Math.min(i, 2)].rank,
      tier: SLOT_CONFIG[Math.min(i, 2)].tier,
    }));
    setFocusItems(reordered);
  };

  const commitAdd = () => {
    if (!draft.trim() || !adding) return;
    const newItem: FocusItem = {
      id: `q${Date.now()}`,
      rank: adding.rank,
      tier: adding.tier,
      text: draft.trim(),
      completed: false,
      scheduledHour: scheduleHour !== "" ? scheduleHour : undefined,
      durationMinutes: scheduleHour !== "" ? 60 : undefined,
    };
    addFocusItem(newItem);
    setAdding(null);
    setDraft("");
    setScheduleHour("");
  };

  const deleteItem = (id: string) => {
    setFocusItems(focusItems.filter((f) => f.id !== id));
  };

  return (
    <section>
      <SectionLabel text="Quest line" />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={focusItems.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Filled items */}
            {[...focusItems].sort((a, b) => a.rank - b.rank).map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onEdit={(id, text) => updateFocusItem(id, { text })}
                onDelete={deleteItem}
                onToggle={toggleFocusItem}
              />
            ))}

            {/* Empty slot prompts */}
            {SLOT_CONFIG.filter((s) => !filledSlots.has(s.rank)).map((slot) => {
              const s = TIER_STYLES[slot.tier];
              const isAdding = adding?.rank === slot.rank;
              return (
                <div
                  key={slot.rank}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: "11px 14px",
                    background: "transparent",
                    border: `1px dashed ${s.border}`,
                    borderLeft: `3px solid ${s.accent}44`,
                    borderRadius: "0 6px 6px 0",
                    cursor: isAdding ? "default" : "text",
                  }}
                  onClick={() => { if (!isAdding) { setAdding(slot); setDraft(""); setScheduleHour(""); } }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <TierIcon tier={slot.tier} size={15} />
                    {isAdding ? (
                      <input
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={() => { if (draft.trim()) commitAdd(); else setAdding(null); }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitAdd();
                          if (e.key === "Escape") setAdding(null);
                        }}
                        placeholder={slot.placeholder}
                        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: s.text, fontSize: 14, fontFamily: "inherit" }}
                      />
                    ) : (
                      <span style={{ flex: 1, fontSize: 13, color: "#3A3A36" }}>{slot.placeholder}</span>
                    )}
                    <TierBadge tier={slot.tier} />
                  </div>

                  {/* Optional schedule hour when adding */}
                  {isAdding && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 25 }}>
                      <span style={{ fontSize: 11, color: "#4A4A46", fontFamily: "'Poppins', sans-serif" }}>Schedule at</span>
                      <select
                        value={scheduleHour}
                        onChange={(e) => setScheduleHour(e.target.value === "" ? "" : Number(e.target.value))}
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{ background: "#0C0C0B", border: "1px solid #1E1E1C", borderRadius: 3, padding: "3px 6px", color: "#6B6A65", fontSize: 11, fontFamily: "'Poppins', sans-serif", outline: "none" }}
                      >
                        <option value="">— none —</option>
                        {HOURS.map((h) => <option key={h} value={h}>{formatHour(h)}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
