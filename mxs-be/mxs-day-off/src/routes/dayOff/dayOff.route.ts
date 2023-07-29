import express from "express";
import { requireAuth, requireRole, validateRequest } from "@mxs/common";
import * as DayOffController from "../../modules/dayOff/dayOff.controller";

const router = express.Router();

router.post(
  "/day-off/fixed",
  // requireAuth,
  // validateRequest,
  DayOffController.createFixedDayOff,
);

router.post(
  "/day-off/unfixed",
  // requireAuth,
  // validateRequest,
  DayOffController.createUnfixedDayOff,
);

router.get(
  "/day-off/fixed",
  // requireAuth,
  // validateRequest,
  DayOffController.getFixedDayOff,
);

router.get(
  "/day-off/unfixed",
  // requireAuth,
  // validateRequest,
  DayOffController.getUnfixedDayOff,
);

router.get(
  "/day-off/list",
  // requireAuth,
  // validateRequest,
  DayOffController.getListDayOffs,
);

router.get(
  "/day-off/approval/:dayOffApprovalId",
  // requireAuth,
  // validateRequest,
  DayOffController.getApprovalDayOff,
);

router.get(
  "/day-off",
  // requireAuth,
  // validateRequest,
  DayOffController.getDayOffs,
);

router.get(
  "/day-off/:dayOffId",
  // requireAuth,
  // validateRequest,
  DayOffController.getDayOff,
);

router.post(
  "/day-off/fixed/update",
  // requireAuth,
  // validateRequest,
  DayOffController.updateFixedDayOff,
);

router.post(
  "/day-off/unfixed/update",
  // requireAuth,
  // validateRequest,
  DayOffController.updateUnfixedDayOff,
);

router.put(
  "/day-off/approval",
  // requireAuth,
  // validateRequest,
  DayOffController.approveDayOff,
);

router.delete(
  "/day-off",
  // requireAuth,
  // validateRequest,
  DayOffController.deleteDayOff,
);

export { router as dayOffRouter };
