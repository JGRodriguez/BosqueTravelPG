var actualizadorBus;
$(document).on("pageshow","#rutainfo",function(){
	var map;
    var arrayMarcadores = [];
    var marcadorTemp;
    var idRutaSeleccionada=localStorage.getItem("idRuta");
    var idBusRuta;
    var markerBus;
    var otromarker;
    $.getJSON(serverURL+"/route_schedule", function( data ) {
        var infowindow = new google.maps.InfoWindow();
        for(var i=0;i<data.length;i++){
            if(data[i].id_route_schedule==idRutaSeleccionada){
                $("#infoNombre").text("Ruta: "+data[i].name);
                $("#infoOrigen").text("Origen:"+data[i].source);
                $("#infoDestino").text("Destino:"+data[i].source);
                idBusRuta=data[i].bus.id_bus;
                break;
            }
        }
    }).fail( function(d, textStatus, error) {
        console.log("getJSON failed, status: " + textStatus + ", error: "+error);
        alert("getJSON failed, status: " + textStatus + ", error: "+error);
    });

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
        $.getJSON(serverURL+"/stops", function( data ) {
            // var infowindow = new google.maps.InfoWindow();
            for(var i=0;i<data.length;i++){
                new google.maps.Marker({
                    position: new google.maps.LatLng(data[i].latitude,data[i].longitude),
                    map: map,
                    animation: google.maps.Animation.DROP
                });
                                               
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