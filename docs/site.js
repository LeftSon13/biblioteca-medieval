const botaoTema = document.getElementById("alternarTema");
const imagemCenario = document.getElementById("cenarioHero");
const textoTema = document.getElementById("textoTema");

botaoTema.addEventListener("click", function () {
    const estaNoite = document.body.dataset.tema === "noite";

    if (estaNoite) {
        document.body.dataset.tema = "vela";
        imagemCenario.src = "assets/biblioteca-acolhedora.png";
        imagemCenario.alt = "Salão de biblioteca medieval em pixel art, iluminado por velas";
        textoTema.textContent = "Luz de vela";
        botaoTema.setAttribute("aria-pressed", "false");
    } else {
        document.body.dataset.tema = "noite";
        imagemCenario.src = "assets/biblioteca-noturna.png";
        imagemCenario.alt = "Salão de biblioteca medieval em pixel art, iluminado pela noite azulada";
        textoTema.textContent = "Noite azul";
        botaoTema.setAttribute("aria-pressed", "true");
    }
});
