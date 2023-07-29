import { redisConnector } from "../redis/redisConnector";
import { toUnixTime } from "../utils/converer";

export class userSession {
  static async clearLoginSession(userId: string) {
    const sessions = await redisConnector.authDB.readAllItems(
      `session-${userId}`
    );

    sessions.forEach((session) => {
      redisConnector.authDB.del(session.key);
    });
  }

  static async clearAllLoginSessions(userId: string) {
    const sessions = await redisConnector.authDB.scanAllKeys(
      `session-${userId}`
    );

    sessions.forEach((session) => {
      redisConnector.authDB.del(session);
    });
  }

  static async validate(user) {
    var isValid = false;

    if (!user || !user.id) return false;

    const validSession = await redisConnector.authDB.get<boolean>(
      "ValidUserSession"
    );

    if (!validSession) return true;

    const sessions = await redisConnector.authDB.readAllItems(
      `session-${user.id}`
    );

    sessions.forEach((session) => {
      const sessionValue = JSON.parse(session.value.toString("utf8"));

      //console.log("validate", sessionValue, validSession, session);

      if (
        sessionValue.sessionId === user.sessionId &&
        sessionValue.email === user.email
      )
        isValid = true;
    });

    return isValid;
  }

  static async validateRole(req, roleKey: string) {
    const user = req.currentUser;
    var isValid = false;

    if (!user || !user.id) return false;

    const role = await redisConnector.authDB.get(`role-${roleKey}`);
    if (!role) return false;

    const sessions = await redisConnector.authDB.readAllItems(
      `session-${user.id}`
    );

    sessions.forEach((session) => {
      const sessionValue = JSON.parse(session.value.toString("utf8"));

      if (
        sessionValue.sessionId === user.sessionId &&
        sessionValue.email === user.email &&
        sessionValue.userRoles
      ) {
        //console.log("found", sessionValue.sessionId);
        if (sessionValue.userRoles.indexOf(roleKey) !== -1) isValid = true;
      }
    });

    return isValid;
  }

  static async isExpired(req, interval) {
    const user = req.currentUser;
    var isExpired = true;

    if (!user || !user.id) return true;

    if (interval <= 0) return false;

    const sessions = await redisConnector.authDB.readAllItems(
      `session-${user.id}`
    );

    sessions.forEach((session) => {
      const sessionValue = JSON.parse(session.value.toString("utf8"));

      if (sessionValue.sessionId === user.sessionId && sessionValue.IAT > 0) {
        if (sessionValue.IAT - new Date().getTime() <= interval)
          isExpired = false;
      }
    });

    return isExpired;
  }
}
