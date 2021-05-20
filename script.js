function _() {
	function displayTime(d) {
		var m = String(Math.floor(d % 3600 / 60));
		var s = String(Math.floor(d % 3600 % 60));

		if (s.length < 2) {s = "0" + s}

		return m + ":" + s; 
	}

	function resetBoard() {		
		const old_element = document.getElementById("board");
		const new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);
		document.getElementById("board").className = "";

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
		let boardTiles = document.getElementById("board").children;
		for (let row = 0; row < boardTiles.length; row++) {
			for (let col=0; col < boardTiles[row].children.length; col++) {
				boardTiles[row].children[col].className = tiles[row*3+col] + " tile";
			}
		}

		document.getElementById("moves").innerHTML = "0";
		document.getElementById("time").innerHTML = "0:00";
		document.getElementById("start").innerHTML = "Play";
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

	function checkWin(blank, moves, timeStart, interval) {
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

		clearInterval(interval);
		document.getElementById("board").className = "won";

		if (localStorage.getItem("bestScore") === null || moves < Number(localStorage.getItem("bestScore"))) {
			localStorage.setItem("bestScore", moves);
			document.getElementById("bestScore").innerHTML = moves;
		}

		let time = Math.floor((new Date() - timeStart)/1000);
		if (localStorage.getItem("bestTime") === null || time < Number(localStorage.getItem("bestTime"))) {		
			localStorage.setItem("bestTime", time);
			document.getElementById("bestTime").innerHTML = displayTime(time);
		}
	}

	let interval = 0;
	function play() {
		const old_element = document.getElementById("board");
		const new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);

		document.getElementById("board").className = "";
		let moves = 0;
		document.getElementById("moves").innerHTML = moves;
		let timeStart = new Date().getTime();
		document.getElementById("time").innerHTML = "0:00";

		const blank = Math.floor(Math.random() * 9);
		document.getElementById("start").innerHTML = "Restart";
		shuffleBoard(blank);

		clearInterval(interval);
		interval = setInterval(() => {
			document.getElementById("time").innerHTML = displayTime(Math.floor((new Date().getTime() - timeStart)/1000));
		}, 250);

		const sound = new Howl({
			src: ['media/slide.wav']
		});

		document.querySelectorAll(".tile").forEach( tile => {
			tile.addEventListener("click", () => {
				const id = Number(tile.id);
				const row = Number(tile.parentElement.id.replace("row", ""));
				const col = (id - 1) % 3;

				if (row < 3) {
					if (document.getElementById("row"+String(row + 1)).children[col].className.includes("blank")) {
						sound.play();
						tile.className += " down";
						setTimeout(() => {
							document.getElementById("row"+String(row + 1)).children[col].className = tile.className.replace(" down", "");
							tile.className = "blank tile";
							moves++;
							document.getElementById("moves").innerHTML = moves;
							checkWin(blank, moves, timeStart, interval);
							return;
						}, 150);
					}
				} if (row > 1) {
					if (document.getElementById("row"+String(row - 1)).children[col].className.includes("blank")) {
						sound.play();
						tile.className += " up";
						setTimeout(() => {
							document.getElementById("row"+String(row - 1)).children[col].className = tile.className.replace(" up", "");
							tile.className = "blank tile";
							moves++;
							document.getElementById("moves").innerHTML = moves;
							checkWin(blank, moves, timeStart, interval);
							return;
						}, 150);
					}
				} if (col < 2) {
					if (document.getElementById("row"+String(row)).children[col+1].className.includes("blank")) {
						sound.play();
						tile.className += " right";
						setTimeout(() => {
							document.getElementById("row"+String(row)).children[col+1].className = tile.className.replace(" right", "");
							tile.className = "blank tile";
							moves++;
							document.getElementById("moves").innerHTML = moves;
							checkWin(blank, moves, timeStart, interval);
							return;
						}, 150);
					}
				} if (col > 0) {
					if (document.getElementById("row"+String(row)).children[col-1].className.includes("blank")) {
						sound.play();
						tile.className += " left";
						setTimeout(() => {
							document.getElementById("row"+String(row)).children[col-1].className = tile.className.replace(" left", "");
							tile.className = "blank tile";
							moves++;
							document.getElementById("moves").innerHTML = moves;
							checkWin(blank, moves, timeStart, interval);
							return;
						}, 150);
					}
				}
			});
		});
	}
	document.getElementById("start").addEventListener("click", play);

	window.onload = () => {
		let bestScore = localStorage.getItem("bestScore");
		bestScore = bestScore === null ? "NA" : bestScore;
		document.getElementById("bestScore").innerHTML = bestScore;
		
		let bestTime = localStorage.getItem("bestTime");
		bestTime = bestTime === null ? "NA" : displayTime(bestTime);
		document.getElementById("bestTime").innerHTML = bestTime;
	}
	
	document.querySelectorAll("#images button").forEach(button => {
		button.addEventListener("click", () =>{
			document.querySelectorAll(".tile").forEach(tile => {
				tile.style.backgroundImage = "url("+button.getAttribute("data-src")+")";
			});
			clearInterval(interval);
			resetBoard();
		});
	});

	document.getElementById("img-form").onsubmit = function (e) {
		const files = e.target.children[0].files;

		var fr = new FileReader();
        fr.onload = function () {
			document.querySelectorAll(".tile").forEach(tile => {
				tile.style.backgroundImage = "url("+fr.result+")";
			});
        }
       fr.readAsDataURL(files[0]);

		clearInterval(interval);
		resetBoard();

		e.preventDefault();
	}
}
_();