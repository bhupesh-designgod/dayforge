"use client";
import { usePlannerStore } from "@/stores/plannerStore";
import { TierIcon } from "./TierIcon";
import { useState } from "react";
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
import type { Task } from "@/types/planner";

function SortableTask({ task, onToggle, onDelete }: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, disabled: task.completed });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 2px",
      }}
    >
      {!task.completed && (
        <span
          {...attributes}
          {...listeners}
          style={{ cursor: isDragging ? "grabbing" : "grab", color: "#2A2A28", fontSize: 13, flexShrink: 0, touchAction: "none" }}
        >
          ⠿
        </span>
      )}
      {task.completed && <span style={{ width: 13, flexShrink: 0 }} />}

      {/* Checkbox */}
      <span
        onClick={() => onToggle(task.id)}
        style={{
          width: 16, height: 16, borderRadius: 3, flexShrink: 0, cursor: "pointer",
          border: task.completed ? "1.5px solid #2A2A28" : "1.5px solid #3A3A36",
          background: task.completed ? "#1A1A18" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#4A4A46", fontSize: 10, transition: "all 0.2s",
        }}
      >
        {task.completed ? "✓" : ""}
      </span>

      <TierIcon tier="minion" size={10} />

      <span
        style={{
          flex: 1, fontSize: 13, cursor: "pointer",
          color: task.completed ? "#3A3A36" : "#B0AEA6",
          textDecoration: task.completed ? "line-through" : "none",
        }}
        onClick={() => onToggle(task.id)}
      >
        {task.text}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        style={{ background: "transparent", border: "none", color: "#2A2A28", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
      >
        ×
      </button>
    </div>
  );
}

export function MinionSweep() {
  const { tasks, toggleTask, addTask, removeTask, setTasks } = usePlannerStore();
  const [newTask, setNewTask] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const uncompleted = tasks.filter((t) => !t.completed).sort((a, b) => a.sort_order - b.sort_order);
  const completed = tasks.filter((t) => t.completed);
  const sweepCount = `${completed.length}/${tasks.length} swept`;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = uncompleted.findIndex((t) => t.id === active.id);
    const newIndex = uncompleted.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(uncompleted, oldIndex, newIndex).map((t, i) => ({ ...t, sort_order: i }));
    setTasks([...reordered, ...completed]);
  };

  const submit = () => {
    if (!newTask.trim()) return;
    addTask({ id: `t${Date.now()}`, text: newTask.trim(), completed: false, sort_order: tasks.length });
    setNewTask("");
  };

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 11, fontFamily: "'Poppins', sans-serif", color: "#4A4A46", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Minion sweep
        </p>
        {tasks.length > 0 && (
          <span style={{ fontSize: 11, fontFamily: "'Poppins', sans-serif", color: completed.length === tasks.length ? "#4A9E6B" : "#4A4A46", letterSpacing: "0.04em" }}>
            {sweepCount}
          </span>
        )}
      </div>
      <div style={{ background: "#141413", border: "1px solid #1E1E1C", borderRadius: 6, padding: "14px 16px" }}>
        {tasks.length === 0 && (
          <p style={{ fontSize: 12, color: "#2A2A28", fontFamily: "'Poppins', sans-serif", margin: "0 0 10px", textAlign: "center" }}>
            No minions spawned yet
          </p>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={uncompleted.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {uncompleted.map((t) => (
              <SortableTask key={t.id} task={t} onToggle={toggleTask} onDelete={removeTask} />
            ))}
          </SortableContext>
        </DndContext>

        {completed.map((t) => (
          <SortableTask key={t.id} task={t} onToggle={toggleTask} onDelete={removeTask} />
        ))}

        <div style={{ display: "flex", gap: 8, marginTop: tasks.length > 0 ? 10 : 0 }}>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="spawn minion…"
            style={{ flex: 1, background: "#0C0C0B", border: "1px solid #1E1E1C", borderRadius: 4, padding: "8px 12px", color: "#B0AEA6", fontSize: 12, outline: "none", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" }}
          />
          <button
            onClick={submit}
            style={{ background: "#1E1E1C", border: "1px solid #2A2A28", borderRadius: 4, color: "#6B6A65", fontSize: 18, cursor: "pointer", padding: "0 12px", lineHeight: 1 }}
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
}
