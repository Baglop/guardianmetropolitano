
import React, { Component } from 'react';
import logo from './logo.svg';
import { IoMdEye, IoMdEyeOff, IoMdAlert } from "react-icons/io";
import logoImage from  './img/Ojo_Metropolitano_Logo.PNG';
import markerIcon from './img/baseline_directions_car_black_18dp.png';
import { Container, Row, Col, Button, Nav  } from 'react-bootstrap';
import {Map, InfoWindow, Polyline, GoogleApiWrapper, Marker} from 'google-maps-react';
import SimpleBar from 'simplebar-react';
import io from 'socket.io-client/dist/socket.io.js';
import 'simplebar/dist/simplebar.min.css';
import './App.css';
import './TitlebarStyle.css';
import { relative } from 'path';
import InfoView from './infoView.js'

const url = 'http://siliconbear.dynu.net:3030';
const remote = window.require('electron').remote;


const notifier = window.require('node-notifier');
const socket = io.connect(url);

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
class App extends Component {

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
      showInfo:true,
      markerArray:[],
      emergencyArray:[],
      reportFilter:8,
      centerFocus:{
        lat: 20.663609,
        lng: -103.348982
      },
    }
  }
  componentWillMount(){
    this.startSocket();
    this.setState({mapView:this._renderMap()})
  }
  
  startSocket(){
    socket.emit('vigilarSalaAgentePoliciaco');
    
    socket.on('botonDePanicoPresionado',(data) => this.botonDePanicoPresionado(data));
    socket.on('reporteNuevo', async (reporte) => {
      console.log("**************************************** reporteNuevo ****************************************");
      console.log(reporte);
      let direccion = await this.getAddress(reporte.latitud,reporte.longitud)
      console.log(direccion)
      Object.defineProperty(reporte,'direccion',{
        enumerable: true,
        configurable: true,
        writable: true,
        value: direccion
      });
      let infoWindow
      this.setState(prev => ({reports:[...prev.reports,reporte]}),() => {let marker = new this.props.google.maps.Marker({
            position: {lat:Number(reporte.latitud),lng:Number(reporte.longitud)},
            map:this.homeMap,
            nombreUsuario: reporte.autorReporte,
            fechaIncidente: reporte.fechaIncidente,
            fechaReporte: reporte.fechaReporte
          })
          infoWindow = new this.props.google.maps.InfoWindow({
            content: '<p style="color:black">'+tipDelito[reporte.tipoReporte-1]+'</p>',
            disableAutoPan : true
          })
          marker.addListener('click', () => {
            this.homeMap.panTo(marker.position)
            infoWindow.open(this.homeMap,marker)
          })
          Object.defineProperty(reporte,'marker',{
            enumerable: true,
            configurable: true,
            writable: true,
            value: marker
          });
        }
      )

    });
    
  }

  updateMarkerPos(data){
    let index = this.state.emergencyArray.map((item) =>{ return item.nombreUsuario}).indexOf(data.nombreUsuario)
    console.log(index)
    if(index == -1){
      const map = this.mapComponent
      let marker = new this.props.google.maps.Marker({
        position: {lat:Number(data.coordenadaX),lng:Number(data.coordenadaY)},
        map,
        nombreUsuario: data.nombreUsuario,
        horaActualizacion: data.horaActualizacion,
      })
      marker.addListener('click', () => {
        this.setCurrentreport(this.state.emergencyArray.length-1)
        this.changeCenter(marker.position)
     })
      this.setState(prev => ({emergencyArray:[...prev.emergencyArray,marker]}))
      this.mapComponent.panTo(marker.position)
      console.log(marker)
    }
    else{
      let temp = this.state.emergencyArray
      temp[index].horaActualizacion = data.horaActualizacion
      this.setState({emergencyArray:temp},() =>this.state.emergencyArray[index].setPosition(new this.props.google.maps.LatLng(Number(data.coordenadaX),Number(data.coordenadaY))) )
      
    }
    console.log(data)
  }

  botonDePanicoPresionado(data){
    // String
    
    // Object
    notifier.notify({
      title: data.titulo,
      message: data.mensaje,
      wait:true
    });
    notifier.on('click', (notifierObject, options) => {
      // Triggers if `wait: true` and user clicks notification
      this.changeView(3)
      remote.getCurrentWindow().show()
    });
    console.log(data);
      socket.on('alertaPublica_posicionActualizada', (dataPos) => this.updateMarkerPos(dataPos)
    )
  }

  /* -------------funciones para custom title bar ------------*/
  _renderTitleBar(){
    return(
      <div className="title-bar" >
        <div className="app-name-container " >
          Ojo metropolitano
        </div>
        <div className="window-controls-container">
          <a className="minimize-button" onClick={() => this.minimizeWindow()} >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
              <path d="M96 235h320v42H96z"/>
            </svg>
          </a>
          <a className="min-max-button" onClick={() => this.maximazeWindow()} >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="100%" viewBox="0 0 512 512">
              <path d="M405.3 106.7v298.7H106.7V106.7h298.6m0-42.7H106.7C83.2 64 64 83.2 64 106.7v298.7c0 23.5 19.2 42.7 42.7 42.7h298.7c23.5 0 42.7-19.2 42.7-42.7V106.7C448 83.2 428.8 64 405.3 64z"/>
            </svg>
          </a>
          <a className="close-button" onClick={() => this.closeApp()} >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="100%" viewBox="0 0 512 512">
              <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"/>
            </svg>
          </a>
        </div>
      </div>
    );
  }

  minimizeWindow(){
    remote.getCurrentWindow().minimize();
  }

  maximazeWindow(){
    const currentwindow = remote.getCurrentWindow()
    currentwindow.isMaximized() ? currentwindow.unmaximize():currentwindow.maximize();
  }

  closeApp(){
    remote.app.quit();
  }
  /* ----------------------- */
  /* Animacion de auto en mapa */
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
  getAddress(lat,lng){
    let geocoder = new this.props.google.maps.Geocoder;
    let address;
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    return new Promise((resolve) => geocoder.geocode({'location': latlng},(results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0].formatted_address)
          address = results[0].formatted_address
          resolve(address)
        } else {
          resolve(latlng)
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    })
    )
  }
   /* Dibujado camino en mapa */
  handleMapLoad(mapProps,map) {
    this.mapComponent = map;
    
    map.panTo(this.state.centerFocus)
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
  /* Scripts bootstrap */
  scripts(){
    return(
      <div>
      <script src="https://unpkg.com/react/umd/react.production.js" crossorigin />

        <script
          src="https://unpkg.com/react-dom/umd/react-dom.production.js"
          crossorigin
        />

        <script
          src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
          crossorigin
        />

        <script>var Alert = ReactBootstrap.Alert;</script>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
        </div>
    );
  }
  drawRoute(index){
    const google = this.props.google
    const directionsService = new google.maps.DirectionsService();
    var coord = null;
    if(this.state.emergencyArray.length > 0)
       directionsService.route({
        origin: this.state.markerArray[index].position, 
        destination: this.state.emergencyArray[this.state.currentReport].position,   
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
  changeCenter(pos){
    
    this.setState({centerFocus:pos})
    console.log(pos)
    this.mapComponent.panTo(pos)
    
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
  changeInfoState(){
    this.setState({showInfo:!this.state.showInfo},() => {
      this.state.showInfo ?
      this.state.markerArray.map((item) => item.infowindowRef.open(this.mapComponent, item)) :
      this.state.markerArray.map((item) => item.infowindowRef.close()) 
    })
    console.log(this.state.showInfo)
  }

  deleteEmercy(index){
    this.state.emergencyArray[index].setMap(null)
    const array = this.state.emergencyArray.filter((__dirname,i) => i !== index);
    this.setState(prev => ({emergencyArray:array}))
    console.log(array)
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
          <div className="stats" style={{flexDirection: "row",display:"flex" }}>
            <h5 style={{padding:'10px'}}>Reportes</h5>
          </div>
            <SimpleBar className="list" >
                <Nav fill defaultActiveKey="link-1" className="flex-column" variant="reportList">
                  {this.state.emergencyArray.map((item, i) =>
                  <Nav.Link eventKey={"link-" + (i+1)} className="reportFont" onSelect={()=> (this.setCurrentreport(i), this.changeCenter(item.position))}>
                    <div style={{width:'50%'}}>
                      Emergencia {i+1} - {item.nombreUsuario}<br/>
                      <light>{item.horaActualizacion}</light>
                    </div>
                    <div style={{display: 'flex',justifyContent: 'flex-end',alignItems: 'center',width:'50%'}} >
                      <button className='deleteEmergencyButton' onClick={() => this.deleteEmercy(i)}>Eliminar</button>
                    </div>

                  </Nav.Link>
                  )}
                </Nav>
            </SimpleBar>
        </Col >
        <Col style={styleCol2} >
          <div className="stats" style={{flexDirection: "row",display:"flex" }}>
            <h5 style={{padding:'10px'}}>Policia disponible</h5> 
            <a className="hideInfo" onClick={() => this.changeInfoState() }>{this.state.showInfo ? <IoMdEyeOff/> : <IoMdEye/>}</a>
          </div>
            <SimpleBar className="list" >
                <Nav fill defaultActiveKey="link-1" className="flex-column" variant="reportList">
                  {patrullas.map((item, i) =>
                  <Nav.Link eventKey={"link-" + (i+1)} className="reportFont" onSelect={() => this.setCurrentPCar(i)} >
                  <div>
                    Patrulla <br/>
                    <light>{item.patrulla}</light>
                  </div>
                  </Nav.Link>
                  )}
                </Nav>
            </SimpleBar>
        </Col>
      </Row>
    );
  }
/* Render de mapa */
  _renderMap(){
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
      <div className="App-header" style={{display: this.state.viewSelected === 3 ? 'block':'none'}}> 
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
  handleHomeMapLoad(mapProps,map){
    this.homeMap = map
    map.panTo(this.state.centerFocus)
    const {google} = mapProps;
    let marker
    let infowindo
    patrullas.map((item,i) => (marker = new google.maps.Marker({
      position: {lat:item.lat,lng:item.lng},
      map:map,
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
      infowindowRef:null
      
    })
    ,this.setState(prev => ({markerArray:[...prev.markerArray,marker]}))
    ,marker.infowindowRef = new this.props.google.maps.InfoWindow({
          content: '<p style="color:black">'+item.patrulla+'</p>',
          disableAutoPan : true
        }),
        marker.infowindowRef.open(map,marker)
    ))
  }
  filter(type){
    this.state.reports.map((item) => {if(item.tipoReporte-1 == type || type == 8) item.marker.setMap(this.homeMap); else item.marker.setMap(null)})
  }
  handleRadioChange(event){
    console.log(this.state.reportFilter)
    if(this.state.reportFilter !== event.target.value)
      this.setState({reportFilter:event.target.value},() => this.filter(this.state.reportFilter))
    else{
      this.setState({reportFilter:8},() => this.filter(this.state.reportFilter))
    }
  }
  _renderFilter(){
    return(
    <div style={{position: 'absolute', top: 10, left: 10, zIndex: 99,backgroundColor:'rgba(48, 49, 54,0.7)',padding:10}}>
      <label>
      <input
          type="radio"
          value={8}
          checked={this.state.reportFilter == 8}
          onClick={(event) => this.handleRadioChange(event)}
        />
        Todos
      </label>  <br/>
      <label>
        <input
          type="radio"
          value={0}
          checked={this.state.reportFilter == 0}
          onClick={(event) => this.handleRadioChange(event)}
        />
        Robo
      </label><br/>
      <label>
        <input
          type="radio"
          value={1}
          checked={this.state.reportFilter == 1}
          onClick={(event) => this.handleRadioChange(event)}
        />
        Asalto
      </label><br/>
      <label>
        <input
          type="radio"
          value={2}
          checked={this.state.reportFilter == 2}
          onClick={(event) => this.handleRadioChange(event)}
        />
        Acoso
      </label><br/>
      <label>
        <input
          type="radio"
          value={3}
          checked={this.state.reportFilter == 3}
          onClick={(event) => this.handleRadioChange(event)}
        />
        Vandalismo
      </label><br/>
      <label>
        <input
          type="radio"
          value={4}
          checked={this.state.reportFilter == 4}
          onClick={(event) => this.handleRadioChange(event)}
        />
        Pandillerismo
      </label><br/>
      <label>
        <input
          type="radio"
          value={5}
          checked={this.state.reportFilter == 5}
          onClick={(event) => this.handleRadioChange(event)}
        />
        Violación
      </label><br/>
      <label>
        <input
          type="radio"
          value={6}
          checked={this.state.reportFilter == 6}
          onClick={(event) => this.handleRadioChange(event)}
        />
        Secuestro o tentativa
      </label><br/>
      <label>
        <input
          type="radio"
          value={7}
          checked={this.state.reportFilter == 7}
          onClick={(event) => this.handleRadioChange(event)}
        />
        Asesinato
      </label>
      <div>
      Numero de patrulla <a className="hideInfo" onClick={() => this.changeInfoState() }>{this.state.showInfo ? <IoMdEyeOff/> : <IoMdEye/>}</a>
      </div>

    {/* ["Robo","Asalto","Acoso","Vandalismo","Pandillerismo","Violación","Secuestro o tentativa","Asesinato"] */}
    </div>);
  }
  _renderHomeMap(){
    const style = {
      height: '100%',
      position:'relative',
      minWidth:'500px'
    }
    return(
    <div className="App-header" style={{display: this.state.viewSelected === 1 ? 'block':'none'}}> 
        <Map google={this.props.google} zoom={13} initialCenter={this.state.centerFocus} ref={(instance) => {this.mapa = instance}}
          fullscreenControl={false}
          rotateControl={false}
          streetViewControl={false}
          mapTypeControl={false} 
          style={style}
          onReady={this.handleHomeMapLoad.bind(this)}>
          {this._renderFilter()}
            {/* this.state.markerArray.map((item,i) => 
              <Polyline
                path={item.lienarCoord}
                geodesic={false}
                strokeColor={item.lineColor}
                options={{
                    strokeOpacity: 1,
                    strokeWeight: 7,
                }}
              />
            ) */}
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
        </Map>
      </div>
    );
  }
  /* Cambia vista */
  changeView(num){
    this.setState({viewSelected:num})
    console.log(this.state.viewSelected)
    num == 1 && this.state.markerArray.map((item) => {item.setMap(this.homeMap); this.props.google.maps.event.clearListeners(item,'click')})
    num == 3 && this.state.markerArray.map((item,i) => {item.setMap(this.mapComponent); item.addListener('click', () => {this.setCurrentPCar(i)})}) 
  }
/* Render menu sidebar */
  _renderSideBar(){
    return (
        <div className='sidebar'>
          <div className="logoSide">
            <img src={logoImage} width={180} height={180} />
          </div>
          <hr className="titleLine"/>
          <Nav fill defaultActiveKey="link-1" className="flex-column" variant="pills">
            <Nav.Link active={this.state.viewSelected === 1 ? true : false} eventKey="link-1"onSelect={() => this.changeView(1)}>Inicio</Nav.Link>
            <Nav.Link active={this.state.viewSelected === 2 ? true : false} eventKey="link-2" onSelect={() => this.changeView(2)} >Denuncias</Nav.Link>
            <Nav.Link active={this.state.viewSelected === 3 ? true : false} eventKey="link-3" onSelect={() => this.changeView(3)} >Emergencias {this.state.emergencyArray.length > 0 &&<IoMdAlert style={{marginLeft:40,color:"red",fontSize:22}}/>}</Nav.Link>
            <hr className="titleLine"/>
           {/*  <Nav.Link active={this.state.viewSelected === 4 ? true : false}eventKey="link-4" onSelect={() => this.changeView(4)}> Informacion</Nav.Link>
            <Nav.Link eventKey="link-5" onSelect={() => this.minimizeWindow()} >Ayuda</Nav.Link> */}
            <Nav.Link eventKey="link-6" onSelect={() => this.closeApp()}>Salir</Nav.Link>
          </Nav>
        </div>
    );
  }
  /* render principal denuncias */
  _renderDenuncias() {
    const styleCol1 ={
      display: "flex",
      flexDirection: "column",
      marginRight:'2px',
      paddingRight:'2px',
    }
    
    const styleCol2 ={
      display: "flex",
      flexDirection: "column",
    }
    return (
        <div className="App-header" style={{display: this.state.viewSelected === 2 ? 'block':'none'}}>
          <Row noGutters={true}  style={{height:'100%',minWidth:'600px'}}>
            <Col style={styleCol1} lg={4}>
              <div className="stats">
                <h5 style={{padding:'10px'}}>Denuncias recientes</h5>
              </div>
              <SimpleBar className="list" >
                <Nav fill defaultActiveKey="link-1" className="flex-column" variant="reportList">
                  {this.state.reports.map((item, i) =>
                  <Nav.Link eventKey={"link-" + (i+1)} className="reportDetails" onSelect={() => this.setCurrentDetailsreport(i)}>
                    Reporte {i+1} - {item.autorReporte} <br/>
                    <light>{tipDelito[Number(item.tipoReporte)-1]} - {item.fechaIncidente} - Status</light>
                  </Nav.Link>
                  )}
                </Nav>
              </SimpleBar>
            </Col>
            <Col>
              <Row noGutters={true}  style={{height:'50%',minWidth:'600px',paddingBottom:'1px'}}>
                <Col style={styleCol2}>
                  <div className="stats" style={{backgroundColor:'#3b3f46'}}>
                    <h5 style={{padding:'10px'}}>Detalles</h5>
                  </div>
                  {this._renderDenunciasDetails()}
                </Col>
              </Row >
              <Row noGutters={true} style={{height:'50%',minWidth:'600px'}}>
                <Col style={styleCol1}>
                  <div className="stats" style={{backgroundColor:'#3b3f46'}}>
                    <h5 style={{padding:'10px'}}>Evidencia</h5>
                  </div>
                  <SimpleBar className="listChild">
                    <img src={this.state.reports.length > 0 && this.state.reports[this.state.currentDetailReport].evidencia}></img>
                  </SimpleBar>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
    );
  }
  /* render de detalles de denuncias */
  _renderDenunciasDetails(){
    return(
    <div  className="listChild" style={{padding:'10px'}}>
    
    <Row noGutters={true} >
      <Col>
        <p className="reportDetails" >Fecha y hora de reporte <br/> <light>{this.state.reports.length > 0 ?this.state.reports[this.state.currentDetailReport].fechaReporte:'0/0/0'}</light> </p>
        <p className="reportDetails" >Ubicación del incidente <br/> <light>{this.state.reports.length > 0 ?this.state.reports[this.state.currentDetailReport].direccion:'0'}</light></p>
        <p className="reportDetails" >Tipo de delito <br/> <light>{tipDelito[this.state.reports.length > 0 ?(Number(this.state.reports[this.state.currentDetailReport].tipoReporte)-1):0]}</light></p>
        <p className="reportDetails" >ID reporte <br/> <light>{this.state.reports.length > 0 ?this.state.reports[this.state.currentDetailReport]._id:'0'}</light></p>
      </Col>
      <Col>
        <p className="reportDetails" >Fecha y hora del incidente <br/> <light>{this.state.reports.length > 0 ?this.state.reports[this.state.currentDetailReport].fechaIncidente:'0/0/0'}</light> </p>
        <p>Descripción</p>
        <SimpleBar className="reportDesc">
          <light>
          {this.state.reports.length > 0 ?this.state.reports[this.state.currentDetailReport].descripcion:''}
          </light>
        </SimpleBar>
      </Col>
      
    </Row>
    </div>
    );
  }

  /* render principal de la aplicacion */
  render(){
    let item;
    return(
      <Container style={{ padding: 0, margin: 0, backgroundColor:'#303136', height:'100vh'}} fluid={true}>
        {this.scripts()}
        {this._renderTitleBar()}
        <Row noGutters={true} className="bottomRow">
            {this._renderSideBar()}
          <Col>
            {this._renderHomeMap()}
            {this._renderMap()}
            {this._renderDenuncias()}
            <InfoView viewSelected={this.state.viewSelected}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCjHyW6npZt7iB0RCIzI-XGdrYMMhi9tSY")
})(App);

//export default App;
