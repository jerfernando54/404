
$("#etiqueta").keyup(function(){              
    var ta      =   $("#etiqueta");
    letras      =   ta.val().replace(/ /g, "");
    ta.val(letras)
});
