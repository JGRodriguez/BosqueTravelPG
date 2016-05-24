var actualizadorBus;
var markerBus;
$(document).on("pageshow","#rutainfo",function(){
    var map;
    var infoWindow = new google.maps.InfoWindow();
    var idRutaSeleccionada=localStorage.getItem("idRuta");
    var idBusRuta;
    var clickedMarker;

    var agregarParada =function(latitud, longitud, nombre){
        var temp=new google.maps.Marker({
            position: new google.maps.LatLng(latitud,longitud),
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'img/marker.png',
            title: nombre
        });

        google.maps.event.addListener(temp, 'click', function (point) {
            infoWindow.close();
            infoWindow.setContent("Nombre de la parada: "+nombre);
            infoWindow.open(map, temp);
           temp.setIcon('img/marker_yellow.png');
           if(clickedMarker!=null)
            clickedMarker.setIcon('img/marker.png');
           clickedMarker=temp;
        });
    }

    var onSuccess= function(position){
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
            for(var i=0;i<data.length;i++){
                if(data[i].id_route_schedule==idRutaSeleccionada){
                    $("#infoNombre").text("Ruta: "+data[i].name);
                    $("#infoOrigen").text("Origen:"+data[i].source);
                    $("#infoDestino").text("Destino:"+data[i].destination);
                    idBusRuta=data[i].bus.id_bus;
                    
                    for(var j=0;j<data[i].road.stops.length;j++){
                        agregarParada(data[i].road.stops[j].latitude,data[i].road.stops[j].longitude,data[i].road.stops[j].name);

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
    var arrayMarkers= [];
    var map;
    $('#accionRuta').click(function () {
        if($('#accionRuta').val()=="Iniciar"){
            var idRutaSeleccionada=$('#listaRutasC').val();

            if(idRutaSeleccionada!=0){
                $.getJSON(serverURL+"/route_schedule", function( data ) {
                    arrayMarkers= [];
                    for(var i=0;i<data.length;i++){
                        if(data[i].id_route_schedule==idRutaSeleccionada){
                            for(var j=0;j<data[i].road.stops.length;j++){
                                arrayMarkers[j]= new google.maps.Marker({
                                    position: new google.maps.LatLng(data[i].road.stops[j].latitude,data[i].road.stops[j].longitude),
                                    map: map,
                                    animation: google.maps.Animation.DROP,
                                    icon: "img/marker.png"
                                });

                            }
                        }                            
                    }
                }).fail( function(d, textStatus, error) {
                    console.log("getJSON failed, status: " + textStatus + ", error: "+error);
                    alert("getJSON failed, status: " + textStatus + ", error: "+error);
                }); 
            }else{
                alert("Debes escojer una ruta de la lista antes de iniciar");
            }
            $('#accionRuta').val("Terminar");
        }else if($('#accionRuta').val()=="Terminar"){
            for (var i = 0; i < arrayMarkers.length; i++ ) {
                arrayMarkers[i].setMap(null);
            }
            $('#accionRuta').val("Iniciar");
        }
        $('#accionRuta').button("refresh");
    });




    $.getJSON(serverURL+"/route_schedule", function( data ) {
        var lista=$('#listaRutasC'); 
            for(var i=0;i<data.length;i++){
                
                lista.append("<option value='"+data[i].id_route_schedule+"'>"+data[i].name+"</option>");                        
            }
    }).fail( function(d, textStatus, error) {
        console.log("getJSON failed, status: " + textStatus + ", error: "+error);
        alert("getJSON failed, status: " + textStatus + ", error: "+error);
    }); 

    var onSuccess= function(position){
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
