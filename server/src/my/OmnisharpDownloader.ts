

export class OmnisharpDownloader {


    public async DownloadAndInstallOmnisharp(version: string, serverUrl: string, installPath: string): Promise<boolean> {
      return true;
    }

    public async GetLatestVersion(serverUrl: string, latestVersionFileServerPath: string): Promise<string> {
        return '1.37.12';
    }
}