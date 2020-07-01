import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var google;
@Component({
  selector: 'app-direction',
  templateUrl: './direction.page.html',
  styleUrls: ['./direction.page.scss'],
})
export class DirectionPage implements OnInit, AfterViewInit {
  lat1:any;
  long1:any;
  lat2:any;
  long2:any;
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.createDirectionForm();
  }

  ngOnInit() {
  }

  createDirectionForm() {
    this.directionForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 },
    });


    // var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    this.directionsDisplay.setMap(map,startMarker);
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeColor: 'red'
      }, 
      suppressMarkers: true ,
    });
    var startMarker = new google.maps.Marker({  position: {
      lat:this.lat2,
      lng:this.long2
    }, map: map, icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' });


    var startMarker = new google.maps.Marker({  position: {
      lat:this.lat1,
      lng:this.long1
    }, map: map, icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' });

    
  }

  calculateAndDisplayRoute(formValues) {
    const that = this;
    this.directionsService.route({
      origin: formValues.source,
      destination: formValues.destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        console.log("response", JSON.stringify(response));

        this.lat1=response['routes'][0]['bounds']['Za']['i'];
        this.long1=response['routes'][0]['bounds']['Ua']['i'];
        this.lat2=response['routes'][0]['bounds']['Za']['j'];
        this.long2=response['routes'][0]['bounds']['Ua']['j'];

        // console.log("response", JSON.stringify(response));
        that.directionsDisplay.setDirections(response);
        this.ngAfterViewInit();
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
}
