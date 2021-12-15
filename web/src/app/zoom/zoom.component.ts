import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZoomApiService } from "../services/zoom-api.service";
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
declare var history: any;
export interface zoomData {
  uuid: any;
  topic: any;
  start_time: any;
  action: any;
}


@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
  providers: [ZoomApiService]
})

export class ZoomComponent implements OnInit {

  range: FormGroup;
  displayedColumns: string[] = ['uuid', 'topic', 'start_time', 'action', 'btn'];
  zoomConnected: any = null;
  zoomRecording: any = [];
  recordingTypes: any = {};
  total_records: any = 0;
  next_page_token: any = '';
  pageSize: any = 10;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private route: ActivatedRoute, private ZoomApiService: ZoomApiService,) {


    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    this.range = new FormGroup({
      start: new FormControl(firstDay),
      end: new FormControl(lastDay)
    });

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params && params.code && params.state == "zoom_setup") {
        this.zoomAuthSetup(params.code);
      }
    })
    this.getZoomToken();
  }

  getZoomToken() {
    this.zoomConnected = false;
    let obj = {
      user_id: 1
    }
    this.ZoomApiService.getZoomToken(obj).subscribe(
      (data: any) => {

        this.zoomConnected = data.data;
        if (this.zoomConnected) {
          this.zoomConnected.token = this.zoomConnected.token[0]
          this.zoomConnected.user_data = this.zoomConnected.user_data[0]
          this.getZoomRecordings();
          //this.getZoomMeetings();
        }

      },
      error => console.log('Error while loading api - ' + error.message)
    );


  }
  formatDate(date: Date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
  getZoomRecordings() {
    let obj = {
      user_id: 1,
      pageSize: this.pageSize,
      next_page_token: this.next_page_token,
      start: this.formatDate(this.range.controls.start.value),
      end: this.range.controls.end.value ? this.formatDate(this.range.controls.end.value) : "",

    }
    this.ZoomApiService.getZoomRecordings(obj).subscribe(
      (data: any) => {
        if(data.data.message == "The next page token is invalid or expired."){
          this.next_page_token = '';
          this.getZoomRecordings();
        }
        this.zoomRecording = data.data.meetings;
        this.total_records = data.data.total_records;
        this.next_page_token = data.data.next_page_token;
        for (let index = 0; index < this.zoomRecording.length; index++) {
          const element = this.zoomRecording[index];
          this.recordingTypes[index] = element.recording_files;
          element.type = element.recording_files[0].recording_type;
        }
        this.dataSource = new MatTableDataSource<any>(this.zoomRecording);
        this.dataSource.paginator = this.paginator;

      },
      error => console.log('Error while loading api - ' + error.message)
    );


  }

  getZoomMeetings() {

    let obj = {
      user_id: 1
    }
    this.ZoomApiService.getZoomMeeting(obj).subscribe(
      (data: any) => {
        console.log(data);
      },
      error => console.log('Error while loading api - ' + error.message)
    );


  }
  deleteZoomToken() {

    let obj = {
      user_id: 1
    }
    this.ZoomApiService.deleteZoomToken(obj).subscribe(
      (data: any) => {
        alert("Token Revoke");
        this.ngOnInit();
      },
      error => console.log('Error while loading api - ' + error.message)
    );


  }
  zoomConnect() {
    //  window.location.href = 'https://zoom.us/oauth/authorize?response_type=code&client_id=_LHydxKiR3mGa5mNpTl3WQ&redirect_uri=http://localhost:8081/integrations/zoom&state=zoom_setup';
    window.location.href = 'https://zoom.us/oauth/authorize?client_id=zHAojUowQDGn7ZxD3PqbGA&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Fintegrations%2Fzoom&state=zoom_setup'
  }

  zoomAuthSetup(code: any) {
    let obj = {
      code: code,
      user_id: 1
    }
    this.ZoomApiService.createToken(obj).subscribe(
      (data: any) => {
        this.router.navigate(['/'], {
          queryParams: {
            code: null,
            state: null,
          },
          queryParamsHandling: 'merge',
        });
      },
      error => console.log('Error while loading api - ' + error.message)
    );
  }
  download(element: any) {
    const filter_type = element.recording_files.filter(filter)    // Returns [32, 33, 40]
    function filter(obj: any) {
      return obj.recording_type == element.type;
    }
    if (filter_type.length) {
      window.open(filter_type[0].download_url, '_blank');
    }

  }


}
