import type { MessageSnapshot } from "./api";

type MessageFilters = {
  query: string;
  status: MessageSnapshot["status"] | "alle";
  priority: MessageSnapshot["priority"] | "alle";
  direction: MessageSnapshot["direction"] | "alle";
};

export function filterVisibleMessages(
  messages: MessageSnapshot[],
  filters: MessageFilters
) {
  const needle = filters.query.trim().toLowerCase();

  return [...messages]
    .filter((message) => {
      const matchesStatus =
        filters.status === "alle" || message.status === filters.status;
      const matchesPriority =
        filters.priority === "alle" || message.priority === filters.priority;
      const matchesDirection =
        filters.direction === "alle" || message.direction === filters.direction;
      const matchesQuery =
        needle.length === 0 ||
        [
          message.subject,
          message.body,
          message.senderLabel,
          message.recipientLabel,
          message.trackingNumber
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return matchesStatus && matchesPriority && matchesDirection && matchesQuery;
    })
    .sort((left, right) => right.messageTime.localeCompare(left.messageTime));
}

export function deriveMessageWorkflowSummary(messages: MessageSnapshot[]) {
  return {
    total: messages.length,
    inboxCount: messages.filter((message) => message.direction === "eingang").length,
    inProgressCount: messages.filter(
      (message) =>
        message.status === "in_bearbeitung" || message.status === "weitergeleitet"
    ).length,
    urgentCount: messages.filter((message) => message.priority === "sofort").length
  };
}
