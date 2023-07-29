import { ResponseStruct } from "@mxs/common";
import { Request, Response } from "express";
import * as dayOffService from "./dayOff.service";

export async function createUnfixedDayOff(req: Request, res: Response) {
  const payload = req.body;
  try {
    const data = await dayOffService.createUnfixedDayOff(payload);
    return res.json(ResponseStruct.responseStruct(1, data));
  } catch (error) {
    const enhancedErrorMessage = String(error).replace(/^(MongooseError:|TypeError:|Error:)\s*/, "");
    return res.json(ResponseStruct.responseStruct(0, payload, enhancedErrorMessage));
  }
};

export async function createFixedDayOff(req: Request, res: Response) {
  const payload = req.body;
  try {
    const data = await dayOffService.createFixedDayOff(payload);
    return res.json(ResponseStruct.responseStruct(1, data));
  } catch (error) {
    const enhancedErrorMessage = String(error).replace(/^(MongooseError:|TypeError:|Error:)\s*/, "");
    return res.json(ResponseStruct.responseStruct(0, payload, enhancedErrorMessage));
  }
};

export async function getDayOff(req: Request, res: Response) {
  const payload = req.params;
  const data = await dayOffService.getDayOff(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function getDayOffs(req: Request, res: Response) {
  const payload = req.query;
  const data = await dayOffService.getDayOffs(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function getListDayOffs(req: Request, res: Response) {
  const payload = req.query;
  try {
    const data = await dayOffService.getListDayOffs(payload);
    return res.json(ResponseStruct.responseStruct(1, data));
  } catch (error) {
    const enhancedErrorMessage = String(error).replace(/^(MongooseError:|TypeError:|Error:)\s*/, "");
    return res.json(ResponseStruct.responseStruct(0, payload, enhancedErrorMessage));
  }
};

export async function getApprovalDayOff(req: Request, res: Response) {
  const payload = req.params;
  const data = await dayOffService.getApprovalDayOff(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function getUnfixedDayOff(req: Request, res: Response) {
  const payload = req.query;
  const data = await dayOffService.getUnfixedDayOff(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function getFixedDayOff(req: Request, res: Response) {
  const payload = req.query;
  const data = await dayOffService.getFixedDayOff(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function updateFixedDayOff(req: Request, res: Response) {
  const payload = req.body;
  try {
    const data = await dayOffService.updateFixedDayOff(payload);
    return res.json(ResponseStruct.responseStruct(1, data));
  } catch (error) {
    const enhancedErrorMessage = String(error).replace(/^(MongooseError:|TypeError:|Error:)\s*/, "");
    return res.json(ResponseStruct.responseStruct(0, payload, enhancedErrorMessage));
  }
};

export async function updateUnfixedDayOff(req: Request, res: Response) {
  const payload = req.body;
  const data = await dayOffService.updateUnfixedDayOff(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function approveDayOff(req: Request, res: Response) {
  const payload = req.body;
  const data = await dayOffService.approveDayOff(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};

export async function deleteDayOff(req: Request, res: Response) {
  const payload = req.body;
  const data = await dayOffService.deleteDayOff(payload);
  return res.json(ResponseStruct.responseStruct(1, data));
};