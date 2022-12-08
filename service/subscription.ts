import { Request, Response } from "express";
import { getAllSubscriptionRequest, updateSubscription, newSubscription } from "../templates/soapTemplates";
import { Subscription } from "../types/subscription";
import UserModel from '../models/user';
const util = require("util");
const soapRequest = require("easy-soap-request");
const xml2js = require("xml2js");

const getAllSubscriptionRequestsHandler = async (
  req: Request,
  res: Response
) => {
  let subscriptionRequests: Subscription[];
  const page = parseInt(req.query.page as string);
  const xml = util.format(getAllSubscriptionRequest.template, page);
  const userModel = new UserModel;
  try {
    const { response } = await soapRequest({
      url: getAllSubscriptionRequest.url,
      headers: getAllSubscriptionRequest.headers,
      xml: xml,
    });
    const { headers, body, statusCode } = response;
    const parser = new xml2js.Parser();
    parser.parseString(body, async (err: any, result: any) => {
      const data =
        result["S:Envelope"]["S:Body"][0][
          "ns2:getAllSubscriptionRequestResponse"
        ][0]["return"][0];
      try{
        subscriptionRequests = JSON.parse(data).data;
      } catch {
        subscriptionRequests = [];
      }
      
      // TODO: Dipercepat
      for (let i = 0; i < subscriptionRequests.length; i++) {
        const user = await userModel.findNameById(subscriptionRequests[i].creator_id);
        subscriptionRequests[i].artist_name = user;
      }

      res.status(200).json({
        message: "Successfully retrieved subscription requests",
        data: subscriptionRequests,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
      data: []
    });
  }
};

const updateSubscriptionHandler = async (req: Request, res: Response) => {
  const xml = util.format(updateSubscription.template, req.body.subscriber_id, req.body.creator_id, req.body.status);
  try {
    const { response } = await soapRequest({
      url: updateSubscription.url,
      headers: updateSubscription.headers,
      xml: xml,
    });
    const { headers, body, statusCode } = response;
    res.status(200).json({
      message: "Successfully updated subscription",
      data: req.body.status,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
      data: []
    });
  }
}

const resubscribeHandler = async (req: Request, res: Response) => {
  const xml = util.format(updateSubscription.template, req.body.subscriber_id, req.body.creator_id, "PENDING");
  try {
    const { response } = await soapRequest({
      url: updateSubscription.url,
      headers: updateSubscription.headers,
      xml: xml,
    });
    const { headers, body, statusCode } = response;
    res.status(200).json({
      message: "Successfully updated subscription",
      data: req.body.status,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
      data: []
    });
  }
}


const newSubscriptionHandler = async (req: Request, res: Response) => {
  const xml = util.format(newSubscription.template, parseInt(req.body.subscriber_id), parseInt(req.body.creator_id));
  try {
    const { response } = await soapRequest({
      url: newSubscription.url,
      headers: newSubscription.headers,
      xml: xml,
    });
    const { headers, body, statusCode } = response;
    res.status(200).json({
      message: "Successfully created subscription",
      data: req.body.status,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error " + err,
      data: []
    });
  }
}

export { getAllSubscriptionRequestsHandler, updateSubscriptionHandler, newSubscriptionHandler, resubscribeHandler };
