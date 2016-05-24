var actualizador;
var lista;
var itemHTML;
$(document).on('pagebeforehide', '#rutas', function(){       
    clearInterval(actualizador);

});
$(document).on("pageshow","#rutas",function(){ // When entering pagetwo
    var listaIds=[];
    var listaIdsNuevos=[];
    var listaIdsBorrados=[];
    var estado="";
    lista=$('#listaRutas'); 
    lista.empty();
    var actualizarRutas = function(){
        itemHTML="<li id='rutaidentificador'>"+
                    "<div class='ui-grid-b'>"+
                                "<div class='ui-block-a' style='width: 20%;'>"+
                                    //"<i class='fa fa-bus' style='font-size:48px;color:color'></i>"+
                                    "<img class='imgList' id='rutaidentificadorDisp' src='availability' height='50' width='50'>"+
                                "</div>"+
                                "<div class='ui-block-b' style='width: 65%;'>"+
                                        "<p><h2>nombreRuta</h2></p>"+
                                        "<p><b>Origen: origenRuta</b></p>"+
                                        "<p><b>Destino: destinoRuta</b></p>"+
                                        "<p><b>Puestos disponibles:<b/><b id='rutaidentificadorPuestos'> puestosDisponibles</b></p>"+
                                "</div>"+
                            "</div>"+
                            "<div class='ui-block-c' style='width: 6%;  float: right;'>"+
                                   "<a href='#rutainfo' data-role='button' data-icon='info' data-iconpos='notext' data-theme='c' data-inline='true' class='ui-link ui-btn ui-btn-c ui-icon-info ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all' style='position: absolute;top: 50%; margin: -2% 0 0 0;' role='button' onclick='localStorage.setItem(\"idRuta\", identificador)'>Ver</a><br>"+
                        "</div>"+
                  "</li>";

        $.getJSON(serverURL+"/route_schedule", function( data ) {
            console.log(data.length);
            
            for(var i=0;i<data.length;i++){
                listaIdsNuevos.push(data[i].id_route_schedule);
                //nuevo registro
                if($.inArray(data[i].id_route_schedule,listaIds)==-1){
                    if(data[i].availability>0.5){
                        estado="dispo";
                        // itemHTML= itemHTML.replace("color","green");
                    }else if(data[i].availability>0.1){
                        estado="mediolleno";
                       // itemHTML= itemHTML.replace("color","orange");
                    }else{
                        estado="lleno";
                       // itemHTML= itemHTML.replace("color","red");
                    }
                    lista.append(itemHTML.replace(/identificador/g,data[i].id_route_schedule).replace("availability","img/bus_"+estado+".png").replace('nombreRuta',data[i].name).replace('origenRuta',data[i].source).replace('destinoRuta',data[i].destination).replace('puestosDisponibles',(data[i].availability*data[i].bus.capacity).toFixed(0)));
                    listaIds.push(data[i].id_route_schedule);
                }else{
                    //registro ya existente en la lista
                    var item=lista.find("#ruta"+data[i].id_route_schedule);
                    if(data[i].availability>0.5){
                        $("#ruta"+data[i].id_route_schedule+"Disp").attr("src","img/bus_dispo.png");
                        // itemHTML= itemHTML.replace("color","green");
                    }else if(data[i].availability>0.1){
                        $("#ruta"+data[i].id_route_schedule+"Disp").attr("src","img/bus_mediolleno.png");
                        // itemHTML= itemHTML.replace("color","orange");
                    }else{
                        $("#ruta"+data[i].id_route_schedule+"Disp").attr("src","img/bus_lleno.png");
                        // itemHTML= itemHTML.replace("color","red");
                    }
                    $("#ruta"+data[i].id_route_schedule+"Puestos").text((data[i].availability*data[i].bus.capacity).toFixed(0));
                }
            }

             //borrar
            listaIdsBorrados = $(listaIds).not(listaIdsNuevos).get();
            listaIds=listaIdsNuevos;
            for(var k=0;k<listaIdsBorrados.length;k++){
                $("#ruta"+listaIdsBorrados[k]).remove();
            }


            lista.listview('refresh'); 


        }).fail( function(d, textStatus, error) {
            console.log("getJSON failed, status: " + textStatus + ", error: "+error);
            alert("getJSON failed, status: " + textStatus + ", error: "+error+"ubicación:"+serverURL+"/route_schedule")
        }); 
    } 
    actualizarRutas();
    actualizador=setInterval(actualizarRutas,5000);
});
$(document).on("pageshow","#conductores",function(){ 
    lista=$('#listaConductores');
    lista.empty();
    itemHTML="<li>"+
                "<div class='ui-grid-b'>"+
                    "<div class='ui-block-a' style='width: 20%;'>"+
                    "<img class='imgList' src='linkImagen' height='50' width='50'>"+
                    "</div>"+
                    "<div class='ui-block-b' style='width: 65%;'>"+
                        "<div data-role='fieldcontain' class='ui-field-contain'>"+
                                "<p><h2>nombreConductor apellidoConductor</h2></p>"+
                                "<p><b>Id:idConductor</b></p>"+
                                "<p><b>Edad: edadConductor años</b></p>"+
                        "</div>"+
                    "</div>"+
                    "<div class='ui-block-c' style='width: 6%;  float: right;'>"+
                        "<div style='float: right;'>"+
                           "<a href='#' data-role='button' data-icon='gear' data-iconpos='notext' data-theme='c' data-inline='true' class='ui-link ui-btn ui-btn-c ui-icon-gear ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all' role='button'>Configurar</a><br>"+
                           "<a href='#' data-role='button' data-icon='forbidden' data-iconpos='notext' data-theme='c' data-inline='true' class='ui-link ui-btn ui-btn-c ui-icon-forbidden ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all' role='button'>Eliminar</a>"+
                        "</div>"+
                    "</div>"+    
                "</div>"+
          "</li>";
    $.getJSON(serverURL+"/drivers", function( data ) {
        for(var i=0;i<data.length;i++){
            lista.append(itemHTML.replace('linkImagen','http://a4.files.biography.com/image/upload/c_fill,cs_srgb,dpr_1.0,g_face,h_300,q_80,w_300/MTI2NTgyMzIxOTcyMjU5NDU5.jpg').replace('nombreConductor',data[i].firstName).replace('apellidoConductor',' '+data[i].lastName).replace('idConductor',data[i].id).replace('edadConductor',data[i].age));
        }
        lista.listview('refresh'); 
    }).fail( function(d, textStatus, error) {
        console.log("getJSON failed, status: " + textStatus + ", error: "+error);
        alert("getJSON failed, status: " + textStatus + ", error: "+error);
    });   
});
$(document).on("pageshow","#buses",function(){ // When entering pagetwo
    lista=$('#listaBuses');
    lista.empty();
    itemHTML="<li>"+
                    "<div class='ui-grid-b'>"+
                            "<div class='ui-block-a' style='width: 20%;'>"+
                            "<img class='imgList' src='photo' height='50' width='50'>"+
                            "</div>"+
                            "<div class='ui-block-b' style='width: 65%;'>"+
                                "<div data-role='fieldcontain' class='ui-field-contain'>"+
                                        "<p><h2>placa</h2></p>"+
                                        "<p><b>Posición Actual: posicion</b></p>"+
                                        "<p><b>Capacidad: capacidad pasajeros</b></p>"+
                                "</div>"+
                            "</div>"+
                            "<div class='ui-block-c' style='width: 6%;  float: right;'>"+
                                "<div style='float: right;'>"+
                                   "<a href='#' data-role='button' data-icon='gear' data-iconpos='notext' data-theme='c' data-inline='true' class='ui-link ui-btn ui-btn-c ui-icon-gear ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all' role='button'>Configurar</a><br>"+
                                   "<a href='#' data-role='button' data-icon='forbidden' data-iconpos='notext' data-theme='c' data-inline='true' class='ui-link ui-btn ui-btn-c ui-icon-forbidden ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all' role='button'>Eliminar</a>"+
                                "</div>"+
                            "</div>"+    
                        "</div>"+
                  "</li>";
    $.getJSON(serverURL+"/bus", function( data ) {
        console.log(data.length);
        for(var i=0;i<data.length;i++){
            //para obtener la dirección de una posición, se puede hacer un callback enviando estos parámetros: http://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838
            lista.append(itemHTML.replace('photo',data[i].photo).replace('placa',data[i].license_plate).replace('capacidad',' '+data[i].capacity).replace('id',data[i].id).replace('posicion',data[i].actual_latitude+", "+data[i].actual_longitude));
        }
        lista.listview('refresh'); 
    }).fail( function(d, textStatus, error) {
        console.log("getJSON failed, status: " + textStatus + ", error: "+error);
        alert("getJSON failed, status: " + textStatus + ", error: "+error);
    });    
});