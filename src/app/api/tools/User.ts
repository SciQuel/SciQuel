import prisma from "@/lib/prisma";
import { type User as UserType } from "@prisma/client";
import { getServerSession, type Session } from "next-auth";

export default class User {
  session: Session | null;
  user: UserType | null;
  checkUserInforFirstTime: boolean;
  constructor() {
    this.session = null;
    this.user = null;
    this.checkUserInforFirstTime = true;
  }

  async _getUserInfo() {
    this.checkUserInforFirstTime = false;
    this.session = await getServerSession();
    this.user = await prisma.user.findUnique({
      where: { email: this.session?.user.email ?? "noemail" },
    });
  }

  async isEditor() {
    if (!this.session && this.checkUserInforFirstTime) {
      await this._getUserInfo();
    }
    if (!this.user || !this.user.roles.includes("EDITOR")) {
      return false;
    }
    return true;
  }

  async getUserId() {
    if (!this.session && this.checkUserInforFirstTime) {
      await this._getUserInfo();
    }

    return this.user?.id || null;
  }
  async isLogIn() {
    if (!this.session && this.checkUserInforFirstTime) {
      await this._getUserInfo();
    }

    return this.session !== null;
  }
}
