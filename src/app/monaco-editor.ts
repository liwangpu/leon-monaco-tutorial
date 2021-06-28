const _monacoPath = 'assets/monaco-editor/min/vs';

export function loadMonaco() {
    const onGotAmdLoader = () => {

        let vsPath = _monacoPath;
        (<any>window).amdRequire = (<any>window).require;

        (<any>window).amdRequire.config({ paths: { vs: vsPath } });

        // Load monaco
        (<any>window).amdRequire(['vs/editor/editor.main'], () => {

        }, (error) => console.error('Error loading monaco-editor: ', error));
    };

    // Check if AMD loader already available
    const isAmdLoaderAvailable = !!(<any>window).amdRequire;
    if (isAmdLoaderAvailable) {
        return onGotAmdLoader();
    }

    const loaderScript: HTMLScriptElement = document.createElement('script');
    loaderScript.type = 'text/javascript';
    loaderScript.src = `${_monacoPath}/loader.js`;
    loaderScript.addEventListener('load', onGotAmdLoader);
    document.body.appendChild(loaderScript);
}