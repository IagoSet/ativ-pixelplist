document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("form-cadastro");
    const formLogin = document.getElementById("form-login");
    const formItens = document.getElementById("form-itens");
    const listaItens = document.getElementById("lista-itens");
    const contadorItens = document.getElementById("contador-itens");
    const logoutButton = document.getElementById("logout");

    let usuarioAtual = localStorage.getItem("usuario_logado");
    let itens = usuarioAtual ? JSON.parse(localStorage.getItem(`itens_${usuarioAtual}`)) || [] : [];
    let indiceEditando = null; // Para saber se estamos editando ou adicionando novo


    function atualizarContador() {
        contadorItens.textContent = `Total de itens: ${itens.length}`;
    }

    // Adiciona o título "PixelPlist" em todas as páginas
    const titulo = document.createElement("div");
    titulo.id = "titulo-site";
    titulo.textContent = "PixelPlist";
    document.body.appendChild(titulo);

    // Se estiver na tela de início, aguarda a tecla ESPAÇO para ir para cadastro.html
    if (window.location.pathname.includes("inicio.html")) {
        document.addEventListener("keydown", (event) => {
            if (event.code === "Space" || event.key === " ") { // Detecta a tecla espaço corretamente
                event.preventDefault(); // Evita a rolagem da página ao apertar espaço
                window.location.href = "cadastro.html"; // Redireciona para a tela de cadastro
            }
        });
    }

    // Se o usuário não está logado e não está na página de login ou cadastro, volta para a tela de início
    if (!usuarioAtual && !window.location.pathname.includes("inicio.html") && 
        !window.location.pathname.includes("cadastro.html") && 
        !window.location.pathname.includes("login.html")) {
        window.location.href = "inicio.html";
    }

    if (formCadastro) {
        formCadastro.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value.trim();
            
            if (!email || !senha) {
                alert("Preencha todos os campos!");
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
            
            if (usuarios[email]) {
                alert("Conta já existente, tente outra.");
                return;
            }

            usuarios[email] = senha;
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            localStorage.setItem("usuario_logado", email);
            window.location.href = "index.html";
        });
    }

    if (formLogin) {
        formLogin.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value.trim();
            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
            
            if (usuarios[email] && usuarios[email] === senha) {
                localStorage.setItem("usuario_logado", email);
                window.location.href = "index.html";
            } else {
                alert("Email ou senha incorretos!");
            }
        });
    }

    // Adiciona a funcionalidade de alternância da senha (olho aberto e fechado)
    document.querySelectorAll(".senha-container").forEach(container => {
        const senhaInput = container.querySelector("input");
        const toggleSenhaBtn = container.querySelector(".toggle-senha");

        if (senhaInput && toggleSenhaBtn) {
            toggleSenhaBtn.textContent = "🔒​​"; // Começa com o cadeado fechado

            toggleSenhaBtn.addEventListener("click", function () {
                if (senhaInput.type === "password") {
                    senhaInput.type = "text";
                    toggleSenhaBtn.textContent = "​🔓​​​"; 
                } else {
                    senhaInput.type = "password";
                    toggleSenhaBtn.textContent = "🔒​​​"; 
                }
            });
        }
    });

    if (formItens) {
        formItens.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const nome = document.getElementById("nome").value.trim();
            const descricao = document.getElementById("descricao").value.trim();
            
            if (!nome || !descricao) {
                alert("Preencha todos os campos!");
                return;
            }
            
            const item = { nome, descricao };

            if (indiceEditando !== null) {
                itens[indiceEditando] = item; // Atualiza item existente
                indiceEditando = null;
            } else {
                itens.push(item); // Adiciona novo
            }

localStorage.setItem(`itens_${usuarioAtual}`, JSON.stringify(itens));
atualizarLista();

            
            document.getElementById("nome").value = "";
            document.getElementById("descricao").value = "";
        });

        atualizarLista();
    }

    function atualizarLista() {
        listaItens.innerHTML = "";
        itens.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
            ${item.nome} - ${item.descricao}
            <button onclick="editarItem(${index})">Editar</button>
            <button onclick="removerItem(${index})">Remover</button>
        `;
                    listaItens.appendChild(li);
        });
        atualizarContador(); // <- Atualiza contador após renderizar lista

    }

    window.removerItem = (index) => {
        itens.splice(index, 1);
        localStorage.setItem(`itens_${usuarioAtual}`, JSON.stringify(itens));
        atualizarLista();
    };

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("usuario_logado");
            window.location.href = "inicio.html"; // Agora redireciona para a tela de início.
        });
    }

    window.editarItem = (index) => {
        const item = itens[index];
        document.getElementById("nome").value = item.nome;
        document.getElementById("descricao").value = item.descricao;
        indiceEditando = index;
    };
    

});
