import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatGridListModule,
  MatFormFieldModule,
  MatDialogModule,
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatChipsModule,
  MatMenuModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';


import {HttpClientModule, HttpClient} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

// NG Translate
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ElectronService} from './providers/electron.service';

import {WebviewDirective} from './directives/webview.directive';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {PeopleComponent} from './components/people/people.component';
import {LoginComponent} from './components/login/login.component';
import {TaskManagerComponent} from './components/task-manager/task-manager.component';
import {StoryComponent} from './components/story/story.component';
import {SettingsComponent} from './components/settings/settings.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MeetingNoteEditComponent } from './components/meeting-note-edit/meeting-note-edit.component';
import { MeetingNoteItemComponent } from './components/meeting-note-item/meeting-note-item.component';
import { MeetingNoteAddStoryModalComponent } from './components/meeting-note-add-story-modal/meeting-note-add-story-modal.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    ToolbarComponent,
    PeopleComponent,
    LoginComponent,
    TaskManagerComponent,
    StoryComponent,
    SettingsComponent,
    SpinnerComponent,
    MeetingNoteEditComponent,
    MeetingNoteItemComponent,
    MeetingNoteAddStoryModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatChipsModule,
    MatMenuModule,
    DragDropModule,
    MatTooltipModule,
    MatStepperModule
  ],
  providers: [ElectronService, TaskManagerComponent],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, SettingsComponent, SpinnerComponent, MeetingNoteAddStoryModalComponent],
  exports: [
    MatSnackBarModule
  ]
})
export class AppModule {
}
