import { ResponseStruct } from "@mxs/common";
import { Request, Response } from "express";
import * as tradingSessionService from "./tradingSession.service";

export async function createTradingSession(req: Request, res: Response) {
  const payload = req.body;
  try {
    const data = await tradingSessionService.createTradingSession(payload);
    return res.json(ResponseStruct.responseStruct(1, data));
  } catch (error) {
    const enhancedErrorMessage = String(error).replace(/^(MongooseError:|TypeError:)\s*/, "");
    return res.json(ResponseStruct.responseStruct(0, payload, enhancedErrorMessage));
  }
};

export async function createGeneralTradingSession(req: Request, res: Response) {
  const payload = req.body;
  const data = await tradingSessionService.createGeneralTradingSession(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function getTradingSession(req: Request, res: Response) {
  const payload = req.params;
  const data = await tradingSessionService.getTradingSession(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function getApprovalSession(req: Request, res: Response) {
  const payload = req.params;
  const data = await tradingSessionService.getApprovalSession(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function getTradingSessions(req: Request, res: Response) {
  const payload = req.query;
  const data = await tradingSessionService.getTradingSessions(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function getGeneralTradingSession(req: Request, res: Response) {
  const data = await tradingSessionService.getGeneralTradingSession();
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function updateTradingSession(req: Request, res: Response) {
  const payload = req.body;
  try {
    const data = await tradingSessionService.updateTradingSession(payload);
    return res.json(ResponseStruct.responseStruct(1, data));
  } catch (error) {
    const enhancedErrorMessage = String(error).replace(/^(MongooseError:|TypeError:)\s*/, "");
    return res.json(ResponseStruct.responseStruct(0, payload, enhancedErrorMessage));
  }
};

export async function aprpoveTradingSession(req: Request, res: Response) {
  const payload = req.body;
  const data = await tradingSessionService.aprpoveTradingSession(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function deleteTradingSession(req: Request, res: Response) {
  const payload = req.params;
  const data = await tradingSessionService.updateTradingSession(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};