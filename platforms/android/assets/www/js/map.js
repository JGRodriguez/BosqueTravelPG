$(document).ready(function(){
            var $map_canvas = $( "#googleMap" );
            $map_canvas.css({"width": "100%", "height": $( window ).height()*0.5});

            $( window ).resize(function() {
              
                // if( window.innerHeight != screen.height) {
                    $map_canvas.css({"width": "100%", "height": $( window ).height()*0.5}); // browser is  not fullscreen
                    
                   
                // }else{
                //     $map_canvas.css({"width": "100%", "height": $( window ).height()});
                // }
            });
});


$(document).on("pageshow","#rutainfo",function(){
	var map;
    var arrayMarcadores = [];
    var marcadorTemp;
    
    var onSuccess= function(position){
        console.log("yes");
        var $map_canvas = $( "#googleMap" );
            $map_canvas.css({"width": "100%", "height": $( window ).height()*0.5});
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

            ubicacionActual.setMap(map);  
    }
    var onError= function(error){
        console.log(error.message);
        alert(error.message);
    }
	navigator.geolocation.getCurrentPosition(onSuccess,onError);

});