function shuffletiles(tiles) {
	
	return tiles;
}

function shuffleBoard(blank) {
	const tiles = [
		"row1 col1",
		"row1 col2",
		"row1 col3",
		"row2 col1",
		"row2 col2",
		"row2 col3",
		"row3 col1",
		"row3 col2",
		"row3 col3",
	];
	tiles[blank] = "blank";

	for (let i = 0; i < 1000000; i++) {
		let moved = false;
		while (!moved) {
			let num = Math.floor(Math.random() * 4);
			if (num === 0) {
				const moveIndex = tiles.indexOf("blank") - 3;
				if (moveIndex > -1) {
					const tmp = tiles[moveIndex];
					tiles[moveIndex] = "blank";
					tiles[moveIndex+3] = tmp;
					moved = true;
				}
			} else if (num === 1) {
				const moveIndex = tiles.indexOf("blank") + 1;
				if (moveIndex % 3 !== 0 && moveIndex < 9) {
					const tmp = tiles[moveIndex];
					tiles[moveIndex] = "blank";
					tiles[moveIndex-1] = tmp;
					moved = true;
				}
			} else if (num === 2) {
				const moveIndex = tiles.indexOf("blank") + 3;
				if (moveIndex < 9) {
					const tmp = tiles[moveIndex];
					tiles[moveIndex] = "blank";
					tiles[moveIndex-3] = tmp;
					moved = true;
				}
			} else if (num === 3) {
				const moveIndex = tiles.indexOf("blank") - 1;
				if ((moveIndex + 1) % 3 !== 0 && moveIndex > 0) {
					const tmp = tiles[moveIndex];
					tiles[moveIndex] = "blank";
					tiles[moveIndex+1] = tmp;
					moved = true;
				}
			}
		}
	}

	let boardTiles = document.getElementById("board").children;
	for (let row = 0; row < boardTiles.length; row++) {
		for (let col=0; col < boardTiles[row].children.length; col++) {
			boardTiles[row].children[col].className = tiles[row*3+col] + " tile";
		}
	}
}

function checkWin(blank) {
	const correctTiles = [
		"row1 col1",
		"row1 col2",
		"row1 col3",
		"row2 col1",
		"row2 col2",
		"row2 col3",
		"row3 col1",
		"row3 col2",
		"row3 col3",
	];
	correctTiles[blank] = "blank";

	const boardTiles = document.getElementById("board").children;
	for (let row = 0; row < boardTiles.length; row++) {
		for (let col = 0; col < boardTiles[row].children.length; col++) {
			if (boardTiles[row].children[col].className.replace(" tile", "") !== correctTiles[row*3+col]) {
				return;
			}
		}
	}

	document.getElementById("board").className = "won";
}

function play() {
	const old_element = document.getElementById("board");
	const new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);

	document.getElementById("board").className = "";
	let moves = 0;
	document.getElementById("moves").innerHTML = moves;
	const blank = Math.floor(Math.random() * 9);
	document.getElementById("start").innerHTML = "restart";
	shuffleBoard(blank);

	document.querySelectorAll(".tile").forEach( tile => {
		tile.addEventListener("click", () => {
			const id = Number(tile.id);
			const row = Number(tile.parentElement.id.replace("row", ""));
			const col = (id - 1) % 3;

			if (row < 3) {
				if (document.getElementById("row"+String(row + 1)).children[col].className.includes("blank")) {
					document.getElementById("row"+String(row + 1)).children[col].className = tile.className;
					tile.className = "blank tile";
					moves++;
					document.getElementById("moves").innerHTML = moves;
					checkWin(blank);
					return
				}
			} if (row > 1) {
				if (document.getElementById("row"+String(row - 1)).children[col].className.includes("blank")) {
					document.getElementById("row"+String(row - 1)).children[col].className = tile.className;
					tile.className = "blank tile";
					moves++;
					document.getElementById("moves").innerHTML = moves;
					checkWin(blank);
					return
				}
			} if (col < 2) {
				if (document.getElementById("row"+String(row)).children[col+1].className.includes("blank")) {
					document.getElementById("row"+String(row)).children[col+1].className = tile.className;
					tile.className = "blank tile";
					moves++;
					document.getElementById("moves").innerHTML = moves;
					checkWin(blank);
					return
				}
			} if (col > 0) {
				if (document.getElementById("row"+String(row)).children[col-1].className.includes("blank")) {
					document.getElementById("row"+String(row)).children[col-1].className = tile.className;
					tile.className = "blank tile";
					moves++;
					document.getElementById("moves").innerHTML = moves;
					checkWin(blank);
					return
				}
			}
		});
	});
}

document.getElementById("start").addEventListener("click", play);