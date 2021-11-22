import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TestingModule } from './/testing/testing.module';
@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, TestingModule],
    bootstrap: [AppComponent]
})
export class AppModule { }
