var actualizadorBus;
var markerBus;
$(document).on("pageshow","#rutainfo",function(){
    var map;
    var arrayMarcadores = [];
    var marcadorTemp;
    var idRutaSeleccionada=localStorage.getItem("idRuta");
    var idBusRuta;
    var otromarker;

    var onSuccess= function(position){
        otromarker=position;
        console.log("yes");
        var $map_canvas = $( "#googleMap" );
        $map_canvas.css({"width": "100%", "height": $( window ).height()*0.7});
        var mapOptions = {
            center: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
            zoom:12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl:false,
            streetViewControl:false,
            // fullscreenControl:true,
            // fullscreenControlOptions:true
         }
        map=new google.maps.Map(document.getElementById("googleMap"),mapOptions);
        var ubicacionActual = new google.maps.Marker({
                position:  new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                icon: 'img/man_marker.png',
                map: map,
                title: 'Yo'

            });
        $.getJSON(serverURL+"/route_schedule", function( data ) {
            // var infowindow = new google.maps.InfoWindow();
            for(var i=0;i<data.length;i++){
                if(data[i].id_route_schedule==idRutaSeleccionada){
                    $("#infoNombre").text("Ruta: "+data[i].name);
                    $("#infoOrigen").text("Origen:"+data[i].source);
                    $("#infoDestino").text("Destino:"+data[i].destination);
                    idBusRuta=data[i].bus.id_bus;
                    
                    for(var j=0;j<data[i].road.stops.length;j++){
                        new google.maps.Marker({
                            position: new google.maps.LatLng(data[i].road.stops[j].latitude,data[i].road.stops[j].longitude),
                            map: map,
                            animation: google.maps.Animation.DROP
                        });
                    }
                }                            
            }
        }).fail( function(d, textStatus, error) {
            console.log("getJSON failed, status: " + textStatus + ", error: "+error);
            alert("getJSON failed, status: " + textStatus + ", error: "+error);
        }); 

    }
    var onError= function(error){
        console.log(error.message);
        alert(error.message);
    }
    navigator.geolocation.getCurrentPosition(onSuccess,onError);

    var actualizarPosicionBus = function(){
        $.getJSON(serverURL+"/bus", function( data ) {
            // var infowindow = new google.maps.InfoWindow();
            for(var i=0;i<data.length;i++){
                if(data[i].id_bus==idBusRuta){

                    markerBus = new google.maps.Marker({
                        position:  new google.maps.LatLng(data[i].actual_latitude, data[i].actual_longitude),
                        icon: 'img/bus_marker.png',
                        map: map,
                        title: 'Yo'

                    });

                    console.log("actualizó!");
                    break;
                }
            }
        }).fail( function(d, textStatus, error) {
            console.log("getJSON failed, status: " + textStatus + ", error: "+error);
            alert("getJSON failed, status: " + textStatus + ", error: "+error);
        });
    };

    actualizarPosicionBus();
    actualizadorBus=setInterval(actualizarPosicionBus,3000);
});
$(document).on('pagebeforehide', '#rutainfo', function(){       
    clearInterval(actualizadorBus);
});
$(document).on("pageshow","#mapaC",function(){
    var map;
    var marcadorTemp;
    
    var otromarker;

    var onSuccess= function(position){
        otromarker=position;
        console.log("yes");
        var $map_canvas = $( "#googleMap" );
        $map_canvas.css({"width": "100%", "height": $( window ).height()*0.7});
        var mapOptions = {
            center: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
            zoom:17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl:false,
            streetViewControl:false,
            // fullscreenControl:true,
            // fullscreenControlOptions:true
         }
        map=new google.maps.Map(document.getElementById("googleMap"),mapOptions);
        markerBus = new google.maps.Marker({
                position:  new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                icon: 'img/bus_marker.png',
                map: map,
                title: 'Bus'

            });

    }
    var onError= function(error){
        console.log("Error:"+error.message);
        alert(error.message);
    }
    navigator.geolocation.getCurrentPosition(onSuccess,onError);

    var actualizarPosicionBus = function(){

                // console.log(new Date().getTime());
        var trackId = navigator.geolocation.watchPosition(successCallback, null, {maximumAge:1000, timeout:60000, enableHighAccuracy:true});
            function successCallback(position){
                markerBus.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            };

    };

    actualizarPosicionBus();
    actualizadorBus=setInterval(actualizarPosicionBus,3000);
});