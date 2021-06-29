import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const monacoPath = 'assets/monaco-editor/min/vs';

@Injectable()
export class MonacoEditorHelperService {

    private _editorReady$ = new Subject<void>();
    public constructor() {
        const onGotAmdLoader = () => {

            let vsPath = monacoPath;
            (<any>window).amdRequire = (<any>window).require;

            (<any>window).amdRequire.config({ paths: { vs: vsPath } });

            // Load monaco
            (<any>window).amdRequire(['vs/editor/editor.main'], () => {
                this._editorReady$.next();
            }, (error) => console.error('Error loading monaco-editor: ', error));
        };


        const loaderScript: HTMLScriptElement = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = `${monacoPath}/loader.js`;
        loaderScript.addEventListener('load', onGotAmdLoader);
        document.body.appendChild(loaderScript);
    }

    public get editorReady$() {
        return this._editorReady$.asObservable();
    }

}
