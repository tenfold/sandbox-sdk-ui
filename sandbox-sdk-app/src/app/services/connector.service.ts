import { Injectable } from '@angular/core';
import { WebClient as TenfoldWebClient } from '@tenfold/web-client-sdk';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor() { }

  private _webClient: TenfoldWebClient;
  getSDKService() {
    if (!this._webClient) {
      this._webClient = new TenfoldWebClient({
        // sharedWorker: false,
        iframeDivId: 'some-sdk-custom-id',
        sdkUrl: 'http://localhost:8081/sdk.html',
      });
    }
    return this._webClient;
  }
}
