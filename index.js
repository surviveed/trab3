var urlBase="https://ucsdiscosapi.azurewebsites.net/"
var apiKey="8175fA5f6098c5301022f475da32a2aa";
var apiToken="";
var numIni=12;
var qtd=4; 
var qtdMax=104;

function autenticarChave() {
    showLoading();
    $.ajax({
        url: urlBase+"Discos/autenticar",
        method: "POST",
        headers: {
            "ChaveApi": apiKey,  
        },
        success: function (response) {
            apiToken=response;
            buscarImagens(1,12);
            hideLoading();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Erro na requisição:", textStatus, errorThrown);
            hideLoading();
            $('.aviso').html("Erro na requisição:"+ textStatus+"-"+ errorThrown)
            $('.aviso').show();
        },
    });
}
function buscarImagens(numInicio, qtdRegistros) {
    showLoading();
    $.ajax({
        url: urlBase+"Discos/records?numeroInicio="+numInicio+"&quantidade="+qtdRegistros,
        method: "GET",
        headers: {
            "TokenApiUCS": apiToken,  
        },
        success: function (response) {
            response.forEach(retorno => {
                const posts = `
                <div class="col-12 col-md-6 mb-4">
                    <img class="img-fluid" onclick="carregarInformacoes(${retorno.id})" data-bs-toggle="modal" data-bs-target="#modalInformacoes" src="data:image/png;base64,${retorno.imagemEmBase64}">
                </div>
                `;
                $('#imagens').append(posts);
                hideLoading();
            });
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Erro na requisição:", textStatus, errorThrown);
            hideLoading();
            $('.aviso').html("Erro na requisição:"+ textStatus+"-"+ errorThrown)
            $('.aviso').show();
        },
    });
}
function showAviso(){
    $('.aviso').show();
}
function hideAviso(){
    $('.aviso').hide();
}
function showLoading() {
    $('#loading').show();
}

function hideLoading() {
    $('#loading').hide();
}
function carregarInformacoes(idImagem){
    showLoading();
    $.ajax({
        url: urlBase+"Discos/record?numero="+idImagem,
        method: "GET",
        headers: {
            "TokenApiUCS": apiToken,  
        },
        success: function (response) {
            $('#modalInformacoesTitulo').html("Id da Imagem: "+response.id);
            $('#descricaoPrimaria').html("<b>Descricao Primaria:</b> "+response.descricaoPrimaria+"<br/>");
            $('#descricaoSecundaria').html("<b>Descricao Secundária:</b> "+response.descricaoSecundaria);
            hideLoading();
        }
        ,
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Erro na requisição:", textStatus, errorThrown);
            hideLoading();
            $('.aviso').html("Erro na requisição:"+ textStatus+"-"+ errorThrown)
            $('.aviso').show();
        },
    });
}
$(document).ready(function () {
    hideLoading();
    hideAviso();
    autenticarChave();

    window.onscroll = function() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            if(numIni>qtdMax){
                window.scrollTo({
                    top: 0,  
                    left: 0, 
                    behavior: 'smooth'
                });
            }
            else{
                if(numIni==qtdMax){
                    qtd=2;
                }
                buscarImagens(numIni,qtd);
                numIni+=4;
            }
        }
    };
});