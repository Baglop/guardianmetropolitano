(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{125:function(e,t,a){},133:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(16),i=a.n(l),o=(a(77),a(40)),s=a.n(o),c=a(18),u=a(61),m=a(24),p=a(25),d=a(27),h=a(26),g=a(28),f=(a(80),a(12)),v=a(62),y=a.n(v),E=a(63),k=a.n(E),w=a(135),b=a(136),A=a(138),C=a(137),S=a(17),x=a(13),R=a(66),N=a.n(R),D=(a(59),a(60),a(125),a(126),a(67)),L=a.n(D),M=function(e){function t(e){var a;return Object(m.a)(this,t),(a=Object(d.a)(this,Object(h.a)(t).call(this,e))).state={viewSelected:a.props.viewSelected},a}return Object(g.a)(t,e),Object(p.a)(t,[{key:"componentWillReceiveProps",value:function(e){this.setState({viewSelected:e.viewSelected})}},{key:"render",value:function(){return r.a.createElement("div",{className:"App-header",style:{display:4===this.state.viewSelected?"block":"none"}},r.a.createElement("img",{src:L.a,height:"290px",width:"250px"}),r.a.createElement("h2",null,"Silicon Bear"),"z")}}]),t}(n.Component),I=window.require("electron").remote,z=window.require("node-notifier"),j=N.a.connect("http://siliconbear.dynu.net:3030"),F=[{id:1,patrulla:"JAL16",lat:20.657506,lng:-103.269846,color:"#ff0000",libre:!0},{id:2,patrulla:"JAL20",lat:20.675314,lng:-103.3413,color:"#ff00bf",libre:!0},{id:3,patrulla:"JAL13",lat:20.67437,lng:-103.424668,color:"#b200ff",libre:!0},{id:4,patrulla:"JAL55",lat:20.705093,lng:-103.326156,color:"#3b00ff",libre:!0},{id:5,patrulla:"JAL40",lat:20.649956,lng:-103.32356,color:"#0077ff",libre:!0},{id:6,patrulla:"JAL30",lat:20.657506,lng:-103.269846,color:"#00e5ff",libre:!0},{id:7,patrulla:"JAL04",lat:20.646251,lng:-103.395829,color:"#00ff83",libre:!0},{id:8,patrulla:"JAL05",lat:20.708294,lng:-103.410163,color:"#2aff00",libre:!0},{id:9,patrulla:"JAL78",lat:20.62625,lng:-103.241935,color:"#bbff00",libre:!0},{id:10,patrulla:"JAL36",lat:20.616932,lng:-103.314162,color:"#ffa500",libre:!0}],P=["Robo","Asalto","Acoso","Vandalismo","Pandillerismo","Violaci\xf3n","Secuestro o tentativa","Asesinato"],O=function(e){function t(e){var a;return Object(m.a)(this,t),(a=Object(d.a)(this,Object(h.a)(t).call(this,e))).state={visible:!1,viewSelected:1,carCoords:null,actualPos:0,reports:[],currentPCar:0,currentReport:0,currentDetailReport:0,mapView:null,showInfo:!0,markerArray:[],emergencyArray:[],reportFilter:8,centerFocus:{lat:20.663609,lng:-103.348982}},a}return Object(g.a)(t,e),Object(p.a)(t,[{key:"componentWillMount",value:function(){this.startSocket(),this.setState({mapView:this._renderMap()})}},{key:"startSocket",value:function(){var e=this;j.emit("vigilarSalaAgentePoliciaco"),j.on("botonDePanicoPresionado",function(t){return e.botonDePanicoPresionado(t)}),j.on("reporteNuevo",function(){var t=Object(u.a)(s.a.mark(function t(a){var n,r;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("**************************************** reporteNuevo ****************************************"),console.log(a),t.next=4,e.getAddress(a.latitud,a.longitud);case 4:n=t.sent,console.log(n),Object.defineProperty(a,"direccion",{enumerable:!0,configurable:!0,writable:!0,value:n}),e.setState(function(e){return{reports:[].concat(Object(c.a)(e.reports),[a])}},function(){var t=new e.props.google.maps.Marker({position:{lat:Number(a.latitud),lng:Number(a.longitud)},map:e.homeMap,nombreUsuario:a.autorReporte,fechaIncidente:a.fechaIncidente,fechaReporte:a.fechaReporte});r=new e.props.google.maps.InfoWindow({content:'<p style="color:black">'+P[a.tipoReporte-1]+"</p>",disableAutoPan:!0}),t.addListener("click",function(){e.homeMap.panTo(t.position),r.open(e.homeMap,t)}),Object.defineProperty(a,"marker",{enumerable:!0,configurable:!0,writable:!0,value:t})});case 8:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}())}},{key:"updateMarkerPos",value:function(e){var t=this,a=this.state.emergencyArray.map(function(e){return e.nombreUsuario}).indexOf(e.nombreUsuario);if(console.log(a),-1==a){var n=this.mapComponent,r=new this.props.google.maps.Marker({position:{lat:Number(e.coordenadaX),lng:Number(e.coordenadaY)},map:n,nombreUsuario:e.nombreUsuario,horaActualizacion:e.horaActualizacion});r.addListener("click",function(){t.setCurrentreport(t.state.emergencyArray.length-1),t.changeCenter(r.position)}),this.setState(function(e){return{emergencyArray:[].concat(Object(c.a)(e.emergencyArray),[r])}}),this.mapComponent.panTo(r.position),console.log(r)}else{var l=this.state.emergencyArray;l[a].horaActualizacion=e.horaActualizacion,this.setState({emergencyArray:l},function(){return t.state.emergencyArray[a].setPosition(new t.props.google.maps.LatLng(Number(e.coordenadaX),Number(e.coordenadaY)))})}console.log(e)}},{key:"botonDePanicoPresionado",value:function(e){var t=this;z.notify({title:e.titulo,message:e.mensaje,wait:!0}),z.on("click",function(e,a){t.changeView(3),I.getCurrentWindow().show()}),console.log(e),j.on("alertaPublica_posicionActualizada",function(e){return t.updateMarkerPos(e)})}},{key:"_renderTitleBar",value:function(){var e=this;return r.a.createElement("div",{className:"title-bar"},r.a.createElement("div",{className:"app-name-container "},"Ojo metropolitano"),r.a.createElement("div",{className:"window-controls-container"},r.a.createElement("a",{className:"minimize-button",onClick:function(){return e.minimizeWindow()}},r.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 512 512"},r.a.createElement("path",{d:"M96 235h320v42H96z"}))),r.a.createElement("a",{className:"min-max-button",onClick:function(){return e.maximazeWindow()}},r.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"100%",viewBox:"0 0 512 512"},r.a.createElement("path",{d:"M405.3 106.7v298.7H106.7V106.7h298.6m0-42.7H106.7C83.2 64 64 83.2 64 106.7v298.7c0 23.5 19.2 42.7 42.7 42.7h298.7c23.5 0 42.7-19.2 42.7-42.7V106.7C448 83.2 428.8 64 405.3 64z"}))),r.a.createElement("a",{className:"close-button",onClick:function(){return e.closeApp()}},r.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"100%",viewBox:"0 0 512 512"},r.a.createElement("path",{d:"M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"})))))}},{key:"minimizeWindow",value:function(){I.getCurrentWindow().minimize()}},{key:"maximazeWindow",value:function(){var e=I.getCurrentWindow();e.isMaximized()?e.unmaximize():e.maximize()}},{key:"closeApp",value:function(){I.app.quit()}},{key:"drawCar",value:function(e){var t=this;console.log(e),console.log(this.state.markerArray[e].intervalID),console.log(this.state.markerArray[e].position);var a=this.state.markerArray,n=a[e].lienarCoord.filter(function(e,t){return 0!==t});if(a[e].lienarCoord=n,console.log(a[e].lienarCoord),this.setState({markerArray:a},function(){return t.state.markerArray[e].setPosition(a[e].lienarCoord[0])}),null!=this.state.markerArray[e].lienarCoord&&0==this.state.markerArray[e].lienarCoord.length){clearInterval(this.state.markerArray[e].intervalID),a[e].lienarCoord=null,this.setState({markerArray:a});var r=new this.props.google.maps.LatLng(F[e].lat,F[e].lng);this.state.markerArray[e].setPosition(r)}}},{key:"getAddress",value:function(e,t){var a,n=new this.props.google.maps.Geocoder,r={lat:parseFloat(e),lng:parseFloat(t)};return new Promise(function(e){return n.geocode({location:r},function(t,n){"OK"===n?t[0]?(console.log(t[0].formatted_address),a=t[0].formatted_address,e(a)):e(r):window.alert("Geocoder failed due to: "+n)})})}},{key:"handleMapLoad",value:function(e,t){this.mapComponent=t,t.panTo(this.state.centerFocus)}},{key:"scripts",value:function(){return r.a.createElement("div",null,r.a.createElement("script",{src:"https://unpkg.com/react/umd/react.production.js",crossorigin:!0}),r.a.createElement("script",{src:"https://unpkg.com/react-dom/umd/react-dom.production.js",crossorigin:!0}),r.a.createElement("script",{src:"https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js",crossorigin:!0}),r.a.createElement("script",null,"var Alert = ReactBootstrap.Alert;"),r.a.createElement("link",{rel:"stylesheet",href:"https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",integrity:"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T",crossorigin:"anonymous"}))}},{key:"drawRoute",value:function(e){var t=this,a=this.props.google,n=new a.maps.DirectionsService;this.state.emergencyArray.length>0&&n.route({origin:this.state.markerArray[e].position,destination:this.state.emergencyArray[this.state.currentReport].position,travelMode:a.maps.TravelMode.DRIVING},function(n,r){if(r===a.maps.DirectionsStatus.OK){var l=n.routes[0].overview_path;l;var i=Object(c.a)(t.state.markerArray);i[e].lienarCoord=l;var o=setInterval(function(){return t.drawCar(e)},2e3);i[e].intervalID=o,t.setState({markerArr:i})}else console.warn("error fetching directions ".concat(r))})}},{key:"changeCenter",value:function(e){this.setState({centerFocus:e}),console.log(e),this.mapComponent.panTo(e)}},{key:"setCurrentPCar",value:function(e){var t=this;console.log(e),this.setState({currentPCar:e},function(){return t.drawRoute(e)})}},{key:"setCurrentreport",value:function(e){this.setState({currentReport:e})}},{key:"setCurrentDetailsreport",value:function(e){this.setState({currentDetailReport:e})}},{key:"changeInfoState",value:function(){var e=this;this.setState({showInfo:!this.state.showInfo},function(){e.state.showInfo?e.state.markerArray.map(function(t){return t.infowindowRef.open(e.mapComponent,t)}):e.state.markerArray.map(function(e){return e.infowindowRef.close()})}),console.log(this.state.showInfo)}},{key:"deleteEmercy",value:function(e){this.state.emergencyArray[e].setMap(null);var t=this.state.emergencyArray.filter(function(t,a){return a!==e});this.setState(function(e){return{emergencyArray:t}}),console.log(t)}},{key:"_renderRow",value:function(){var e=this;return r.a.createElement(w.a,{noGutters:!0,style:{height:"50%",minWidth:"500px"}},r.a.createElement(b.a,{style:{display:"flex",flexDirection:"column",marginRight:"2px",paddingRight:"2px"}},r.a.createElement("div",{className:"stats",style:{flexDirection:"row",display:"flex"}},r.a.createElement("h5",{style:{padding:"10px"}},"Reportes")),r.a.createElement(x.a,{className:"list"},r.a.createElement(A.a,{fill:!0,defaultActiveKey:"link-1",className:"flex-column",variant:"reportList"},this.state.emergencyArray.map(function(t,a){return r.a.createElement(A.a.Link,{eventKey:"link-"+(a+1),className:"reportFont",onSelect:function(){return e.setCurrentreport(a),e.changeCenter(t.position)}},r.a.createElement("div",{style:{width:"50%"}},"Emergencia ",a+1," - ",t.nombreUsuario,r.a.createElement("br",null),r.a.createElement("light",null,t.horaActualizacion)),r.a.createElement("div",{style:{display:"flex",justifyContent:"flex-end",alignItems:"center",width:"50%"}},r.a.createElement("button",{className:"deleteEmergencyButton",onClick:function(){return e.deleteEmercy(a)}},"Eliminar")))})))),r.a.createElement(b.a,{style:{display:"flex",flexDirection:"column"}},r.a.createElement("div",{className:"stats",style:{flexDirection:"row",display:"flex"}},r.a.createElement("h5",{style:{padding:"10px"}},"Policia disponible"),r.a.createElement("a",{className:"hideInfo",onClick:function(){return e.changeInfoState()}},this.state.showInfo?r.a.createElement(f.c,null):r.a.createElement(f.b,null))),r.a.createElement(x.a,{className:"list"},r.a.createElement(A.a,{fill:!0,defaultActiveKey:"link-1",className:"flex-column",variant:"reportList"},F.map(function(t,a){return r.a.createElement(A.a.Link,{eventKey:"link-"+(a+1),className:"reportFont",onSelect:function(){return e.setCurrentPCar(a)}},r.a.createElement("div",null,"Patrulla ",r.a.createElement("br",null),r.a.createElement("light",null,t.patrulla)))})))))}},{key:"_renderMap",value:function(){var e=this;return r.a.createElement("div",{className:"App-header",style:{display:3===this.state.viewSelected?"block":"none"}},r.a.createElement(S.Map,{google:this.props.google,zoom:13,center:this.state.centerFocus,ref:function(t){e.mapa=t},fullscreenControl:!1,rotateControl:!1,streetViewControl:!1,mapTypeControl:!1,style:{height:"50%",position:"relative",minWidth:"500px"},onReady:this.handleMapLoad.bind(this)},this.state.markerArray.map(function(e,t){return r.a.createElement(S.Polyline,{path:e.lienarCoord,geodesic:!1,strokeColor:e.lineColor,options:{strokeOpacity:1,strokeWeight:7}})}),this._renderRow()))}},{key:"handleHomeMapLoad",value:function(e,t){var a=this;this.homeMap=t,t.panTo(this.state.centerFocus);var n,r=e.google;F.map(function(e,l){return n=new r.maps.Marker({position:{lat:e.lat,lng:e.lng},map:t,title:"Hello World!",icon:{url:k.a,anchor:new a.props.google.maps.Point(15,15),scaledSize:new a.props.google.maps.Size(32,32)},lienarCoord:null,intervalID:0,lineColor:e.color,libre:!0,infowindowRef:null}),a.setState(function(e){return{markerArray:[].concat(Object(c.a)(e.markerArray),[n])}}),n.infowindowRef=new a.props.google.maps.InfoWindow({content:'<p style="color:black">'+e.patrulla+"</p>",disableAutoPan:!0}),n.infowindowRef.open(t,n)})}},{key:"filter",value:function(e){var t=this;this.state.reports.map(function(a){a.tipoReporte-1==e||8==e?a.marker.setMap(t.homeMap):a.marker.setMap(null)})}},{key:"handleRadioChange",value:function(e){var t=this;console.log(this.state.reportFilter),this.state.reportFilter!==e.target.value?this.setState({reportFilter:e.target.value},function(){return t.filter(t.state.reportFilter)}):this.setState({reportFilter:8},function(){return t.filter(t.state.reportFilter)})}},{key:"_renderFilter",value:function(){var e=this;return r.a.createElement("div",{style:{position:"absolute",top:10,left:10,zIndex:99,backgroundColor:"rgba(48, 49, 54,0.7)",padding:10}},r.a.createElement("label",null,r.a.createElement("input",{type:"radio",value:8,checked:8==this.state.reportFilter,onClick:function(t){return e.handleRadioChange(t)}}),"Todos"),"  ",r.a.createElement("br",null),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",value:0,checked:0==this.state.reportFilter,onClick:function(t){return e.handleRadioChange(t)}}),"Robo"),r.a.createElement("br",null),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",value:1,checked:1==this.state.reportFilter,onClick:function(t){return e.handleRadioChange(t)}}),"Asalto"),r.a.createElement("br",null),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",value:2,checked:2==this.state.reportFilter,onClick:function(t){return e.handleRadioChange(t)}}),"Acoso"),r.a.createElement("br",null),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",value:3,checked:3==this.state.reportFilter,onClick:function(t){return e.handleRadioChange(t)}}),"Vandalismo"),r.a.createElement("br",null),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",value:4,checked:4==this.state.reportFilter,onClick:function(t){return e.handleRadioChange(t)}}),"Pandillerismo"),r.a.createElement("br",null),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",value:5,checked:5==this.state.reportFilter,onClick:function(t){return e.handleRadioChange(t)}}),"Violaci\xf3n"),r.a.createElement("br",null),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",value:6,checked:6==this.state.reportFilter,onClick:function(t){return e.handleRadioChange(t)}}),"Secuestro o tentativa"),r.a.createElement("br",null),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",value:7,checked:7==this.state.reportFilter,onClick:function(t){return e.handleRadioChange(t)}}),"Asesinato"),r.a.createElement("div",null,"Numero de patrulla ",r.a.createElement("a",{className:"hideInfo",onClick:function(){return e.changeInfoState()}},this.state.showInfo?r.a.createElement(f.c,null):r.a.createElement(f.b,null))))}},{key:"_renderHomeMap",value:function(){var e=this;return r.a.createElement("div",{className:"App-header",style:{display:1===this.state.viewSelected?"block":"none"}},r.a.createElement(S.Map,{google:this.props.google,zoom:13,initialCenter:this.state.centerFocus,ref:function(t){e.mapa=t},fullscreenControl:!1,rotateControl:!1,streetViewControl:!1,mapTypeControl:!1,style:{height:"100%",position:"relative",minWidth:"500px"},onReady:this.handleHomeMapLoad.bind(this)},this._renderFilter()))}},{key:"changeView",value:function(e){var t=this;this.setState({viewSelected:e}),console.log(this.state.viewSelected),1==e&&this.state.markerArray.map(function(e){e.setMap(t.homeMap),t.props.google.maps.event.clearListeners(e,"click")}),3==e&&this.state.markerArray.map(function(e,a){e.setMap(t.mapComponent),e.addListener("click",function(){t.setCurrentPCar(a)})})}},{key:"_renderSideBar",value:function(){var e=this;return r.a.createElement("div",{className:"sidebar"},r.a.createElement("div",{className:"logoSide"},r.a.createElement("img",{src:y.a,width:180,height:180})),r.a.createElement("hr",{className:"titleLine"}),r.a.createElement(A.a,{fill:!0,defaultActiveKey:"link-1",className:"flex-column",variant:"pills"},r.a.createElement(A.a.Link,{active:1===this.state.viewSelected,eventKey:"link-1",onSelect:function(){return e.changeView(1)}},"Inicio"),r.a.createElement(A.a.Link,{active:2===this.state.viewSelected,eventKey:"link-2",onSelect:function(){return e.changeView(2)}},"Denuncias"),r.a.createElement(A.a.Link,{active:3===this.state.viewSelected,eventKey:"link-3",onSelect:function(){return e.changeView(3)}},"Emergencias ",this.state.emergencyArray.length>0&&r.a.createElement(f.a,{style:{marginLeft:40,color:"red",fontSize:22}})),r.a.createElement("hr",{className:"titleLine"}),r.a.createElement(A.a.Link,{eventKey:"link-6",onSelect:function(){return e.closeApp()}},"Salir")))}},{key:"_renderDenuncias",value:function(){var e=this,t={display:"flex",flexDirection:"column",marginRight:"2px",paddingRight:"2px"};return r.a.createElement("div",{className:"App-header",style:{display:2===this.state.viewSelected?"block":"none"}},r.a.createElement(w.a,{noGutters:!0,style:{height:"100%",minWidth:"600px"}},r.a.createElement(b.a,{style:t,lg:4},r.a.createElement("div",{className:"stats"},r.a.createElement("h5",{style:{padding:"10px"}},"Denuncias recientes")),r.a.createElement(x.a,{className:"list"},r.a.createElement(A.a,{fill:!0,defaultActiveKey:"link-1",className:"flex-column",variant:"reportList"},this.state.reports.map(function(t,a){return r.a.createElement(A.a.Link,{eventKey:"link-"+(a+1),className:"reportDetails",onSelect:function(){return e.setCurrentDetailsreport(a)}},"Reporte ",a+1," - ",t.autorReporte," ",r.a.createElement("br",null),r.a.createElement("light",null,P[Number(t.tipoReporte)-1]," - ",t.fechaIncidente," - Status"))})))),r.a.createElement(b.a,null,r.a.createElement(w.a,{noGutters:!0,style:{height:"50%",minWidth:"600px",paddingBottom:"1px"}},r.a.createElement(b.a,{style:{display:"flex",flexDirection:"column"}},r.a.createElement("div",{className:"stats",style:{backgroundColor:"#3b3f46"}},r.a.createElement("h5",{style:{padding:"10px"}},"Detalles")),this._renderDenunciasDetails())),r.a.createElement(w.a,{noGutters:!0,style:{height:"50%",minWidth:"600px"}},r.a.createElement(b.a,{style:t},r.a.createElement("div",{className:"stats",style:{backgroundColor:"#3b3f46"}},r.a.createElement("h5",{style:{padding:"10px"}},"Evidencia")),r.a.createElement(x.a,{className:"listChild"},r.a.createElement("img",{src:this.state.reports.length>0&&this.state.reports[this.state.currentDetailReport].evidencia})))))))}},{key:"_renderDenunciasDetails",value:function(){return r.a.createElement("div",{className:"listChild",style:{padding:"10px"}},r.a.createElement(w.a,{noGutters:!0},r.a.createElement(b.a,null,r.a.createElement("p",{className:"reportDetails"},"Fecha y hora de reporte ",r.a.createElement("br",null)," ",r.a.createElement("light",null,this.state.reports.length>0?this.state.reports[this.state.currentDetailReport].fechaReporte:"0/0/0")," "),r.a.createElement("p",{className:"reportDetails"},"Ubicaci\xf3n del incidente ",r.a.createElement("br",null)," ",r.a.createElement("light",null,this.state.reports.length>0?this.state.reports[this.state.currentDetailReport].direccion:"0")),r.a.createElement("p",{className:"reportDetails"},"Tipo de delito ",r.a.createElement("br",null)," ",r.a.createElement("light",null,P[this.state.reports.length>0?Number(this.state.reports[this.state.currentDetailReport].tipoReporte)-1:0])),r.a.createElement("p",{className:"reportDetails"},"ID reporte ",r.a.createElement("br",null)," ",r.a.createElement("light",null,this.state.reports.length>0?this.state.reports[this.state.currentDetailReport]._id:"0"))),r.a.createElement(b.a,null,r.a.createElement("p",{className:"reportDetails"},"Fecha y hora del incidente ",r.a.createElement("br",null)," ",r.a.createElement("light",null,this.state.reports.length>0?this.state.reports[this.state.currentDetailReport].fechaIncidente:"0/0/0")," "),r.a.createElement("p",null,"Descripci\xf3n"),r.a.createElement(x.a,{className:"reportDesc"},r.a.createElement("light",null,this.state.reports.length>0?this.state.reports[this.state.currentDetailReport].descripcion:"")))))}},{key:"render",value:function(){return r.a.createElement(C.a,{style:{padding:0,margin:0,backgroundColor:"#303136",height:"100vh"},fluid:!0},this.scripts(),this._renderTitleBar(),r.a.createElement(w.a,{noGutters:!0,className:"bottomRow"},this._renderSideBar(),r.a.createElement(b.a,null,this._renderHomeMap(),this._renderMap(),this._renderDenuncias(),r.a.createElement(M,{viewSelected:this.state.viewSelected}))))}}]),t}(n.Component),W=Object(S.GoogleApiWrapper)({apiKey:"AIzaSyCjHyW6npZt7iB0RCIzI-XGdrYMMhi9tSY"})(O);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(W,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},60:function(e,t,a){},62:function(e,t,a){e.exports=a.p+"static/media/Ojo_Metropolitano_Logo.325927ca.PNG"},63:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAA+klEQVR4Ae3TIUiDQRjH4UdEMGmxCILJMHtWm2CyaK/2sLgLGp1tYDKY1vswa57gguZNt2IwvlZht++OVff8+h/eg7Oy8te+jlSoY1/BnomoaGJPo64w9VRoKtxqsGYsdJQkYWzNQidCOFByKIQjC90LQzVGQk+edbOqwyAJM+uyzhoOyx93Kusxf1jDcQ8yNv0IL1Jlz8K3DXMuxBKdZ59vidLioS89A9HQQM9naejDLmiLfNpg13vz0B1gS+SzDeg2D/UBLSFfC9AvvdGNHcfehHwjx3ZcF96ovn8+lMrVDVWYG8p82lc1hkIIlzKuJMmhGi1JckW9lV81zoqX72Is/AAAAABJRU5ErkJggg=="},67:function(e,t,a){e.exports=a.p+"static/media/logoSilicon.bd75cf59.png"},72:function(e,t,a){e.exports=a(133)},77:function(e,t,a){},80:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"}},[[72,1,2]]]);
//# sourceMappingURL=main.fa3ec4c9.chunk.js.map