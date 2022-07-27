// Initialise variables

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

let dragged = null
let winner = ''
let player = 'green'
let isStalemate = false

let board = resetBoard()

// Setup event listeners
document.querySelectorAll('.tile').forEach((tile) => {
  tile.addEventListener('drop', handleDropOnTile)
  tile.addEventListener('dragenter', handleDragEnter)
  tile.addEventListener('dragleave', handleDragLeave)
  tile.addEventListener('dragend', handleDragEnd)
  tile.addEventListener('dragover', blockDraggable)
})

function blockDraggable(e) {
  e.preventDefault()
  e.stopPropagation()
}

document.getElementById('init').addEventListener('click', resetBoard)

function handleDragStart(e) {
  this.style.opacity = 0.5
  e.dataTransfer.setDragImage(e.target, 0, 0)
  // e.target.src = `./assets/piece-scared.gif`
  dragged = e.target
}

function handleDragEnd(e) {
  this.style.opacity = 1
}

function handleDragOver(e) {
  e.stopPropagation() // stops the browser from redirecting.
  e.preventDefault()
  return false
}

function handleDragEnter(e) {
  e.stopPropagation() // stops the browser from redirecting.
  this.classList.add('over')
}

function handleDragLeave(e) {
  e.stopPropagation() // stops the browser from redirecting.
  this.classList.remove('over')
}

function handleDropOnTile(e) {
  e.stopPropagation() // stops the browser from redirecting.
  // move dragged element to the selected drop target
  handleDrop(dragged, e.target)
}

function handleDropOnPiece(e) {
  e.stopPropagation() // stops the browser from redirecting.
  // move dragged element to the selected drop target
  let tile = e.target.parentNode
  // Check it is being dragged to a tile
  if (tile && tile.classList.value.includes('tile')) {
    handleDrop(e.target, tile)
  } else {
    // Go back to tray
  }
}

function handleDrop(piece, tile) {
  tile.classList.remove('over')
  if (tile.lastChild) {
    // There is already a piece here
    // Check it is smaller than the added piece
    let defender = tile.lastChild
    let attacker = dragged
    if (getSize(attacker) > getSize(defender)) {
      defender.remove()
      placePiece(attacker, tile)
    } else {
      // Handle defeat
    }
  } else {
    placePiece(piece, tile)
  }
}

function handleHoverOverPiece(e) {
  let defender = e.target
  let attacker = dragged
  if (getSize(attacker) > getSize(defender)) {
    attacker.src = `./assets/piece-happy.gif`
    defender.src = `assets/piece-scared.gif`
  } else {
    attacker.src = `./assets/piece-worried.gif`
    defender.src = `assets/piece-happy.gif`
  }
}

function handleLeavePiece(e) {
  let defender = e.target
  let attacker = dragged
  if (getSize(attacker) > getSize(defender)) {
    attacker.src = `./assets/piece-happy.gif`
    defender.src = `assets/piece-happy.gif`
  } else {
    attacker.src = `./assets/piece-worried.gif`
    defender.src = `assets/piece-sleepy.gif`
  }
}

function handleClick(e) {
  e.target.src = `./assets/piece-scared.gif`
}

function placePiece(piece, tile) {
  piece.parentNode.removeChild(piece)
  piece.draggable = false
  tile.appendChild(piece)
  switchPlayers()
  checkStaleMate()
  checkGameWin()
}

function checkGameWin() {
  let gameArray = getGameArray()
  winCombos.forEach((combo) => {
    if (
      gameArray[combo[0]] === gameArray[combo[1]] &&
      gameArray[combo[1]] === gameArray[combo[2]] &&
      gameArray[combo[0]]
    ) {
      setWinCombo(combo)
      winner = gameArray[combo[0]]
      document.getElementById('title').innerText =
        `${winner} IS THE WINNER!!!`.toUpperCase()
    }
  })
}

function checkStaleMate() {
  isStalemate = getGameArray().filter((color) => color === '').length === 0
}

function resetBoard() {
  player = 'green'
  isStalemate = false
  winner = ''
  document.getElementById('title').innerText = `${player}'s TURN`.toUpperCase()
  clearBoard()
  resetTray(document.getElementById('pieces-tray-left'), 'green')
  resetTray(document.getElementById('pieces-tray-right'), 'purple')
}

function resetTray(tray, color) {
  while (tray.lastChild) {
    tray.lastChild.remove()
  }
  for (let i = 1; i < 7; i++) {
    const piece = document.createElement('img')
    piece.src = `./assets/piece-happy.gif`
    piece.draggable = color === player
    piece.className = `piece ${color} size-${i}`
    piece.addEventListener('click', handleClick)
    piece.addEventListener('dragstart', handleDragStart)
    piece.addEventListener('dragend', handleDragEnd)
    piece.addEventListener('drop', handleDropOnPiece)
    piece.addEventListener('dragenter', handleHoverOverPiece)
    piece.addEventListener('dragleave', handleLeavePiece)
    piece.addEventListener('dragend', blockDraggable)
    piece.addEventListener('dragover', blockDraggable)
    tray.appendChild(piece)
    // setInterval(() => handleSleep(piece), random(300, 10000))
  }
}

function clearBoard() {
  document.querySelectorAll('.tile').forEach((tile) => {
    while (tile.lastChild) {
      tile.lastChild.remove()
    }
  })
}

function getSize(piece) {
  return parseInt(piece.className.slice(-1))
}

// clearInterval(timer)
// timer = setInterval(handleMole, random(200, 3000))

function handleSleep(piece) {
  // console.log(piece)
  piece.src = `./assets/piece-sleepy.gif`
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
// const audio = new Audio('whack-audio.wav')

function switchPlayers() {
  player = player === 'purple' ? 'green' : 'purple'
  document.getElementById('title').innerText = `${player}'s TURN`.toUpperCase()
  document
    .querySelectorAll('.piece')
    .forEach((piece) => (piece.draggable = !piece.draggable))
}

function getGameArray() {
  let gameArray = []
  document.querySelectorAll('.tile').forEach((tile) => {
    let color = ''
    let piece = tile.lastChild
    if (piece) {
      color = piece.classList[1]
    }
    gameArray.push(color)
  })
  return gameArray
}

function setWinCombo(combo) {
  document.querySelectorAll('.tile').forEach((tile, i) => {
    if (combo.includes(i)) {
      let piece = tile.lastChild
      piece.src = `./assets/piece-happy.gif`
      piece.classList.add('piece-win')
    }
  })
}
