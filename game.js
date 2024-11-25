const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
    x: 50,
    y: 200,
    width: 34,
    height: 24,
    gravity: 0.5,
    velocity: 0,
    lift: -10
};

let obstacles = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Carregar imagens
const birdImg = new Image();
birdImg.src = 'assets/chicken.png';

const bgImg = new Image();
bgImg.src = 'assets/background.png';

const obstacleImg = new Image();
obstacleImg.src = 'assets/obstacle.png';

const groundImg = new Image();
groundImg.src = 'assets/ground.png';

// Eventos de toque
let isTouching = false;

canvas.addEventListener('mousedown', () => { isTouching = true; });
canvas.addEventListener('mouseup', () => { isTouching = false; });

canvas.addEventListener('touchstart', (e) => { 
    e.preventDefault(); 
    isTouching = true; 
}, false);

canvas.addEventListener('touchend', (e) => { 
    e.preventDefault(); 
    isTouching = false; 
}, false);

// Função para reiniciar o jogo
function resetGame() {
    bird.y = 200;
    bird.velocity = 0;
    obstacles = [];
    frame = 0;
    score = 0;
    gameOver = false;
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('shareBtn').style.display = 'none';
    animate();
}

// Atualizar posição da galinha
function update() {
    if (isTouching) {
        bird.velocity += bird.lift;
    } else {
        bird.velocity += bird.gravity;
    }
    bird.y += bird.velocity;

    // Limitar para não sair da tela
    if (bird.y + bird.height > canvas.height - 50) { // 50 para o chão
        bird.y = canvas.height - 50 - bird.height;
        gameOver = true;
    }

    // Adicionar obstáculos
    if (frame % 90 === 0) {
        let gap = 120;
        let height = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
        obstacles.push({ x: canvas.width, y: 0, width: 50, height: height });
        obstacles.push({ x: canvas.width, y: height + gap, width: 50, height: canvas.height - height - gap - 50 });
    }

    // Mover obstáculos
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= 2;

        // Detecção de colisão
        if (bird.x < obstacles[i].x + obstacles[i].width &&
            bird.x + bird.width > obstacles[i].x &&
            bird.y < obstacles[i].y + obstacles[i].height &&
            bird.y + bird.height > obstacles[i].y) {
                gameOver = true;
        }

        // Remover obstáculos fora da tela
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
        }
    }

    frame++;
}

// Renderizar o jogo
function render() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Desenhar galinha
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Desenhar obstáculos
    for (let obstacle of obstacles) {
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Desenhar chão
    ctx.drawImage(groundImg, 0, canvas.height - 50, canvas.width, 50);
}

// Loop do jogo
function animate() {
    if (gameOver) {
        cancelAnimationFrame(animation);
        document.getElementById('restartBtn').style.display = 'inline-block';
        document.getElementById('shareBtn').style.display = 'inline-block';
        saveScore();
        return;
    }
    update();
    render();
    animation = requestAnimationFrame(animate);
}

let animation;

// Botões
document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startBtn').style.display = 'none';
    animate();
});

document.getElementById('restartBtn').addEventListener('click', () => {
    resetGame();
});

document.getElementById('shareBtn').addEventListener('click', () => {
    // Implementar funcionalidade de compartilhamento
    alert('Compartilhar não implementado.');
});

// Função para salvar o score (Integração com Telegram API necessária)
function saveScore() {
    // Esta função deve enviar o score para o servidor que interage com a API do Telegram
    // Implementação necessária conforme a arquitetura do seu backend
    // Por exemplo, usando fetch para enviar o score a um endpoint do seu servidor
}
