import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WsNodeImageModule } from "../ws-node-image/ws-node-image.module";
import { WsDialogsModule } from "../ws-dialogs/ws-dialogs.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ContextMenuModule } from "primeng/contextmenu";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DragulaModule } from "ng2-dragula";
import { WsStoryComponent } from "./ws-story.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { WsBaseMamInterceptor } from "../shared/services/ws-base-mam/ws-base-mam-interceptor";
import { WsStoryService } from "./ws-story.service";

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
        DragulaModule
    ],
    declarations:[WsStoryComponent],
    exports:[WsStoryComponent],
    providers: [WsStoryService,{
        provide:HTTP_INTERCEPTORS,
        useClass: WsBaseMamInterceptor,
        multi :true
    }]
})

export class WsStoryModule{}
