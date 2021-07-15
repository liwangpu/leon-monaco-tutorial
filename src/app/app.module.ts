import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
// import { MonacoEditorHelperService } from './services';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MonacoConfig } from './monaco-config';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MonacoEditorModule.forRoot(MonacoConfig)
    ],
    providers: [
        // MonacoEditorHelperService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

