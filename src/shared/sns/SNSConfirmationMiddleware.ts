import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import * as rawbody from "raw-body";
import { SNSConfirmationDto } from "./SNSConfirmationDTO";

const parseRawBody = async (req: Request) => {
  const raw = await rawbody(req);
  const text = raw.toString().trim();
  return JSON.parse(text);
};

@Injectable()
export class SNSConfirmationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const messageType = req.headers["x-amz-sns-message-type"] as String;

    if (messageType === undefined) {
      next();
    } else if (messageType === "SubscriptionConfirmation") {
      const snsConfirmation = (await parseRawBody(req)) as SNSConfirmationDto;
      try {
        console.log(snsConfirmation.SubscribeURL);
        await axios.get(snsConfirmation.SubscribeURL);
      } catch (error) {
        console.log(snsConfirmation.SubscribeURL);
        throw new BadRequestException(`Subscription Error: ${error.code}`);
      }
    } else if (messageType == "Notification") {
      const whole_body = await parseRawBody(req);
      req.body = JSON.parse(whole_body.Message);
      next();
    } else {
      throw new BadRequestException(
        `There is no handle to 'x-amz-sns-message-type' value: ${messageType}`
      );
    }
  }
}
