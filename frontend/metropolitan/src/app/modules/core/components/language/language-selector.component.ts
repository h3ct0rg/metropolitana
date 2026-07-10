import { Component, OnInit, OnDestroy, Self } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BROWSER_STORAGE, StorageService } from './../../../../shared/services/local-data/storage.service';
import { CoreUiService } from '../../services/ui/core-ui.service';
import { Subscription } from 'rxjs';
import { ILocationOption } from 'src/app/shared/model/usertenant';

@Component({
    selector: 'language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.css'],
    providers: [
        StorageService,
        {provide: BROWSER_STORAGE, useFactory: () => localStorage},
    ]
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
    languageList: ILocationOption[] = [];
    selectedLanguage: string;
    subscriptions: Subscription = new Subscription();

    constructor(
        private translate: TranslateService,
        private coreUIService: CoreUiService,
        @Self() private storageService: StorageService) {}

    ngOnInit() {
        this.languageList = [this.defaultLanguageValue()];
        if (this.storageService.get('language')) {
            this.selectedLanguage = this.storageService.get('language');
            this.translate.use(this.selectedLanguage);
        }
        this.subscriptions.add(
            this.coreUIService.languageList$.subscribe(data => {
                if (data.length > 0) {
                    this.languageList = data;
                    this.selectedLanguage = data[0].locale;
                } else {
                    this.languageList = [this.defaultLanguageValue()];
                    this.selectedLanguage = this.languageList[0].locale;
                }
                this.translate.use(this.selectedLanguage);
            })
        );
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
 
    defaultLanguageValue() {
        return { displayName: 'English', locale: 'en-us' };
    }

    changeLanguage(data: string) {
        this.translate.use(data);
        this.storageService.set('language', data);
    }
}
