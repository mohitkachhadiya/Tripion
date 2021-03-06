import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform, NavParams } from '@ionic/angular';
import { S3Service } from '../services/s3.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AmendmentsComponent } from '../amendments/amendments.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { ToastService } from '../services/toast.service';
declare const $: any;

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
  // providers: [NavParams]
})
export class ImageModalComponent implements OnInit {
  @Input() image: string;
  @Input() fileObject: any;
  @Input() type: any;

  imagePath: any;
  fileObjectData: any
  itemPicturesStoreURL: any;
  fileType: any;
  loading: Boolean = false;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public platform: Platform,
    public _s3Service: S3Service,
    public router: Router,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private document: DocumentViewer,
    public _toastService: ToastService,
  ) {

    this.imagePath = navParams.get('image');
    this.fileObjectData = navParams.get('fileObject');
    this.fileType = navParams.get('type');

    this.platform.backButton.subscribe(() => {
      console.log("this.router", this.router)
    })
    console.log("file object data", this.fileObjectData, this.fileType,this.imagePath)
  }

  ngOnInit() {
    console.log("helloooo imge modal")
  }


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  /**
   * Upload Image
   */
  uploadImage() {
    this.loading = true;
    let imageName;
    imageName = this.fileObjectData;
    this._s3Service.uploadImage(this.imagePath, this.fileType, this.fileObjectData).then((res) => {
      console.log("Response", res);
      this.loading = false;
      this.modalCtrl.dismiss({
        'dismissed': true,
        'data': res
      });
      this.itemPicturesStoreURL = res;
    }).catch((err) => {
      console.log("Error is", err);
      this.loading = false;
      this.errAlert();

    })
  }


  viewDocument() {
    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    console.log("option", options)
    this.document.viewDocument(this.imagePath, 'application/pdf', options)
  }

  errAlert() {
    $('.error_alert_box2').fadeIn().addClass('animate');
    $('.error_alert_box2').click(function () {
      $(this).hide().removeClass('animate');
    });
    $(' .error_alert_box2 .alert_box_content').click(function (event) {
      event.stopPropagation();
    });
  }
}
