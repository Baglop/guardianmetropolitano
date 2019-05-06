
import React, { Component } from 'react';
import logo from './logo.svg';
import logoImage from  './img/Ojo_Metropolitano_Logo.PNG';
import markerIcon from './img/baseline_directions_car_black_18dp.png';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import {Map, InfoWindow, Polyline, GoogleApiWrapper, Marker} from 'google-maps-react';
import SimpleBar from 'simplebar-react';

import 'simplebar/dist/simplebar.min.css';
import './App.css';
import './TitlebarStyle.css';
import { relative } from 'path';

const remote  = window.require('electron').remote;

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      visible: false,
      viewSelected: 1,
      lineCoordinates:null,
      carCoords:null,
      actualPos:0,
    }
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
  drawCar(){
    console.log(this.state.actualPos)
    this.setState({actualPos:this.state.actualPos + 1});
    if(this.state.lineCoordinates != null)
      if(this.state.actualPos == this.state.lineCoordinates.length - 1)
        this.setState({actualPos:0})
  }
   /* Dibujado camino en mapa */
  handleMapLoad(mapProps,map) {
    /* this.mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    } */
    const {google} = mapProps;
    
    const directionsService = new google.maps.DirectionsService();
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
        destination: 'Zapopan',   
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
         });
         //setInterval(this.drawCar.bind(this), 400);
    //makeRequest();
  }
  /* Scri´ts bootstrap */
  scripts(){
    return(
      <head>
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
        </head>
    );
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
      <Row noGutters={true} style={{height:'40%',minWidth:'500px'}}>
        <Col style={styleCol1}>
          <div className="stats">
            <h5 style={{padding:'10px'}}>Reportes</h5>
          </div>
            <SimpleBar className="list" >
                <Nav fill defaultActiveKey="link-1" className="flex-column" variant="reportList">
                  {[...Array(50)].map((x, i) =>
                  <Nav.Link eventKey={"link-" + (i+1)} className="reportFont" >
                    Reporte {i+1} <br/>
                    <light>Asalto - 10/10/19 - Status</light>
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
                  {[...Array(50)].map((x, i) =>
                  <Nav.Link eventKey={"link-" + (i+1)} className="reportFont" >
                    Patrulla <br/>
                    <light>PR4{i+1}</light>
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
      height: '60%',
      position:'relative',
      minWidth:'500px'
    }
    return(
      <div className="App-header">
        <Map google={this.props.google} zoom={13} initialCenter={{
            lat: 20.663609,
            lng: -103.348982
          }}
          fullscreenControl={false}
          rotateControl={false}
          streetViewControl={false}
          mapTypeControl={false} 
          style={style}
          onReady={this.handleMapLoad.bind(this)}>
  
            <Polyline
              path={this.state.lineCoordinates}
              geodesic={false}
              options={{
                  strokeColor: '#38B44F',
                  strokeOpacity: 1,
                  strokeWeight: 7,
              }}
            />
            <Marker
              name={'Policia'}
              position={this.state.lineCoordinates !== null ? this.state.lineCoordinates[this.state.actualPos]:'0,0'} 
              icon={{
                url: markerIcon,
                anchor: new this.props.google.maps.Point(15,15),
                scaledSize: new this.props.google.maps.Size(32,32)
              }}/>
            {this._renderRow()}
        </Map>
      </div>
    );
  }
  /* Cambia vista */
  changeView(num){
    this.setState({viewSelected:num})
    console.log(this.state.viewSelected)
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
            <Nav.Link eventKey="link-1"onSelect={() => this.changeView(1)}>Inicio</Nav.Link>
            <Nav.Link eventKey="link-2" onSelect={() => this.changeView(2)} >Denuncias</Nav.Link>
            <Nav.Link eventKey="link-3" onSelect={() => this.changeView(3)} >Emergencias</Nav.Link>
            <hr className="titleLine"/>
            <Nav.Link eventKey="link-4">Informacion</Nav.Link>
            <Nav.Link eventKey="link-5" onSelect={() => this.minimizeWindow()} >Ayuda</Nav.Link>
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
        <div className="App-header">
          <Row noGutters={true}  style={{height:'100%',minWidth:'600px'}}>
            <Col style={styleCol1} lg={4}>
              <div className="stats">
                <h5 style={{padding:'10px'}}>Denuncias recientes</h5>
              </div>
              <SimpleBar className="list" >
                <Nav fill defaultActiveKey="link-1" className="flex-column" variant="reportList">
                  {[...Array(70)].map((x, i) =>
                  <Nav.Link eventKey={"link-" + (i+1)} className="reportFont" >
                    Reporte {i+1} <br/>
                    <light>Asalto - 10/10/19 - Status</light>
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
                    <h5 style={{padding:'10px'}}>Seguimiento de denuncias</h5>
                  </div>
                  <SimpleBar className="listChild">

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
        <p className="reportFont" >Fecha y hora de reporte <br/> <light>10/10/10</light> </p>
        <p className="reportFont" >Ubicación del incidente <br/> <light>Long, Lat</light></p>
        <p className="reportFont" >Tipo de delito <br/> <light>Asalto</light></p>
        <p className="reportFont" >ID reporte <br/> <light>1234567890ABCDEF</light></p>
      </Col>
      <Col>
        <p className="reportFont" >Fecha y hora del incidente <br/> <light>10/10/10</light> </p>
        <p>Descripción</p>
        <SimpleBar className="reportDesc">
          <light>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </light>
        </SimpleBar>
      </Col>
      
    </Row>
    </div>
    );
  }
  /* Render de seguimientoa denuncias */
  _renderSegdenun(){

  }
  /* render principal de la aplicacion */
  render(){
    let item;
    switch(this.state.viewSelected ){
      case 1:
        item = this._renderMap();
        break;
      case 2:
        item = this._renderDenuncias();
        break;
      case 3:
        item = null
        break;
    }
    return(
      <Container style={{ padding: 0, margin: 0, backgroundColor:'#303136', height:'100vh'}} fluid={true}>
        {this.scripts()}
        {this._renderTitleBar()}
        <Row noGutters={true} className="bottomRow">
            {this._renderSideBar()}
          <Col>
            {item}
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
