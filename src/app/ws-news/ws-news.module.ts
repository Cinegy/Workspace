import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WsNodeImageModule } from "../ws-node-image/ws-node-image.module";
import { WsDialogsModule } from "../ws-dialogs/ws-dialogs.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ContextMenuModule } from "primeng/primeng";
import { MatCardModule, MatButtonModule, MatTooltipModule, MatInputModule, MatListModule, MatTabsModule, MatPaginator, MatPaginatorModule, MatCheckboxModule, MatSnackBarModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule } from "@angular/material";
import { WsNewsComponent } from "./ws-news.component";
import { WsNewsService } from "./ws-news.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { WsBaseMamInterceptor } from "../shared/services/ws-base-mam/ws-base-mam-interceptor";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { WsStoryPoolComponent } from './ws-story-pool/ws-story-pool.component';
import { WsRundownComponent } from './ws-rundown/ws-rundown.component';
import { DragulaModule } from "ng2-dragula";

@NgModule({
    imports:[
        CommonModule,
        WsNodeImageModule,
        WsDialogsModule,
        FlexLayoutModule,
        ContextMenuModule,
        MatCardModule,
        MatButtonModule,
        MatTooltipModule,
        MatInputModule,
        MatListModule,
        MatTabsModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatMomentDateModule,
        DragulaModule
    ],
    declarations: [WsNewsComponent, WsStoryPoolComponent, WsRundownComponent],
    exports: [WsNewsComponent],
    providers: [WsNewsService,{
        provide:HTTP_INTERCEPTORS,
        useClass: WsBaseMamInterceptor,
        multi :true
    }]
})

export class WsNewsModule {}