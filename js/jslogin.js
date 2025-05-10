$(function() {
    validacao();
});

async function autenticar() {
    if (!$.fn.validate) {
        if (!$("#login").val() || !$("#senha").val()) {
            alert("Preencha todos os campos");
            return;
        }
    } else if (!$("#formulario").valid()) {
        return;
    }
    
    const login = $("#login").val();
    const senha = $("#senha").val();

    try {
        const response = await fetch(`https://api-odinline.odiloncorrea.com/usuario/${login}/${senha}/autenticar`);
        
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const usuario = await response.json();

        if (usuario?.id > 0) {
            localStorage.setItem('usuarioAutenticado', JSON.stringify(usuario));
            window.location.href = "menu.html";
        } else {
            throw new Error("Credenciais inválidas");
        }
    } catch (error) {
        console.error("Erro na autenticação:", error);
        alert("Login ou senha errados. Tente novamente.");
    }
}

function validacao() {
    if (!$.fn.validate) {
        console.error("jQuery Validate não está carregado");
        jQueryValidate();
        return;
    }

    $("#formulario").validate({
        rules: {
            login: {required: true},
            senha: {required: true}
        },
        messages: {
            login: {required: "Campo obrigatório"},
            senha: {required: "Campo obrigatório"}
        },
        errorElement: "span",
        errorClass: "error-message"
    });
}

function jQueryValidate() {
    console.log("Carregando jQuery Validate dinamicamente...");
    $.getScript("https://cdn.jsdelivr.net/npm/jquery-validation@1.19.3/dist/jquery.validate.min.js")
        .done(function() {
            console.log("jQuery Validate carregado com sucesso");
            validacao();
        })
        .fail(function() {
            console.error("Falha ao carregar jQuery Validate");
            $("#formulario").submit(function(e) {
                if (!$("#login").val() || !$("#senha").val()) {
                    alert("Preencha todos os campos");
                    e.preventDefault();
                }
            });
        });
}