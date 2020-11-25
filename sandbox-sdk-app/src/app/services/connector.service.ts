import { Injectable } from '@angular/core';
import { WebClient as TenfoldWebClient } from '@tenfold/web-client-sdk';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor() { }

  private webClient: TenfoldWebClient;
  getSDKService() {
    if (!this.webClient) {
      this.webClient = new TenfoldWebClient({
        // sharedWorker: false,
        iframeDivId: 'some-sdk-custom-id',
        sdkUrl: 'https://app.tenfold.com/v1.0.11-sdk/sdk.html',
      });
    }
    return this.webClient;
  }
}
