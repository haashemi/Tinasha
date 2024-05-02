import { Status } from "@/api";

export const getStatusColor = (status: Status | null | undefined) =>
  status === "watching"
    ? "#22c55e"
    : status === "completed"
      ? "#3b82f6"
      : status === "on_hold"
        ? "#eab308"
        : status === "dropped"
          ? "#ef4444"
          : status === "plan_to_watch"
            ? "#78716c"
            : "#6b7280";
