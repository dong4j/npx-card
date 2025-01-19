const chalk = require('chalk');
const clear = require('clear');

class DinoGame {
    constructor() {
        this.dino = '🦖';  // 使用朝右的霸王龙
        this.cactus = '🌵';
        this.ground = '⎯';
        this.sky = ' ';
        this.dinoPos = 0;
        this.jumping = false;
        this.score = 0;
        this.gameOver = false;
        this.obstaclePos = 40;
        this.groundLevel = 0;    // 将地面级别调整为0
        this.jumpHeight = 4;  // 增加跳跃高度
        this.jumpVelocity = 0;  // 添加跳跃速度
        this.jumpForce = 1.2;   // 跳跃力度
        this.gravity = 0.15;     // 减小重力，使跳跃更流畅
        this.frameCount = 0;
        this.gameSpeed = 80;    // 控制游戏速度（毫秒/帧）
    }

    drawFrame() {
        clear();
        let frame = '';
        
        // Score
        frame += chalk.yellow(`Score: ${this.score}\n\n`);
        
        // Game area
        for (let i = this.jumpHeight; i >= 0; i--) {
            for (let j = 0; j < 50; j++) {
                if (j === 5 && Math.round(i) === Math.round(this.dinoPos)) {
                    frame += this.dino;
                } else if (j === this.obstaclePos && i === this.groundLevel) {
                    frame += this.cactus;
                } else {
                    frame += this.sky;
                }
            }
            frame += '\n';
        }
        
        // Ground
        frame += chalk.green(this.ground.repeat(50)) + '\n';
        
        if (this.gameOver) {
            frame += chalk.red.bold('\n🎮 GAME OVER! 🎮\n');
            frame += chalk.yellow(`Final Score: ${this.score}\n`);
        } else {
            frame += '\nPress SPACE to jump, Ctrl+C to exit\n';
        }
        
        console.log(frame);
    }

    jump() {
        if (!this.jumping && this.dinoPos === 0) {
            this.jumping = true;
            this.jumpVelocity = this.jumpForce;  // 设置初始跳跃速度
        }
    }

    update() {
        // Update dino position with physics
        if (this.jumping) {
            this.dinoPos += this.jumpVelocity;
            this.jumpVelocity -= this.gravity;
            
            // 限制最大高度
            if (this.dinoPos >= this.jumpHeight) {
                this.dinoPos = this.jumpHeight;
                this.jumpVelocity = -this.gravity; // 开始下落
            }
            
            // 着陆检测
            if (this.dinoPos <= 0) {
                this.dinoPos = 0;
                this.jumping = false;
                this.jumpVelocity = 0;
            }
        }

        // Update obstacle position
        this.obstaclePos--;
        if (this.obstaclePos < 0) {
            this.obstaclePos = 49;
            this.score++;
            // 随着分数增加，适当增加游戏速度
            this.gameSpeed = Math.max(50, 80 - Math.floor(this.score / 5) * 2);
        }

        // Collision detection
        if (this.obstaclePos === 5 && this.dinoPos <= this.groundLevel) {
            this.gameOver = true;
        }

        this.frameCount++;
    }

    async start() {
        // Handle keyboard input
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => {
            if (key[0] === 3) {  // Ctrl+C
                process.exit();
            }
            if (key[0] === 32) {  // Space
                this.jump();
            }
        });

        // Game loop
        while (!this.gameOver) {
            this.update();
            this.drawFrame();
            await new Promise(resolve => setTimeout(resolve, this.gameSpeed));
        }

        this.drawFrame();  // Show final frame
        process.stdin.setRawMode(false);
        process.stdin.pause();
    }
}

module.exports = DinoGame;
