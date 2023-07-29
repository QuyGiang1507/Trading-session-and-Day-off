import express from "express";
import { requireAuth, requireRole, validateRequest } from "@mxs/common";
import * as TradingSessionController from "../../modules/tradingSession/tradingSession.controller";

const router = express.Router();

router.post(
  "/trading-session",
  // requireAuth,
  // validateRequest,
  TradingSessionController.createTradingSession,
);

router.post(
  "/trading-session/general",
  // requireAuth,
  // validateRequest,
  TradingSessionController.createGeneralTradingSession,
);

router.get(
  "/trading-session",
  // requireAuth,
  // validateRequest,
  TradingSessionController.getTradingSessions,
);

router.get(
  "/trading-session/general",
  // requireAuth,
  // validateRequest,
  TradingSessionController.getGeneralTradingSession,
);

router.get(
  "/trading-session/approval/:tradingSessionId",
  // requireAuth,
  // validateRequest,
  TradingSessionController.getApprovalSession,
);

router.get(
  "/trading-session/:tradingSessionId",
  // requireAuth,
  // validateRequest,
  TradingSessionController.getTradingSession,
);

router.post(
  "/trading-session/update",
  // requireAuth,
  // validateRequest,
  TradingSessionController.updateTradingSession,
);

router.put(
  "/trading-session/approval",
  // requireAuth,
  // requireRole,
  // validateRequest,
  TradingSessionController.aprpoveTradingSession,
);

router.delete(
  "/trading-session/:tradingSessionId",
  // requireAuth,
  // validateRequest,
  TradingSessionController.deleteTradingSession,
);

export { router as tradingSessionRouter };
