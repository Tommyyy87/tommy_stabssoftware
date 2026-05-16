import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import {
  CreateMessageInput,
  MESSAGE_STORE,
  MessageChannel,
  MessagePriority,
  MessageStatus,
  MessageStore,
  UpdateMessageInput
} from "./messages.store";

const validChannels = new Set<MessageChannel>([
  "funk",
  "telefon",
  "email",
  "melder",
  "lagekontakt"
]);

const validPriorities = new Set<MessagePriority>([
  "niedrig",
  "normal",
  "hoch",
  "sofort"
]);

const validStatuses = new Set<MessageStatus>([
  "neu",
  "gesichtet",
  "in_bearbeitung",
  "weitergeleitet",
  "erledigt"
]);

@Injectable()
export class MessagesService {
  constructor(
    private readonly authService: AuthService,
    @Inject(MESSAGE_STORE) private readonly messageStore: MessageStore
  ) {}

  async listByIncident(incidentId: string, authorizationHeader: string | undefined) {
    const session =
      await this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (!session.permissions.includes("messages.read")) {
      throw new ForbiddenException("Keine Berechtigung zum Lesen von Nachrichten.");
    }

    return this.messageStore.listByIncident(incidentId);
  }

  async listHistory(
    incidentId: string,
    messageId: string,
    authorizationHeader: string | undefined
  ) {
    const session =
      await this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (
      !session.permissions.includes("audit.read") &&
      !session.permissions.includes("messages.read")
    ) {
      throw new ForbiddenException("Keine Berechtigung zum Lesen des Nachrichtenverlaufs.");
    }

    const history = await this.messageStore.listHistory(incidentId, messageId);

    if (!history) {
      throw new NotFoundException("Nachricht nicht gefunden.");
    }

    return history;
  }

  async create(
    incidentId: string,
    input: CreateMessageInput,
    authorizationHeader: string | undefined
  ) {
    const session =
      await this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (!session.permissions.includes("messages.create")) {
      throw new ForbiddenException("Keine Berechtigung zum Erfassen von Nachrichten.");
    }

    return this.messageStore.create(
      incidentId,
      {
        direction: input.direction,
        channel: this.requireChannel(input.channel),
        priority: this.requirePriority(input.priority),
        messageTime: this.requireDateTime(input.messageTime, "Nachrichtenzeit"),
        senderLabel: this.requireText(input.senderLabel, "Absender"),
        recipientLabel: this.requireText(input.recipientLabel, "Empfaenger"),
        subject: this.requireText(input.subject, "Betreff"),
        body: this.requireText(input.body, "Inhalt"),
        assignee: this.optionalText(input.assignee) || "Sichtung offen",
        distribution: this.optionalText(input.distribution) || "offen",
        notes: this.optionalText(input.notes) || ""
      },
      session.user.id
    );
  }

  async update(
    incidentId: string,
    messageId: string,
    input: UpdateMessageInput,
    authorizationHeader: string | undefined
  ) {
    const session =
      await this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (!session.permissions.includes("messages.update")) {
      throw new ForbiddenException("Keine Berechtigung zum Bearbeiten von Nachrichten.");
    }

    const normalizedInput: UpdateMessageInput = {};

    if (input.channel !== undefined) {
      normalizedInput.channel = this.requireChannel(input.channel);
    }

    if (input.priority !== undefined) {
      normalizedInput.priority = this.requirePriority(input.priority);
    }

    if (input.status !== undefined) {
      normalizedInput.status = this.requireStatus(input.status);
    }

    if (input.messageTime !== undefined) {
      normalizedInput.messageTime = this.requireDateTime(
        input.messageTime,
        "Nachrichtenzeit"
      );
    }

    if (input.senderLabel !== undefined) {
      normalizedInput.senderLabel = this.requireText(input.senderLabel, "Absender");
    }

    if (input.recipientLabel !== undefined) {
      normalizedInput.recipientLabel = this.requireText(
        input.recipientLabel,
        "Empfaenger"
      );
    }

    if (input.subject !== undefined) {
      normalizedInput.subject = this.requireText(input.subject, "Betreff");
    }

    if (input.body !== undefined) {
      normalizedInput.body = this.requireText(input.body, "Inhalt");
    }

    if (input.assignee !== undefined) {
      normalizedInput.assignee = this.requireText(input.assignee, "Zuweisung");
    }

    if (input.distribution !== undefined) {
      normalizedInput.distribution = this.requireText(input.distribution, "Verteiler");
    }

    if (input.notes !== undefined) {
      normalizedInput.notes = this.optionalText(input.notes) ?? "";
    }

    if (Object.keys(normalizedInput).length === 0) {
      throw new BadRequestException("Keine gueltigen Aenderungen uebergeben.");
    }

    const updated = await this.messageStore.update(
      incidentId,
      messageId,
      normalizedInput,
      session.user.id
    );

    if (!updated) {
      throw new NotFoundException("Nachricht nicht gefunden.");
    }

    return updated;
  }

  private requireText(value: string, fieldLabel: string) {
    const normalized = value.trim();

    if (!normalized) {
      throw new BadRequestException(`${fieldLabel} darf nicht leer sein.`);
    }

    return normalized;
  }

  private optionalText(value: string | undefined) {
    return value?.trim();
  }

  private requireDateTime(value: string, fieldLabel: string) {
    if (Number.isNaN(Date.parse(value))) {
      throw new BadRequestException(`${fieldLabel} ist ungueltig.`);
    }

    return new Date(value).toISOString();
  }

  private requireChannel(value: MessageChannel) {
    if (!validChannels.has(value)) {
      throw new BadRequestException("Ungueltiger Nachrichtenkanal.");
    }

    return value;
  }

  private requirePriority(value: MessagePriority) {
    if (!validPriorities.has(value)) {
      throw new BadRequestException("Ungueltige Nachrichtenprioritaet.");
    }

    return value;
  }

  private requireStatus(value: MessageStatus) {
    if (!validStatuses.has(value)) {
      throw new BadRequestException("Ungueltiger Nachrichtenstatus.");
    }

    return value;
  }
}
