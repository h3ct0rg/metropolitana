import { Component, OnInit } from '@angular/core';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@Component({
    selector: 'image-gallery',
    templateUrl: './image-gallery.component.html',
    styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {

    array = [
        { text: "16", bodytext: "Paises", image: "../../../assets/UserFolder/draw1.jpg" },
        { text: "482,760", bodytext: "Cruceros", image: "../../assets/UserFolder/draw2.jpg" },
        { text: "16", bodytext: "Playas", image: "../../assets/UserFolder/draw3.jpg" },
        { text: "482,760", bodytext: "Tours", image: "../../assets/UserFolder/draw4.jpg" }];
    listOfOption: Array<{ label: string; value: string }> = [];

    ngOnInit()
    {
    }
}
