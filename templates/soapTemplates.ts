import { SoapEndpoint } from "../types/request";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.SOAP_URL || "http://localhost:8888/ws/subscription";
const headers = {
  "Content-Type": "text/xml;charset=UTF-8",
  "X-API-KEY": process.env.SOAP_API_KEY,
};

const checkSubscriptionTemplate = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <checkSubscription xmlns="http://service.binotify.com/">
          <subscriber>%d</subscriber>
          <creator>%d</creator>
      </checkSubscription>
    </soap:Body>
  </soap:Envelope>`;

const checkSubscription: SoapEndpoint = {
  url: url,
  template: checkSubscriptionTemplate,
  headers: headers,
};

const getAllSubscriptionRequestTemplate = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <getAllSubscriptionRequest xmlns="http://service.binotify.com/">
          <page>%d</page>
      </getAllSubscriptionRequest>
    </soap:Body>
  </soap:Envelope>`;

const getAllSubscriptionRequest: SoapEndpoint = {
  url: url,
  template: getAllSubscriptionRequestTemplate,
  headers: headers,
};

const UpdateSubscriptionTemplate = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <updateSubscription xmlns="http://service.binotify.com/">
        <subscriber>%d</subscriber>
        <creator>%d</creator>
        <status>%s</status>
    </updateSubscription>
  </soap:Body>
</soap:Envelope>`;

const updateSubscription: SoapEndpoint = {
  url: url,
  template: UpdateSubscriptionTemplate,
  headers: headers,
};

const newSubscriptionTemplate = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <newSubscription xmlns="http://service.binotify.com/">
        <subscriber>%d</subscriber>
        <creator>%d</creator>
    </newSubscription>
  </soap:Body>
</soap:Envelope>`;

const newSubscription: SoapEndpoint = {
  url: url,
  template: newSubscriptionTemplate,
  headers: headers,
};

const getSubscribedArtistsTemplate = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getAllSubscribedArtistsBySubscriber xmlns="http://service.binotify.com/">
        <subscriber>%d</subscriber>
    </getAllSubscribedArtistsBySubscriber>
  </soap:Body>
</soap:Envelope>`

const getSubscribedArtists: SoapEndpoint = {
  url: url,
  template: getSubscribedArtistsTemplate,
  headers: headers,
}

export { checkSubscription, getAllSubscriptionRequest, updateSubscription, newSubscription, getSubscribedArtists };
