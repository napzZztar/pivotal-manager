import {Injectable} from '@angular/core';

const {app} = require('electron').remote;
const fs = require('fs');
const mkdirp = require('mkdirp');

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  dataPath: string;
  fileNames: any;

  constructor() {
    this.initData();
  }

  private initData() {
    this.dataPath = app.getPath('appData') + '/pivotal-manager/';
    this.fileNames = {
      settings: 'settings.json',
      meetingNotes: 'meeting-notes.json'
    };

    if (!fs.existsSync(this.dataPath)) {
      mkdirp(this.dataPath);
    }
  }

  getSettings(): any {
    const path = this.dataPath + this.fileNames.settings;
    try {
      const jsonString = fs.readFileSync(path, {encoding: 'utf8'});
      return JSON.parse(jsonString);
    } catch (ex) {
      return {
        enabledProjects: [],
        enabledMembers: []
      };
    }
  }

  saveSettings(settings): Promise<any> {
    const settingsStr = JSON.stringify(settings, null, 2);
    return this.storeInFile('settings', settingsStr);
  }

  private storeInFile(fileName: string, data: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = this.dataPath + this.fileNames[fileName];

      fs.writeFile(path, data, {flag: 'w+', encoding: 'utf8'}, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

}
