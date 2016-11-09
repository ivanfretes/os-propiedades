window.onload = function(){
    document.addEventListener("deviceready", onDeviceReady, false);
}


function onDeviceReady(){
    if (!checkConnection()){
        alert("Por favor verifque su conexion a internet");
    }
}

function checkConnection() {
    var networkState = navigator.connection.type;
/*
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'Por favor verifique su conexion a Internet';

    alert('Connection type: ' + states[networkState]);*/
    
    
    if (networkState != Connection.NONE){
        return true;
    }
    return false;
}

/*
function initMapLote(){
    
    loteMapCenter = new google.maps.LatLng(-25.3112836,-57.6006347);
    loteMapPropiedades = {
        center: loteMapCenter, //-25.3112836,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById('boxMapLote'), loteMapPropiedades);
    var marker = new google.maps.Marker({ position : loteMapCenter , icon : ""});
    marker.setMap(map);
    
    
    google.maps.event.addListener(marker,"click", function(){
        infowindow = new google.maps.InfoWindow({
           content: "OyM System Group" 
        });
        infowindow.open(map,marker);
    });

}

window.onload = ;
*/

$(document).on("ready",function(){
   
    

    //localStorage.clear(); 
    //Variables Globales para el filtro

    var montoCuotaFiltro = [0,100000, 200000, 300000,400000,500000,600000,700000,800000, 9999999999];
    var estadoLoteFiltro = ["Disponible", "Recuperado","Vendido","Cancelado","Reservado","Reserva Propietario","Reserva Vendedor"];

    // === FUNCIONES QUE SE INICIALIZAN POR FEFECTO ===

    function validateEmail() {
        var x = document.forms["formNewClient"]["email"].value;
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
            alert("Por favor Ingrese un Email Valido");
            return false;
        }
    }
    
    
    //Si los datos estan almacenados en el navegador
    // (URL, username y password) Accede directo
    $("#servidor").val(baseUrl);
    $("#webservice").val(urlWebService);

    
    if (localStorage.getItem("url") == null){
        $(".loading-item").addClass("emptyCss");
    }

    

    //Establece la url base en base a la url/ip del servidor
    $("#servidor").change(function(){
        localStorage.removeItem("url");
        if ($(this).val() != ''){
            baseUrl = $(this).val();
            baseUrl = baseUrl.replace("http://","");
            baseUrl = baseUrl.replace("/","");
            localStorage.setItem("url",baseUrl);
            baseUrl = "http://"+baseUrl+"/";
        }
    });  

    //Establece el webservice
    $("#webservice").change(function(){
        if ($(this).val() != ''){
            urlWebService = $(this).val();
            localStorage.setItem("webservice",urlWebService);
            urlWebService = localStorage.getItem('webservice');
        }
        else {
            $(this).val(defaultWebService);
        }
    });


    // Actualiza la pagina Principal, con el token actual
    $("#iconReload").click(function(){
       location.reload(); 
    });

    /*$(".iconRight").click(function(){
        $(".loading-item").addClass("emptyCss");
    });*/

    
    //Actualiza el usuario
    $("#user").change(function(){
        username = '';

        if ($("#user").val() != ''){
            localStorage.setItem("username",$("#user").val());
            username += localStorage.getItem("username");
        }
        else {
            localStorage.removeItem("username");
        }
    });

    $("#pw").change(function(){
        pw = '';
        if ($("#pw").val() != ''){
            localStorage.setItem("pw",$("#pw").val());
            pw += localStorage.getItem("pw");
        }
        else {
            localStorage.removeItem("pw");
        }
    });

    $("#btnLogIn").click(function(){
        //baseUrlComplete = baseUrl+urlWebService;
        //alert(baseUrlComplete);
        username = $("#user").val();
        pw = $("#pw").val();
        baseUrlComplete = baseUrl+urlWebService;
        getLogIn();
    });


    $("#primaryMenu").html(menuPrincipal);


    // Lista Fracciones por departamento
    $("#listado_departamento").delegate('ul > li','click',function(){

        var idProvincia = $(this).attr("data-provincia");
        var page = get_data_with_json(baseUrlComplete+"/gifraccionview?dpto="+idProvincia,"listFraccionPorDepartamento");
        $("#fracciones_por_departamento").html('');    


        window.location.assign("#Fracciones_D");
    });


    //Lista todas las fracciones
    $("#AllFracciones").on('click',function(){
            if (checkConnection()){
                get_data_with_json(baseUrlComplete+"/gifraccionview","listAllFracciones");
                $(".loading-item").addClass("emptyCss");
                window.location.assign("#Fracciones_D");
            }
            else  {
                $(".loading-item").removeClass("emptyCss");
                //alert("Por favor verifque su conexion a internet");
            }

    });

    


    // Lista las manzanas en base a la fraccion obtenida 
    /*$('#fracciones_por_departamento').delegate( 'ul > li', 'click', function(){
        var idFraccion = $(this).attr("data-fraccion");
        var page = get_data_with_json(urlBase+"giloteview/fraccion/"+idFraccion,2);
    });*/


    // Lista Lotes por Fracciones
    $('#fracciones_por_departamento').delegate( 'ul > li', 'click', function(){
        $("#lotes_por_fraccion > #listLotes").html('');  
        var idFraccion = $(this).attr("data-fraccion");
        localStorage.setItem("id_fraccion",idFraccion);
        console.log("Por departamento");
        get_data_with_json(baseUrlComplete+"/giloteview/fraccion/"+idFraccion,"listLotePorFraccion");
        window.location.assign("#Lotes_F");

    });


    // Detalle del Lote
    $('#lotes_por_fraccion').delegate( 'ul > li', 'click', function(){
        $("#lote_descripcion").html('');
        var idLote = $(this).attr("data-lote");
        get_data_with_json(baseUrlComplete+"/giloteview/"+idLote,"detalleLote");
        window.location.assign("#Descripcion_L");
    });



    //Materialize Component
    $(".button-collapse").sideNav();

    $("#HomeLink , #AllFracciones, #acercade_app,#FormClient").click(function(){
        $('.button-collapse').sideNav('hide');  
        $('#fracciones_por_departamento').html("");
    });


    $("#FormClient").click(function(){
        document.getElementById("formNewClient").reset(); 
    });

    $('.dropdown-loteOption').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: true, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
        }
    );
    
    /*
        === modificar
    $("#listLoteOptions").click(function(){
        alert("demo");
        
        
        
        $('.dropdown-loteOption').dropdown('open');
    });
    */
    
    

    $("#Configuration").click(function(){
        //localStorage.removeItem("initSession");
        $("#errorAcceso").html("");
        //$(".brand-logo").html("<img class=\"logoImg\" src=\"assets/img/einmobi.png\">");
        $('.button-collapse').sideNav('hide');    
        window.location.assign("#Config");
    });


    // Menu de la Aplicacion

    function menuPrincipal(){
        hText = "<ul class=\"side-nav\" id=\"mobile-demo\">";
        //hText += "<li><div class=\"userView\"><img class=\"background\" src=\"assets/img/fondo-01.jpg\">";
        //hText += "<img class=\"logo\" src=\"assets/img/logo.png\"></a>"; 
        //hText += "<span class=\"white-text name\" >Usuario: <b id=\"username\">USER</b></span></a>";
        //hText += "</div></li>";
        hText += "<li><a href=\"#HomePage\" id=\"HomeLink\">Departamentos</a></li>";
        hText += "<li><a href=\"#Fracciones_D\" id=\"AllFracciones\">Fracciones</a></li>";
        hText += "<li><a href=\"#FormClient\" id=\"FormClient\">Clientes</a></li>";
        hText += "<li><a href=\"#Config\" id=\"Configuration\">Configuración</a></li>";
        hText += "<li><div class=\"divider\"></div></li>";
        hText += "<li><a href=\"#AcercaDe\" id=\"acercade_app\">Acerca de</a></li>";
        hText += "</ul>";         
        return hText;
    }

    //Boton que al hacer click en el boton filtrar el lote
    $("#selectRangoMonto").html(createForm());



    //Actualiza la pagina principal
    $("#HomeLink,#HomePage").click(function(){
//            if (statusConexion()){
            get_data_with_json(baseUrlComplete+"/provinciaview", "listDepartamentos");    
//            }
//            else {
        //    alert("Por favor verifique su conexion a internet");
//            }
    });


    // Genera inputs del tipo radio
    function generateInputRadio(name,valor){
        hText = '';
        for(i = 0; i < valor.length - 1; i++){
            if (valor[i] < (valor[1])){
                hText += "<label for=\""+valor[i]+"\">Menor a Gs. "+formatNumber(valor[i+1].toString())+"</label>";   
            }
            else if (valor[i+1]+1 > (valor[valor.length - 1])){
                hText += "<label for=\""+valor[i]+"\">Mayor a Gs. "+formatNumber(valor[i].toString())+"</label>";   
            }
            else {
                hText += "<label for=\""+valor[i]+"\">Gs. "+formatNumber(valor[i].toString())+" y  Gs. "+formatNumber((valor[i+1] - 1).toString())+"</label>";
            }
            hText += "<input name=\""+name+"\" type=\"radio\" id=\""+valor[i]+"\" value=\""+i+"\">"; 
            //alert(formatNumber(valor[i+1].toString()));
        }

        return hText;
    }

    function generateInputCheckbox(name,valor){
        hText = '';
        for(i = 0; i < valor.length; i++){
            hText += "<label for=\""+valor[i]+"\">"+valor[i]+"</label>";
            hText += "<input name=\""+name+"\" type=\"checkbox\" id=\""+valor[i]+"\" value=\""+valor[i]+"\">"; 
        }

        return hText;
    }

    // Selecciona el rango del monto en que se va ha filtrar
    function createForm(){
        hText = "<br><h4 class=\"titleLote\">Estado del Lote</h4></li>";
        hText += generateInputCheckbox("estado",estadoLoteFiltro);
        hText += "<h4 class=\"titleLote\">Monto Cuota</h4></li>";
        hText += generateInputRadio("cuota",montoCuotaFiltro);

        return hText;
    }

    // Obtiene aquellos filtros que se encuantra seleccionados cuando 
    // se o
    $("#loteFilter").click(function(){
        filtrosEstado = [];

        //Obtiene datos del precio cuota seleccionado INPUT RADIO
        opcionPrecioSeleccion = $('input:radio[name=cuota]:checked').val();
        opcionPrecioSeleccion = parseInt(opcionPrecioSeleccion);

        //Obtiene datos del estado del lote INPUT CHECKBOX
        $('input:checkbox[name=estado]:checked').each(function(){
            filtrosEstado.push($(this).val());
        });


        //Obtiene los datos de cada item(lote) de la lista
        $("#listLotes li").each(function(){
            elementFormContent = []; 
            valueEstado = '';


            estadoLote = $(this).attr('data-state').trim(); //Estado del lote actual
            precioCuotaLote = $(this).attr('data-price'); //precio cuota del lote actual
            precioCuotaLote = parseInt(precioCuotaLote);

            //Compara con la cantidad de filtros seleccionados una vez encuentra, sale del bucle
            for (i = 0; i < filtrosEstado.length; i++){
                if (filtrosEstado[i] == estadoLote){
                    valueEstado = estadoLote;
                    break;
                }
            }

            if (valueEstado != ''){
                elementFormContent.push = valueEstado;
            }
            if (!isNaN(opcionPrecioSeleccion)){
                elementFormContent.push = opcionPrecioSeleccion;
            }

            console.log(elementFormContent.length);


            //Verifica si los valores del precio se encuentra en el rango establecido
            if (isNaN(opcionPrecioSeleccion)){
                if (valueEstado != ''){ 
                    $(this).removeClass('emptyCss').addClass('collection-item');
                    $(this).find('i').removeClass('emptyCss').addClass('prefix');
                    $(this).find('img').removeClass('emptyCss');
                    $(this).find('span').removeClass('emptyCss').addClass('title');
                    $(this).find('p').removeClass('emptyCss').addClass('pLote');
                }
                else {
                    $(this).removeClass('collection-item').addClass('emptyCss');
                    $(this).find('i').removeClass('prefix').addClass('emptyCss');
                    $(this).find('img').addClass('emptyCss');
                    $(this).find('span').removeClass('title').addClass('emptyCss');
                    $(this).find('p').removeClass('pLote').addClass('emptyCss');
                }
            }
            else { // Para el caso que ambos esten seleccionados
                if (precioCuotaLote >= montoCuotaFiltro[opcionPrecioSeleccion] 
                && precioCuotaLote < montoCuotaFiltro[opcionPrecioSeleccion + 1] && valueEstado != ''){
                    $(this).removeClass('emptyCss').addClass('collection-item');
                    $(this).find('i').removeClass('emptyCss').addClass('prefix');
                    $(this).find('img').removeClass('emptyCss');
                    $(this).find('span').removeClass('emptyCss').addClass('title');
                    $(this).find('p').removeClass('emptyCss').addClass('pLote');
                }
                else {
                    $(this).removeClass('collection-item').addClass('emptyCss');
                    $(this).find('i').removeClass('prefix').addClass('emptyCss');
                    $(this).find('img').addClass('emptyCss');
                    $(this).find('span').removeClass('title').addClass('emptyCss');
                    $(this).find('p').removeClass('pLote').addClass('emptyCss');
                }   
            }

        });
    });

    $("#resertFormFilter").click(function(){
        $("#filtroForm")[0].reset();
        $("#listLotes li").removeClass('emptyCss').addClass('collection-item');
        $("#listLotes > li > i").removeClass('emptyCss').addClass('material-icons');
        $("#listLotes > li > i > img").removeClass('emptyCss');
        $("#listLotes > li > span").removeClass('emptyCss').addClass('title');
        $("#listLotes > li > p").removeClass('emptyCss').addClass('pLote'); 
        $("#listLotes > li > a > i ").removeClass('emptyCss'); 
        history.back(1);
    });


   /* $(".button-collapse").click(function(){
        //$("body").removeAttr("style");
        $(".headPage").addClass('headPageActiveMenu');
    });

    $(".drag-target").touchmove(function(){
        $(".headPageActiveMenu").removeClass('headPageActiveMenu');
    });

    $(".drag-target").click(function(){
        $(".headPage").removeClass('headPageActiveMenu');
    });

    $("#Home , #AllFracciones, #Configuration ").click(function(){
        $(".headPage").removeClass('headPageActiveMenu');
    });*/



    //Obtiene los datos del cliente
    $("#btnBuscarCliente").click(function(){
        var valueDocument = $("#ciCliente").val().trim();
        if (valueDocument != ''){

            get_data_with_json(baseUrlComplete+"/clienteview?codigo="+$("#ciCliente").val(), "detalleCliente");
            //htmlTakeClient($("#ciCliente").val().trim());    // A ser implementado en el ajax, recibe el jSon
        }
        else {
            $("#boxDataTakeClient").html('');
        }
    });

    $("#botonReserva").delegate("#btnActiveReserva","click",function(){
        $("#ciCliente").val(''); 
        $("#boxDataTakeClient").html('');
        setDateCurrent("#fechaVenta");
        
        //getPlazoVenta();
        //get_data_with_json(baseUrlComplete+"/itemmovcondicionview"  ,9);
        htmlItemCondition(); //Plazo de 
        htmlTakeLote();
        window.location.assign("#SolicitudVenta");
        console.log("Usted ha dado click Solicitud venta");
        
    });


    $("#botonReserva").delegate("#btnVerMapa","click",function(){
        window.location.assign("#MapaLote");
        console.log("Usted ha dado click sobre ver mapa");
        
    });

    //Redirecciona en caso que no exista cliente al formulario nuevo cliente
    $("div#boxDataTakeClient").delegate("#btnNewClient","click",function(){
        valueCiClient = $("#ciCliente").val();
        $("#cedula").val(valueCiClient);
        window.location.assign("#FormClient");
    })


    function setDateToMilisecond(value){
        fecha = value.split("/");
        if(fecha.length == 3){
            d = new Date(parseInt(fecha[2]),parseInt(fecha[1])-parseInt(1),parseInt(fecha[0]));    
            console.log(d.valueOf());
            return d.valueOf();
        }
        else {
            return null;   
        }
    } 

    //$("#formNewClient").submit(function(event){
    $("#btnFormNewClient").click(function(event){
        mensaje = "";

        if ($("#cedula").val() == '' ||  $("#cedula").val().length < 5){
            mensaje += "Verifiqué Cédula\n";
        }
        if ($("#nombres").val() == ''){
            mensaje += "Verifiqué Nombre\n";
        }   
        if ($("#apellido").val() == ''){
            mensaje += "Verifiqué Apellido\n";
        }
        if ($("#dirParticular").val() == ''){
            mensaje += "Verifiqué Dirección Partcicular\n";
        }
        if ($("#tel").val() == ''){
            mensaje += "Verifiqué Teléfono Particular\n";
        } 
        if ($("#cel").val() == ''){
            mensaje += "Verifiqué Celular\n";
        } 

        if ($("#conyugeCi").val().length > 0){
            if ($("#conyugeNombre").val() == ''){
                mensaje += "Verifiqué Nombre del Conyuge\n";
            }
            if ($("#conyugeApellido").val() == ''){
                mensaje += "Verifiqué Apellido del Conyuge\n";
            }
        }

        validateEmail();

        //Si la bandera esta activa todos los campos fueron completados
        if (mensaje != ''){
            alert(mensaje); 
            event.preventDefault();
        } 
        else {
            var fechaingresotrabajo = setDateToMilisecond($("#fechaTrabajaDesde").val());
            var fechanacimiento = setDateToMilisecond($("#fechaNacimiento").val());


            //var fechaVenta = new Date();
            cedula = cleanAndSubString($("#cedula").val());
            conyugeNombre = cleanAndSubString($("#conyugeNombre").val());
            conyugeApellido = cleanAndSubString($("#conyugeApellido").val());
            conyugeCi = cleanAndSubString($("#conyugeCi").val());
            nombres = cleanAndSubString($("#nombres").val());
            tel = cleanAndSubString($("#tel").val());
            telFax = cleanAndSubString($("#telFax").val());
            cel = cleanAndSubString($("#cel").val());
            apellidos = cleanAndSubString($("#apellido").val());
            nacionalidad = cleanAndSubString($("#nacionalidad").val());
            empresa = cleanAndSubString($("#empresa").val());
            telLaboral = cleanAndSubString($("#telLaboral").val());

            var xhr = new XMLHttpRequest();
            var datosEnviar = {
                "codigo": cedula,
                "descuento": 0,
                "credito": 0,
                "observacion": "",
                "conyugue": conyugeNombre+" "+conyugeApellido,
                "conyuguecedula": conyugeCi,
                "codeudor": " ",
                "codeudorcedula": " ",
                "codeudortelefono": " ",
                "codeudordireccion": " ",
                "documento": cedula,
                "nombre": nombres,
                "ruc": cedula,
                "direccion": $("#dirParticular").val(),
                "telefono": tel,
                "telefonofax": telFax,
                "telefonocelular": cel,
                "web": " ",
                "email": $("#email").val(),
                "codigopostal": " ",
                "ciudad": null,
                "ciudadnombre": null,
                "barrio": null,
                "provincia": null,
                "barrionombre": null,
                "apellido": apellidos,
                "idprofesion": null,
                "nacionalidad": nacionalidad,
                "fechanacimiento": fechanacimiento,
                "empresatrabaja": empresa,
                "direcciontrabajo": $("#dirLaboral").val(),
                "telefonotrabajo": telLaboral,
                "estadocivil": $("#estadoCivil").val(),
                "sexo": $("#generoSexo").val(),
                "lugarDeNacimiento": $("#lugarNacimiento").val(),
                "ingresomensual": $("#ingresoMensual").val(),
                "egresomensual": $("#egresoMensual").val(),
                "hijos_cantidad": $("#cantHijo").val(),
                "fechaingresotrabajo" : fechaingresotrabajo
            };

            console.log(datosEnviar);

            xhr.addEventListener("readystatechange", function () {
                if (xhr.readyState == 4) {
                    var jSon;
                    jSon = JSON.parse(xhr.responseText);
                    if (jSon.errorMessage){
                        alert("Problema al insertar");
                        console.log(jSon.errorMessage);
                    }
                    else {
                        alert("Cliente Insertado Correctamente");
                        document.getElementById("formNewClient").reset();
                        //window.location.assign("#SolicitudVenta");
                    }

                }
            });   

            xhr.open("POST",baseUrlComplete+"/clienteview",true);  
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            xhr.setRequestHeader("token", localStorage.getItem("token"));
            xhr.setRequestHeader("accept", "application/json");

            //console.log(datosEnviar);
            xhr.send(JSON.stringify(datosEnviar));
            event.preventDefault();
        }
    });




    // Ubica la fecha del dia de hoy


    function setDateCurrent(element){
        var f = new Date();
        $(element).val(f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());    
    }

    //Formulado de la venta
    $("#reservarVenta").click(function(){
        mensaje = "Esta por Insertar la siguiente venta\n";
        mensaje += "C.I. Cliente: "+$("#ciCliente").val()+"\n";
        mensaje += "Fecha: "+$("#fechaVenta").val()+"\n";
        mensaje += "Nombre: "+localStorage.getItem("name_lote")+"\n";
        mensaje += "Codigo Lote:"+$("#detailTitleLote").text()+"\n";



        if (confirm(mensaje)){
            mensaje = "";

            if ($("#ciCliente").val() == '' ){
                mensaje += "Verifiqué Cédula\n";
            }
            if ($("#fechaVenta").val() == ''){
                mensaje += "Verifiqué Fecha Particular\n";
            } 



            //Si la bandera esta activa todos los campos fueron completados
            if (mensaje != ''){
                alert(mensaje); 
                event.preventDefault();
            } 
            else {

                if ($("#itemcondicion").val() == 1){
                    cuotasCnt = 1;
                }
                else {
                    cuotasCnt = localStorage.getItem("cant_cuotas");
                }

                var xhr = new XMLHttpRequest();                
                var datosVenta = {
                    "fecha": setDateToMilisecond($("#fechaVenta").val()),
                    "giFraccion": localStorage.getItem("fraccionCodigo"),
                    "giManzana": localStorage.getItem("id_manzana"),
                    "giLote": localStorage.getItem("loteCodigo"),
                    "recibonro": "", 
                    "cambio":1,
                    "preciovtacontado":localStorage.getItem("contado"),
                    "porcadminvtacontado":0,
                    "importesena":localStorage.getItem("sena"),
                    "importecuota":localStorage.getItem("monto_cuota"),
                    "importeinicial":localStorage.getItem("monto_inicial"),
                    "fechaprimervto": setNextMonth($("#fechaVenta").val()) ,
                    "cuotasCnt": cuotasCnt,
                    "observacion":$("#observacionVenta").val(),
                    "impuestogrupo":10, 
                    "ctacte": localStorage.getItem("id_cliente"),
                    "vendedor": "0",
                    "conductor": "0"
                    /*"canalpublicidad": "00001",
                    "canalvta":"00001",*/
                    /*"itemmovcondicion": $("#itemcondicion").val()*/
                }
                console.log(datosVenta);

                xhr.addEventListener("readystatechange", function () {
                    if (xhr.readyState == 4) {
                        var jSon;
                        jSon = JSON.parse(xhr.responseText);
                        if (jSon.errorMessage){
                            alert("Problema al insertar la venta\nVuelva a intentarlo");
                            console.log(jSon.errorMessage);
                        }
                        else {
                            $("#lote_descripcion").html('');  
                            $("#lotes_por_fraccion > #listLotes").html('');  
                            get_data_with_json(baseUrlComplete+"/giloteview/"+localStorage.getItem("id_lote"),"detalleLote");
                            get_data_with_json(baseUrlComplete+"/giloteview/fraccion/"+localStorage.getItem("id_fraccion"),"listLotePorFraccion");

                            alert("Venta Insertada Correctamente");

                            //Actualizar campos del formulario

                            //document.getElementById("formVenta").reset();
                            //$("#ciCliente").val($("#cedula").val());

                            //window.location.assign("#Descripcion_L");
                            window.history.back();
                        }

                    }
                });   

                xhr.open("POST",baseUrlComplete+"/gilotevta",true);  
                xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xhr.setRequestHeader("token", localStorage.getItem("token"));
                xhr.setRequestHeader("accept", "application/json");
                xhr.send(JSON.stringify(datosVenta));

                event.preventDefault();
            }
        }
        else {
            console.log("Algo salio mal");
        }
    });


    // Sumar un mes a la fecha Actual
    function setNextMonth(value){
       fecha = value.split("/");
        if(fecha.length == 3){
            d = new Date(parseInt(fecha[2]),parseInt(fecha[1]),parseInt(fecha[0]));    
            //console.log("Fecha Sigte Mes"+d.valueOf());
            return d.valueOf();
        }
        else {
            return null;   
        }
    }

    //Obtener los datos de 
    /*$("button").click(function(){
        $.get("dem  o_test.asp", function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });
    });*/




    //Enviar Solicitud de venta;
    $("#ingresoMensual,#egresoMensual,#cedula,#cantHijo").keyup(function(){
        if (isNaN($(this).val())){
            $(this).val("");
        }
    });



    function restringirLongitudInput(elemento,max){
        $(elemento).keyup(function(){
            if ($(this).val().length > max){
                $(this).val(tmp);
            }
            else {
                tmp = $(this).val();
            }
        }); 
    }


    // === validar formulario de venta clientes === 
    restringirLongitudInput("#cedula,#conyugeCi",9);
    restringirLongitudInput("#nombres,#apellido,#empresa,#dirLaboral,#lugarNacimiento,#conyugeNombre,#conyugeApellido",50);
    restringirLongitudInput("#dirParticular,#email",100);
    restringirLongitudInput("#tel",30);
    restringirLongitudInput("#cel,#telLaboral,#telFax,#ingresoMensual,#egresoMensual,#nacionalidad",15);
    restringirLongitudInput("#fechaTrabajaDesde,#fechaNacimiento",10);
    restringirLongitudInput("#cantHijo",2);

    // Verifica si hay conexion


}); 

defaultWebService = "makerwebservices/api/v1";

//Verificar url/ip del servidor
if (localStorage.getItem("url") == null){
    alert("Por favor verifique a donde apunta su URL/IP");
    //baseUrl = "Ingrese Aqui Su IP/URL";
    baseUrl = '';
}
else {
    baseUrl = localStorage.getItem("url");
}

//Web Service por Defecto
if(localStorage.getItem("webservice") == null ){
    alert("Por favor verifique el Web Service en su Configuracion");
    localStorage.setItem("webservice", defaultWebService);
    urlWebService = defaultWebService;
}   
else {
    urlWebService = localStorage.getItem("webservice");
}





// Login Antes de cargar la pagina
if (localStorage.getItem("username") == null || localStorage.getItem("pw") == null){
    alert("Por favor verifique sus datos de usuario en la configuracion");
}
else {
    username = localStorage.getItem("username");
    pw = localStorage.getItem("pw");

    baseUrlComplete = "http://"+baseUrl+"/"+urlWebService;
//        if (statusConexion()){
        getLogIn();
//        }
//        else {
        //alert("Por favor verifique su conexion a internet");
//        }
}


function getLogIn(){
    var xhr = new XMLHttpRequest();
    countAvailable = 0;
    localStorage.setItem("available",countAvailable);
    xhr.addEventListener("readystatechange", function () {

        if (this.readyState == 4) {
            var jSon;
            jSon = JSON.parse(this.responseText);
            console.log(baseUrlComplete);
            if (jSon.errorMessage){
                alert("Por favor verifique si su usuario es correcto");
                event.preventDefault();
                $("#errorAcceso").html("Datos Incorrectos");
            }
            else {
                localStorage.setItem("token",jSon.auth);
                get_data_with_json(baseUrlComplete+"/provinciaview", "listDepartamentos");
                window.location.assign("#HomePage");
            }
        }
       /* else {
            localStorage.setItem("available",parseInt(localStorage.getItem("available")) + 1);
            alert(localStorage.getItem("available"));
            
        }
       */
        
    });
    countAvailable++;
    xhr.open("GET", baseUrlComplete+"/login/"+username+"/"+pw);
    xhr.setRequestHeader("accept", "application/json");

    xhr.send(null);
}


function statusConexion(){
if (navigator.onLine){
    return true;
} 
return false;
}


//  Inicializa Ajax y trae datos del JSON
function get_data_with_json(url, type){
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState == 4) {
            var jSon;
            jSon = JSON.parse(this.responseText);
            switch(type){
                case "listFraccionPorDepartamento":
                    htmlFraccionByDepartamento(jSon);
                    break;
                case "listLotePorFraccion": // Lista lotes en base a la fraccion
                    htmlLoteByFraccion(jSon);
                    break;
                case "detalleLote":
                    htmlLoteDescription(jSon);
                    break;
                case "listDepartamentos": 
                    htmlListDepartamentos(jSon);    
                    break;
                case "listAllFracciones":
                    htmlAllFraccion(jSon);
                    break;
                case "detalleCliente": // Buscar Cliente
                    htmlTakeClient(jSon);
                    console.log(jSon);
                    break;
               /* case 9: // iTEM CONDICION
                    console.log(jSon);
                    htmlItemCondition(jSon);
                    break;*/
                default:
                    break;
            }
            $(".loading-item").addClass("emptyCss");
        }
        else {
            $(".loading-item").removeClass("emptyCss");
        }
    });

    xhr.open("GET", url);
    xhr.setRequestHeader("token", localStorage.getItem("token"));    
    xhr.setRequestHeader("accept", "application/json");

    xhr.send(null);
}


// Lista los departamentos
function htmlListDepartamentos(arr){
    var hText = '';
    for(i = 0; i < arr.length; i++){
        hText += "<li class=\"collection-item\" data-provincia=\""+arr[i].codigo+"\">"+arr[i].nombre+"</li>";
    }
    $("#listado_departamento").html("<ul class=\"collection \">"+hText+"</ul>");
}

//HTML Fracciones Por Departamento
function htmlFraccionByDepartamento(arr){
    hText = '';

    if (arr.length > 0){
        provinciaName = arr[0].provincianombre;
        var titulo = "<h1>"+provinciaName+"</h1>";
        for(i = 0; i < arr.length; i++){
            hText += "<li class=\"collection-item\" data-fraccion=\""+arr[i].idgiFraccion+"\">"+arr[i].nombre+"</li>";    
        }
        $("#fracciones_por_departamento").html("<h1 class=\"text-center\" >"+provinciaName+"</h1><ul  id=\"listadoFracciones\" class=\"collection \" >"+hText+"</ul>");  
    }
    else {
        hText = "<ul class=\"collection \" ><li class=\"collection-item\">No se encontraron Fracciones</li></ul>";
        $("#fracciones_por_departamento").html(hText);  
    }
}

//Listado de todas las fracciones sin filtrar por departamento
function htmlAllFraccion(arr){
    hText = '';

    if (arr.length > 0){
        for(i = 0; i < arr.length; i++){
            hText += "<li class=\"collection-item\" data-fraccion=\""+arr[i].idgiFraccion+"\">"+arr[i].nombre+"<br><span style=\"font-size:12px;\">"+arr[i].provincianombre+"</span></li>";    
        }
        //<h1 class=\"text-center\" >Fracciones</h1>
        $("#fracciones_por_departamento").html("<ul  id=\"listadoFracciones\" class=\"collection \" >"+hText+"</ul>");  
    }
    else {
        hText = "<ul class=\"collection \"><li class=\"collection-item\" >No se encontraron Fracciones</li></ul>";
        $("#fracciones_por_departamento").html(hText);  
    }
}

//Listado de Manzanas por Fraccion
function htmlManzanaByFraccion(arr){
    hText = '';
    vInicial = arr[0].idManzana;
    if (arr.length > 0){
        for(i = 0;i < arr.length; i++){ 
            if (vInicial != arr[i].idgiManzana){
                hText += "<li data-manzana=\""+arr[i].idgiManzana+"\">"+arr[i].idgiManzana+"</li>";        
                vInicial = arr[i].idgiManzana;
            }
        }
    }
    else {
        hText = "<li>No se encontraron Manzanas</li>";

    }
    $("#manzanas_por_departamento").html("<ul id=\"listadoManzana\">"+hText+"</ul>");   
}



//Lista lotes por fraccion
function htmlLoteByFraccion(arr){
    $("#listLotes").html('');
    //var hTitle = "<h4 class=\"text-center\" >"+fraccionName+"</h4>";
    //$("#listLotes").html("<ul class=\"collection\" id=\"listLotes\" >"+hText+"</ul>"); 
    if (arr.length > 0){
        fraccionName = arr[0].giFraccionnombre;
        for(i = 0; i < arr.length; i++){
            codigoManzana = arr[i].giManzana;
            loteName = arr[i].giFraccion+"-"+codigoManzana+"-"+arr[i].codigo;
            hText = "<li class=\"collection-item avatar\" data-lote=\""+arr[i].idgiLote+"\" data-price=\""+arr[i].importecuota+"\" data-state=\""+(arr[i].giLoteestado != null ? arr[i].giLoteestado.trim() : "NULL")+"\">";
            hText += returnIcon(arr[i].giLoteestado);
            hText += "<span class=\"title\">"+loteName+"</span>";
            //
            hText += "<p class=\"pLote\">"+arr[i].giLoteestado+"<br>"+arr[i].moneda+" "+formatNumber(arr[i].importecuota.toString())+"</p>";
            hText += "<a href=\"#!\" class=\"secondary-content\"><i class=\"material-icons\">info_outline</i></a>";
            hText += "</li>";

            $("#listLotes").append(hText);
        }     
    }
    else {
        hText = "<ul class=\"collection \" ><li>No se encontraron Fracciones</li></ul>";
        //$("#lotes_por_fraccion").html("<ul class=\"collection\">"+hText+"</ul>");    
    }
    //$("#lotes_por_fraccion").html(arr.length);    
}

function setMillisecondToDate(value){
    if (value != "-"){
        d = new Date(value);
        return d.getDate()+"/"+(d.getMonth() + 1)+"/"+d.getFullYear();
    }
    return "-";
}

//Descripcion del Lote
function htmlLoteDescription(lote){
    
    codigoManzana = lote.giManzana.trim();
    $("#listLoteOptions").html(''); // No muestra el boton por defecto

    hText = '';
    //Codigo del loteamiento
    loteName = lote.giFraccion+"-"+codigoManzana+"-"+lote.codigo;

    // Actualizacion del Local Storage
    localStorage.setItem("fraccionCodigo",lote.giFraccion);
    localStorage.setItem("id_manzana",codigoManzana);
    localStorage.setItem("loteCodigo",lote.codigo);
    localStorage.setItem("name_code",loteName);
    localStorage.setItem("name_lote",lote.nombre.trim());
    localStorage.setItem("sena",lote.importesena); localStorage.setItem("contado",lote.preciovtacontado.toString());
    localStorage.setItem("monto_cuota",lote.importecuota);
    localStorage.setItem("monto_inicial",lote.importeinicial);
    localStorage.setItem("cant_cuotas",lote.cuotasCnt);


    hText += "<ul class=\"collection\">";
    hText += "<li class=\"collection-item avatar\" data-lote=\""+lote.idgiLote+"\">";
    hText += "<span class=\"title\" id=\"detailTitleLote\">"+loteName+"</span>";
    hText += returnIcon(lote.giLoteestado);
    hText += "</li></ul>"; 

    //Valores con puntos, convierte a string
    sena = formatNumber(respuestaIsNotNullCero(lote.importesena.toString())); 
    
    // Venta
    hText += "<h4 class=\"titleLote\">Datos del Lote</h4></li>";
    hText += "<div class=\"boxLote\"><table class=\"bordered\" >";
    hText += "<tr><td>Precio Contado:</td><td class=\"text-right\" id=\"descriptionContado\">"+lote.moneda+" "+formatNumber(lote.preciovtacontado.toString())+"</td></tr>";
    hText += "<tr><td>Seña: </td><td class=\"text-right\" id=\"descriptionSena\">"+lote.moneda+" "+sena+"</td></tr>";
    hText += "<tr><td>Importe Inicial: </td><td class=\"text-right\" id=\"descriptionInicial\" >"+lote.moneda+" "+formatNumber(lote.importeinicial.toString())+"</td></tr>";
    hText += "<tr><td>Monto Cuota:</td><td class=\"text-right\" id=\"descriptionCuota\"> "+lote.moneda+" "+formatNumber(lote.importecuota.toString())+"</td></tr>";
    hText += "<tr><td>Cant. de Cuotas: </td><td class=\"text-right\">"+formatNumber(lote.cuotasCnt.toString())+"</td></tr>";
    hText += "<tr><td>Reservado Por: </td><td class=\"text-right\" >"+respuestaIsNotNull(lote.vendedorreservanombre)+"</td></tr>";
    hText += "<tr><td>Fecha reserva: </td><td class=\"text-right\" >"+setMillisecondToDate(respuestaIsNotNull(lote.fechareserva))+"</td></tr>";
    hText += "<tr><td>Tiene Casa: </td><td class=\"text-right\" >"+respuestaFavorable(lote.concasa)+"</td></tr>";
    hText += "<tr><td> Otras Mejoras: </td><td class=\"text-right\" >"+respuestaFavorable(lote.otrasmejoras)+"</td></tr>";
    hText += "</table></div>";


    // Localizacion
    hText += "<h4 class=\"titleLote\">Localización</h4></li>";
    hText += "<div class=\"boxLote\"><table class=\"bordered\">";
    hText += "<tr><td>Nombre:</td> <td>"+lote.nombre.trim()+"</td></tr>";
    hText += "<tr><td>Fracción:</td><td> "+lote.giFraccionnombre.trim()+"</td></tr>";
    hText += "<tr><td>Manzana:</td><td> "+lote.giManzana.trim()+"</td></tr>";
    hText += "<tr><td>Cuenta Catastral: </td><td>"+lote.nroctactecatastral+"</td></tr>";
    hText += "</table></div>";

    // Superficie
    hText += "<h4 class=\"titleLote\">Dimensiones</h4></li>";
    hText += "<div class=\"boxLote\"><table class=\"bordered\">";  
    hText += "<tr><td>Superficie:</td><td class=\"text-right\"  > "+formatNumber(lote.superficieM2.toString())+"</td></tr>";
    hText += "<tr><td>Frente:</td><td class=\"text-right\"> "+formatNumber(lote.longFrente != null ? lote.longFrente.toString() : "0")+"</td></tr>";
    hText += "<tr><td>Norte:</td><td class=\"text-right\"> "+formatNumber(lote.longNorte.toString())+"</td></tr>";
    hText += "<tr><td>Sur:</td> <td class=\"text-right\">"+formatNumber(lote.longSur.toString())+"</td></tr>";
    hText += "<tr><td>Este:</td><td class=\"text-right\"> "+formatNumber(lote.longEste.toString())+"</td></tr>";
    hText += "</table></div>";

    $("#lote_descripcion").html("<ul>"+hText+"</ul>");  




    if ((lote.giLoteestado.trim() == "Disponible" || lote.giLoteestado.trim() == "Recuperado") 
        && lote.importecuota != 0 && lote.preciovtacontado != 0){
        //$("#botonReserva").html("<a  id=\"btnActiveReserva\" data-lote=\""+lote.idgiLote+"\" data-activates=\"mobile-demo\" ><i style=\"font-size:40px;\" class=\"material-icons\">turned_in</i></a>"); 
        /*$("#botonReserva").html("<a href=\"#SolicitudVenta\" id=\"btnActiveReserva\" data-lote=\""+lote.idgiLote+"\" data-activates=\"mobile-demo\" ><img src=\"assets/img/3_puntos.png\" height=\"30\"></a>"); */
        
        $("#listLoteOptions").html("<i class=\"material-icons right\">more_vert</i>");
        localStorage.setItem("id_lote",lote.idgiLote);
    }
    else {
        localStorage.removeItem("id_lote");
    }

}




function returnIcon(key){
    if (key != null){
        switch(key.trim()){
            case "Disponible":
                iconColor = "green";
                iconImg = "like";
                break;
            case "Recuperado":
                iconColor = "green";
                iconImg = "repeat";
                break;
            case "Reservado":
                iconColor = "yellow";
                iconImg = "restore";
                break;
            case "Vendido":
                iconColor = "red";
                iconImg = "unlike";
                break;
            default:
                iconColor = "";
                iconImg = "folder";
                break;
        }
    }
    else {
        iconColor = "";
        iconImg = "folder";  
    }
    return "<i class=\" circle "+iconColor+" \"><img src=\"assets/img/icons/"+iconImg+".png\" ></i>";
}


//RETORNA SI, NO O -
function respuestaFavorable(value) {
    if (value){
        return "SI";
    }
    else if (value == null){
        return "-";
    }
    else {
        return "NO";
    }
}


//returna - Si el valor inicial es nulo
function respuestaIsNotNull(value){
    if (value == null){
        return "-";
    }
    return value;
}

//retorna 0 si el valor es nulo
function respuestaIsNotNullCero(value){
    if (value == null){
        return "0";
    }
    return value;
}


// Hasta 45 Caracteres
function cleanAndSubString(value){
    return value.trim().substring(0, 49);
}

//Agrega los puntos necesarios a los numeros
function formatNumber(val){
    //console.log(val);
    var num = val.replace(/\./g,'');
    if(!isNaN(num)){
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        valor = num;
    }
    else { 
        alert('Solo se permiten numeros');
        val = val.replace(/[^\d\.]*/g,'');
    }

    return valor;
}    


 // La variable longitud no tiene ningun significado solo es implementada para el caso ya que no se cuenta
// Con el Json del cliente
function htmlTakeClient(cliente){
    cantClient = cliente.length;

    if (cantClient == 1){ // Debe ser cero si se llama desde el ajax
        localStorage.setItem("id_cliente",cliente[0].codigo);
        hText = "<h4 class=\"titleLote titleLoteCustom\">Datos del Cliente</h4>";
        hText += "<table class=\"bordered\"><tbody>";
        hText += "<tr><td>Cédula:</td><td>"+cliente[0].codigo+"</td></tr>";
        hText += "<tr><td>Nombre:</td><td>"+cliente[0].nombre+"</td></tr>";
        hText += "<tr><td>Apellido:</td><td>"+cliente[0].apellido+"</td></tr>";
        hText += "</tbody></table>";
        //hText += "<div class=\"col s7\"><br><a href=\"#\" class=\"btn waves-effect waves-teal orange lighten-1\">Reservar</a></div>";
    }
    else {
        hText = "<div class=\"col s7\">Cliente no encontrado!!</div><div class=\"col s4\" id=\"btnNewClient\"><a href=\"#\" class=\"btn waves-effect waves-teal orange lighten-1\">Agregar</a></div>";
    }

    $("#boxDataTakeClient").html(hText);
}

/*function htmlItemCondition(item){
    hText = "";
    for(i in item){
        hText += "<option value=\""+item[i].codigo+"\" >"+item[i].nombre+"</option>";
    }
    $("#itemcondicion").html(hText);
}*/

    

function htmlItemCondition(){
    hText = "";

    hText += "<option value=\"1\" >Contado</option>";
    hText += "<option value=\"2\" selected >Credito en "+localStorage.getItem("cant_cuotas")+" cuotas</option>";

    $("#itemcondicion").html(hText);
}

//Muestra en el formulario de la venta, descripciones del lote
//y que muestre el precio contado y la seña, importe inicial y monto cuota
function htmlTakeLote(){
    hText = "<h4 class=\"titleLote titleLoteCustom\">Datos de la Venta</h4>";
    /*hText = "<div class=\"titleLote\"></div>";*/
    hText += "<table class=\"bordered\"><tbody>";
    hText += "<tr><td>Contado: </td><td class=\"text-right\" >"+ $("#descriptionContado").text()+"</td></tr>";
    hText += "<tr><td>Seña: </td><td class=\"text-right\" >"+$("#descriptionSena").text()+"</td></tr>";
    hText += "<tr><td>Importe Inicial:</td><td class=\"text-right\" >"+$("#descriptionInicial").text()+"</td></tr>";
    hText += "<tr><td>Monto Cuota: </td><td class=\"text-right\" >"+$("#descriptionCuota").text()+"</td></tr>";
    hText += "</tbody></table>";
    //hText += "<div class=\"col s7\"><br><a href=\"#\" class=\"btn waves-effect waves-teal orange lighten-1\">Reservar</a></div>";

    $("#boxDataLote").html(hText);
}



