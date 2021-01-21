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
      console.log('inner connectorService constructor');
      this.webClient = new TenfoldWebClient({
        // sharedWorker: false,
        iframeDivId: 'some-sdk-custom-id',
        sdkUrl: 'http://localhost:8081/sdk.html',
      });
    }
    return this.webClient;
  }

  destroy() {
    if (this.webClient) {
      console.log('inner connectorService destroy');
      this.webClient.destroy();
      this.webClient = null;
    }
  }
}
