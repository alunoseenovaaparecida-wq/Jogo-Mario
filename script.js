// Seleciona os elementos do DOM usados no jogo
const goku = document.querySelector('.goku');           // Imagem do Goku
const pipe = document.querySelector('.pipe');             // Obstáculo (cano)
const start = document.querySelector('.start');           // Botão "Iniciar"
const gameOver = document.querySelector('.game-over');    // Tela "Game Over"
let score = 0; //Pontuação inicia com zero


// Cria objetos de áudio para sons do jogo
const audioStart = new Audio('./song/audio_theme.mp3');    // Música tema do jogo
const audioGameOver = new Audio('./song/audio_gameover.mp3'); // Som de game over

let loopInterval; // Variável global para armazenar o intervalo do loop que verifica colisões
let isGameRunning = false; // controla se o jogo está ativo

// Função para iniciar o jogo
const startGame = () => {
    pipe.classList.add('pipe-animation'); // Ativa a animação do cano (obstáculo)
    start.style.display = 'none';          // Esconde o botão "Iniciar"
    gameOver.style.display = 'none';
    
    score = 0;
    document.querySelector('.score').textContent = `Pontos: ${score}`;
    
    isGameRunning = true;

    audioStart.currentTime = 0;             // Reinicia a música do tema
    audioStart.play();                      // Toca a música do tema

    clearInterval(loopInterval); // evita múltiplos loops
    loop(); // inicia o loop de colisão
   
};

// Função para reiniciar o jogo após game over
const restartGame = () => {
    startGame(); // reaproveita a lógica de startGame
    start.style.display = 'none';           // Mantém o botão "Iniciar" escondido
    gameOver.style.display = 'none';        // Esconde a tela de game over


    // Reseta o Goku para o estado inicial
    goku.src = './img/goku.gif';           // Imagem padrão do Goku (animado)
    goku.style.width = '150px';              // Tamanho padrão
    goku.style.bottom = '0';                 // Goku no chão
    goku.style.marginLeft = '0';             // Remove margem lateral
    goku.classList.remove('jump');           // Remove a classe de pulo caso esteja aplicada

    // Reseta o cano (obstáculo)
    pipe.classList.remove('pipe-animation'); // Para a animação atual
    void pipe.offsetWidth;                    // Força o navegador a "reprocessar" o elemento (reflow) para reiniciar animação
    pipe.classList.add('pipe-animation');    // Reinicia a animação do cano
    pipe.style.left = '';                     // Limpa a posição à esquerda
    pipe.style.right = '0';                   // Coloca o cano na posição inicial à direita

    // Para o som de game over e reinicia a música do tema
    audioGameOver.pause();
    audioGameOver.currentTime = 0;

    audioStart.currentTime = 0;
    audioStart.play();

    // Reinicia a verificação de colisão
    clearInterval(loopInterval); // Para o loop atual caso exista
    loop();                     // Inicia novamente o loop
};

// Função que faz o Goku pular
const jump = () => {
    if (!isGameRunning) return;   // Só aumenta pontuação se jogo estiver ativo
    goku.classList.add('jump');               // Aplica a animação de pulo


   // Só aumenta pontuação se jogo estiver ativo
    score++;
    document.querySelector('.score').textContent = `Pontos: ${score}`;

    // Após 800ms, remove a animação para que o Goku volte ao chão
    setTimeout(() => {
        goku.classList.remove('jump');
    }, 800);
};
  

// Loop que verifica colisão entre Goku e o cano
const loop = () => {
    loopInterval = setInterval(() => {
        const pipePosition = pipe.offsetLeft;                   // Posição horizontal do cano
        const gokuPosition = parseFloat(getComputedStyle(goku).bottom); // Posição vertical (em px) do Mario

        // Condição de colisão: cano perto demais e Goku muito baixo (não pulou)
        if (pipePosition <= 120 && pipePosition > 0 && gokuPosition < 90) {
            pipe.classList.remove('pipe-animation');            // Para a animação do cano
            pipe.style.left = `${pipePosition}px`;              // Fixar o cano na posição atual

            goku.src = './img/game-over.png';                   // Troca a imagem do Goku para "game over"
            goku.style.width = '80px';                           // Ajusta tamanho da imagem
            goku.style.marginLeft = '50px';                      // Ajusta margem para posicionar melhor

            audioStart.pause();                                   // Para a música tema
            audioGameOver.play();                                 // Toca o som de game over

            gameOver.style.display = 'flex';                      // Mostra a tela de game over

            clearInterval(loopInterval);                          // Para o loop de colisão
            isGameRunning = false;

        }
    }, 10);  // Verifica colisão a cada 10 milissegundos
};

// Inicia o loop assim que a página carrega, para já detectar colisões
loop();

// Evento para escutar quando o usuário pressiona uma tecla
document.addEventListener('keypress', e => {
    const tecla = e.key;
    if (tecla === ' ') {   // Se pressionar espaço, Mario pula
        jump();
    } else if (tecla === 'Enter') {  // Se pressionar Enter, inicia o jogo
        startGame();
    }
});

// Evento para escutar toques na tela (mobile)
document.addEventListener('touchstart', e => {
    if (e.touches.length) {
        jump(); // Mario pula ao tocar na tela
    }
});