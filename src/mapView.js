
import React, { Component } from 'react';
import markerIcon from './img/baseline_directions_car_black_18dp.png';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import {Map, InfoWindow, Polyline, GoogleApiWrapper, Marker} from 'google-maps-react';
import SimpleBar from 'simplebar-react';
import io from 'socket.io-client/dist/socket.io.js';
import 'simplebar/dist/simplebar.min.css';
import './App.css';
import './TitlebarStyle.css';


const patrullas=[{id:1,patrulla:"JAL16",lat:20.657506, lng:-103.269846,color:"#ff0000",libre:true},
                 {id:2,patrulla:"JAL20",lat:20.675314, lng:-103.341300,color:"#ff00bf",libre:true},
                 {id:3,patrulla:"JAL13",lat:20.674370, lng:-103.424668,color:"#b200ff",libre:true},
                 {id:4,patrulla:"JAL55",lat:20.705093, lng:-103.326156,color:"#3b00ff",libre:true},
                 {id:5,patrulla:"JAL40",lat:20.649956, lng:-103.323560,color:"#0077ff",libre:true},
                 {id:6,patrulla:"JAL30",lat:20.657506, lng:-103.269846,color:"#00e5ff",libre:true},
                 {id:7,patrulla:"JAL04",lat:20.646251, lng:-103.395829,color:"#00ff83",libre:true},
                 {id:8,patrulla:"JAL05",lat:20.708294, lng:-103.410163,color:"#2aff00",libre:true},
                 {id:9,patrulla:"JAL78",lat:20.626250, lng:-103.241935,color:"#bbff00",libre:true},
                 {id:10,patrulla:"JAL36",lat:20.616932, lng:-103.314162,color:"#ffa500",libre:true},]

const tipDelito=["Robo","Asalto","Acoso","Vandalismo","Pandillerismo","Violación","Secuestro o tentativa","Asesinato"]
class Mapview extends Component {

  constructor(props){
    super(props)
    this.state = {
      visible: false,
      viewSelected: 1,
      carCoords:null,
      actualPos:0,
      reports:[],
      currentPCar:0,
      currentReport:0,
      currentDetailReport:0,
      mapView:null,
      markerArray:[],
      centerFocus:{
        lat: 20.663609,
        lng: -103.348982
      },
    }
  }
  shouldComponentUpdate()
{
    return false
}  /* Animacion de auto en mapa */
  drawCar(index){
    console.log(index)
    console.log(this.state.markerArray[index].intervalID)
    console.log(this.state.markerArray[index].position)
    const array = this.state.markerArray;
    const temp = array[index].lienarCoord.filter((__dirname,index) => index !== 0)
    array[index].lienarCoord = temp
    console.log(array[index].lienarCoord)
    this.setState({markerArray:array},() => this.state.markerArray[index].setPosition(array[index].lienarCoord[0]));
    if(this.state.markerArray[index].lienarCoord != null)
      if(this.state.markerArray[index].lienarCoord.length == 0){
        clearInterval(this.state.markerArray[index].intervalID)
        array[index].lienarCoord = null
        this.setState({markerArray:array})
        let pos = new this.props.google.maps.LatLng(patrullas[index].lat,patrullas[index].lng)
        this.state.markerArray[index].setPosition(pos)
      }
  }
   /* Dibujado camino en mapa */
  handleMapLoad(mapProps,map) {
    this.mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
    const {google} = mapProps;
    let marker
    let infowindow
    map.panTo(this.state.centerFocus);
    patrullas.map((item,i) => (marker = new google.maps.Marker({
      position: {lat:item.lat,lng:item.lng},
      map,
      title: 'Hello World!',
      icon:{
        url: markerIcon,
        anchor: new this.props.google.maps.Point(15,15),
        scaledSize: new this.props.google.maps.Size(32,32),
      
      },
      lienarCoord:null,
      intervalID:0,
      lineColor:item.color,
      libre:true,
      
    }),marker.addListener('click', () => {
       this.setCurrentPCar(i)
    })
    ,this.setState(prev => ({markerArray:[...prev.markerArray,marker]}))
    ,infowindow = new this.props.google.maps.InfoWindow({
          content: '<p style="color:black">'+item.patrulla+'</p>',
          disableAutoPan : true
        }),
        infowindow.open(map,marker)
    ))
    /* const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer(); 

    directionsDisplay.setMap(map);
    var coord = null;
    const makeRequest = function() {
      //calculateAndDisplayRoute(directionsService, directionsDisplay);
      this.setState({lineCoordinates: coord})
      console.log(coord)
    }.bind(this);
    
       directionsService.route({
        origin: 'Guadalajara', 
        destination: this.state.centerFocus,   
        travelMode: google.maps.TravelMode.DRIVING,   
       },  
         (result, status) => {   
           if (status === google.maps.DirectionsStatus.OK) {   
             const overViewCoords = result.routes[0].overview_path;   
                coord = overViewCoords
                this.setState({lineCoordinates: overViewCoords})
                console.log(overViewCoords)
                // store intervalId in the state so it can be accessed later:
                //this.setState({intervalId: intervalId});
           } else {
              console.warn(`error fetching directions ${status}`);
           }
         }); */
         //this.intervalID = setInterval(this.drawCar.bind(this), 400);
    //makeRequest();
  }
  drawRoute(index){
    const google = this.props.google
    const directionsService = new google.maps.DirectionsService();
    var coord = null;
    
       directionsService.route({
        origin: this.state.markerArray[index].position, 
        destination: { lat: Number(this.state.reports[this.state.currentReport].latitud), lng: Number(this.state.reports[this.state.currentReport].longitud) },   
        travelMode: google.maps.TravelMode.DRIVING,   
       },  
         (result, status) => {   
           if (status === google.maps.DirectionsStatus.OK) {   
             const overViewCoords = result.routes[0].overview_path;   
                coord = overViewCoords
                /* if(this.state.lineCoordinates.length == 0)
                  this.setState({lineCoordinates: [overViewCoords]},() => {
                    let temp = [...this.state.markerArray]
                    temp[index].lienarCoordID = (this.state.lineCoordinates.length -1)
                    this.setState({markerArr:temp}, () => {
                      const intervalID = setInterval(() => this.drawCar(index), 2000)
                      this.setState(prev => ({intervalIDs:[...prev.intervalIDs,intervalID]}))
                    }) intervalID
                  }) */
                //else{
                  let temp = [...this.state.markerArray]
                  temp[index].lienarCoord = overViewCoords
                  const intervalID = setInterval(() => this.drawCar(index), 2000)
                  temp[index].intervalID = intervalID
                  this.setState({markerArr:temp})
                  
                //}
                // store intervalId in the state so it can be accessed later:
                //this.setState({intervalId: intervalId});
           } else {
              console.warn(`error fetching directions ${status}`);
           }
         });
         //this.intervalID = setInterval(this.drawCar.bind(this), 400);
         
  }
  changeCenter(lat,lng){
    
    this.setState({centerFocus:{lat:Number(lat), lng:Number(lng)}})
    
  }
  setCurrentPCar(index){
    console.log(index)
    this.setState({currentPCar:index},() => this.drawRoute(index))
  }
  setCurrentreport(index){
    this.setState({currentReport:index})
  }
  setCurrentDetailsreport(index){
    this.setState({currentDetailReport:index})
  }

/* Render reportes y policias (inicio) */
  _renderRow(){
    
    const styleCol1 ={
      display: "flex",
      flexDirection: "column",
      marginRight:'2px',
      paddingRight:'2px'
    }
    const styleCol2 ={
      display: "flex",
      flexDirection: "column",
    }
    return(
      <Row noGutters={true} style={{height:'50%',minWidth:'500px'}}>
        <Col style={styleCol1}>
          <div className="stats">
            <h5 style={{padding:'10px'}}>Reportes</h5>
          </div>
            <SimpleBar className="list" >
                <Nav fill defaultActiveKey="link-1" className="flex-column" variant="reportList">
                  {this.state.reports.map((item, i) =>
                  <Nav.Link eventKey={"link-" + (i+1)} className="reportFont" onSelect={()=> (this.setCurrentreport(i), this.changeCenter(item.latitud,item.longitud))}>
                    Reporte {i+1} - {item.autorReporte}<br/>
                    <light>{tipDelito[Number(item.tipoReporte)-1]} - {item.fechaIncidente}</light>
                  </Nav.Link>
                  )}
                </Nav>
            </SimpleBar>
        </Col >
        <Col style={styleCol2} >
          <div className="stats">
            <h5 style={{padding:'10px'}}>Policia disponible</h5>
          </div>
            <SimpleBar className="list" >
                <Nav fill defaultActiveKey="link-1" className="flex-column" variant="reportList">
                  {patrullas.map((item, i) =>
                  <Nav.Link eventKey={"link-" + (i+1)} className="reportFont" onSelect={() => this.setCurrentPCar(i)} >
                    Patrulla <br/>
                    <light>{item.patrulla}</light>
                  </Nav.Link>
                  )}
                </Nav>
            </SimpleBar>
        </Col>
      </Row>
    );
  }
/* Render de mapa */
  render(){
    const style = {
      height: '50%',
      position:'relative',
      minWidth:'500px'
    }
    const center = {
      lat: 20.663609,
      lng: -103.348982
    }
    /* console.log(center)
    console.log(this.state.centerFocus) */
    return(
      <div className="App-header">
        <Map google={this.props.google} zoom={13} center={this.state.centerFocus} ref={(instance) => {this.mapa = instance}}
          fullscreenControl={false}
          rotateControl={false}
          streetViewControl={false}
          mapTypeControl={false} 
          style={style}
          onReady={this.handleMapLoad.bind(this)}>
  
            {this.state.markerArray.map((item,i) => 
              <Polyline
                path={item.lienarCoord}
                geodesic={false}
                strokeColor={item.lineColor}
                options={{
                    strokeOpacity: 1,
                    strokeWeight: 7,
                }}
              />
            )}
            { //curly brace here lets you write javscript in JSX
              /* this.state.reports.map(item =>
                  <Marker
                    key={item.id}
                    title={item.descripcion}
                    name={item.descripcion}
                    position={{ lat: Number(item.latitud), lng: Number(item.longitud) }}
                  />
              ) */
            }
            {
            /* patrullas.map(item =>
              <Marker
                //ref={(instance) => this.patrulla= instance}
                name={item.patrulla}
                position={{lat: item.lat, lng: item.lng}} 
                onClick={this.setCurretnPCar}
                icon={{
                  url: markerIcon,
                  anchor: new this.props.google.maps.Point(15,15),
                  scaledSize: new this.props.google.maps.Size(32,32)
                }}/>
               ) */
            }
            {this._renderRow()}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCjHyW6npZt7iB0RCIzI-XGdrYMMhi9tSY")
})(Mapview);

//export default App;
