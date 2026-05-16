import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import {
  CreateJournalEntryInput,
  JOURNAL_STORE,
  JournalStore
} from "./journal.store";

@Injectable()
export class JournalService {
  constructor(
    private readonly authService: AuthService,
    @Inject(JOURNAL_STORE) private readonly journalStore: JournalStore
  ) {}

  async listByIncident(incidentId: string, authorizationHeader: string | undefined) {
    const session =
      await this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (!session.permissions.includes("journal.read")) {
      throw new ForbiddenException("Keine Berechtigung zum Lesen des Tagebuchs.");
    }

    return this.journalStore.listByIncident(incidentId);
  }

  async create(
    incidentId: string,
    input: CreateJournalEntryInput,
    authorizationHeader: string | undefined,
    sourceMessageId?: string | null
  ) {
    const session =
      await this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (!session.permissions.includes("journal.create")) {
      throw new ForbiddenException("Keine Berechtigung zum Erstellen von Tagebucheintraegen.");
    }

    const title = input.title.trim();
    const body = input.body.trim();

    if (!title) {
      throw new BadRequestException("Titel darf nicht leer sein.");
    }

    if (!body) {
      throw new BadRequestException("Text darf nicht leer sein.");
    }

    return this.journalStore.create(
      incidentId,
      {
        title,
        body
      },
      session.user.id,
      sourceMessageId
    );
  }
}
