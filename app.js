const grid = document.querySelector('.grid')
const score = document.getElementById('score')
const btn = document.querySelector('button')

const gridWidth = 560
const gridHeight = 300
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
let x = 2
let y = 2
let sc = 0

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 30]
let ballPosition = ballStart

let timerId

class Block {
    constructor(xAxis, yAxis)
    {
        this.bottomLeft = [xAxis, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
]

function addBlock() {
    for(let i=0;i<blocks.length;i++)
    {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block)
    }
}

addBlock()

function drawUser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}

const user = document.createElement('div')
user.classList.add('user')
drawUser()
grid.appendChild(user)


function moveUser(e) {
    switch(e.key)
    {
        case 'ArrowLeft':
            if(currentPosition[0] > 0)
            {
                currentPosition[0] -= 10
                drawUser()
            }
            break;
        case 'ArrowRight':
            if(currentPosition[0] < gridWidth - blockWidth )
            {
                currentPosition[0] += 10
                drawUser()
            }
            break;
    }
}
document.addEventListener('keydown', moveUser)

function drawBall() {
    ball.style.left = ballPosition[0] + 'px'
    ball.style.bottom = ballPosition[1] + 'px'
}

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

function moveBall() {
    ballPosition[0] += x
    ballPosition[1] += y
    drawBall()
    collision()
}

if(btn.innerHTML == "Start")
    btn.addEventListener('click', start)

function start() {
    timerId = setInterval(moveBall, 30)
}


function collision() {
    // block collisions
    for(let i=0;i<blocks.length;i++)
    {
        if((ballPosition[0]+ballDiameter>blocks[i].bottomLeft[0] && ballPosition[0]<blocks[i].bottomRight[0]) && ((ballPosition[1]+ballDiameter)>blocks[i].bottomLeft[1] && ballPosition[1]<blocks[i].topLeft[1]))
        {
            changeDirection()
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1)
            sc++
            score.innerHTML = "Score: " + sc
            if(blocks.length == 0)
            {
                score.innerHTML = "You won!"
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
                btn.innerHTML = "Restart"
                btn.addEventListener('click', restart)
            }
        }
    }

    // user collisions
    if(ballPosition[0]+ballDiameter>currentPosition[0] && ballPosition[0]<currentPosition[0]+blockWidth && ballPosition[1]<currentPosition[1] + blockHeight)
        changeDirection()

    // wall collisions
    if((ballPosition[0] >= (gridWidth - ballDiameter)) || ballPosition[0] <= 0 || (ballPosition[1] >= (gridHeight - ballDiameter)))
        changeDirection()
    
    // ground collision
    if(ballPosition[1] <= 0)
    {
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
        score.innerHTML = "You lose!"
        btn.innerHTML = "Restart"
        btn.addEventListener('click', restart)
    }
}

function restart() {
    document.location.reload()
}
function changeDirection() {
    if(x == 2 && y == 2)
        x = -2
    else if(x == -2 && y == 2)
        y = -2
    else if(x == -2 && y == -2)
        x = 2
    else if(x == 2 && y == -2)
        y = 2
    return
}

