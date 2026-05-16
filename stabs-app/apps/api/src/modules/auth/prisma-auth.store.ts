import crypto from "node:crypto";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  AppRole,
  getPermissionsForRoles,
  getRoleDefinitions,
  getSeededAuthUsers
} from "../../shared/auth-config";
import { hashPassword, verifyPassword } from "../../shared/passwords";
import { AuthStore, AuthenticatedSession } from "./auth.store";

@Injectable()
export class PrismaAuthStore implements AuthStore, OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedReferenceData();
  }

  async login(username: string, password: string): Promise<AuthenticatedSession | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      return null;
    }

    const token = `session-${crypto.randomUUID()}`;

    await this.prisma.authSession.create({
      data: {
        token,
        userId: user.id
      }
    });

    return this.toAuthenticatedSession(token, user);
  }

  async resolveSession(token: string | undefined): Promise<AuthenticatedSession | null> {
    if (!token) {
      return null;
    }

    const session = await this.prisma.authSession.findUnique({
      where: {
        token
      },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: true
              }
            }
          }
        }
      }
    });

    if (!session) {
      return null;
    }

    return this.toAuthenticatedSession(session.token, session.user);
  }

  async resolveUserDisplayName(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        displayName: true
      }
    });

    return user?.displayName ?? userId;
  }

  private async seedReferenceData() {
    for (const role of getRoleDefinitions()) {
      await this.prisma.role.upsert({
        where: {
          key: role.key
        },
        update: {
          displayName: role.displayName,
          permissions: role.permissions
        },
        create: {
          key: role.key,
          displayName: role.displayName,
          permissions: role.permissions
        }
      });
    }

    for (const user of getSeededAuthUsers()) {
      await this.prisma.user.upsert({
        where: {
          id: user.id
        },
        update: {
          username: user.username,
          displayName: user.displayName,
          passwordSalt: user.passwordSalt,
          passwordHash: hashPassword(user.password, user.passwordSalt)
        },
        create: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          passwordSalt: user.passwordSalt,
          passwordHash: hashPassword(user.password, user.passwordSalt)
        }
      });

      for (const roleKey of user.roles) {
        await this.prisma.userRole.upsert({
          where: {
            userId_roleKey: {
              userId: user.id,
              roleKey
            }
          },
          update: {},
          create: {
            userId: user.id,
            roleKey
          }
        });
      }
    }
  }

  private toAuthenticatedSession(
    token: string,
    user: {
      id: string;
      username: string;
      displayName: string;
      roles: Array<{
        role: {
          key: string;
          permissions: string[];
        };
      }>;
    }
  ): AuthenticatedSession {
    const roles = user.roles.map((entry) => entry.role.key as AppRole).sort();

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        roles
      },
      permissions: getPermissionsForRoles(roles)
    };
  }
}
