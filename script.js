window.onload = () => {
	let bestScore = localStorage.getItem("bestScore-x3");
	bestScore = bestScore === null ? "NA" : bestScore;
	document.getElementById("bestScore").innerHTML = bestScore;
	
	let bestTime = localStorage.getItem("bestTime-x3");
	bestTime = bestTime === null ? "NA" : displayTime(bestTime);
	document.getElementById("bestTime").innerHTML = bestTime;

	let soundOn = true;
	let animationOn = true;
	let backgroundOn = true;

	function soundToggle() {
		soundOn = !soundOn;
		document.getElementById("sound").checked = soundOn;
		document.getElementById("sound2").checked = soundOn;
	}

	function animationToggle() {
		animationOn = !animationOn;
		document.getElementById("animation").checked = animationOn;
		document.getElementById("animation2").checked = animationOn;
	}

	function backgroundToggle() {
		backgroundOn = !backgroundOn;
		document.getElementById("background-toggle").checked = backgroundOn;
		document.getElementById("background-toggle2").checked = backgroundOn;
		if (backgroundOn) {
			background();
		} else {
			clearInterval(bgInterval);
			document.getElementById("background").innerHTML = "";
		}

	}

	document.getElementById("sound").addEventListener("change", soundToggle);
	document.getElementById("sound2").addEventListener("change", soundToggle);
	document.getElementById("animation").addEventListener("change", animationToggle);
	document.getElementById("animation2").addEventListener("change", animationToggle);
	document.getElementById("background-toggle").addEventListener("change", backgroundToggle);
	document.getElementById("background-toggle2").addEventListener("change", backgroundToggle);


	function radioChange(e) {
		const id = e.target.id;
		if (id.includes("mobile-")) {
			document.getElementById(id.replace("mobile-", "")).checked = true;
		} else {
			document.getElementById("mobile-"+id).checked = true;
		}

		const mode = id.replace("mobile-", "").substr(1);
		document.getElementById("board").className = mode;
		
		let bestScore = localStorage.getItem("bestScore-"+mode);
		bestScore = bestScore === null ? "NA" : bestScore;
		document.getElementById("bestScore").innerHTML = bestScore;
		
		let bestTime = localStorage.getItem("bestTime-"+mode);
		bestTime = bestTime === null ? "NA" : displayTime(bestTime);
		document.getElementById("bestTime").innerHTML = bestTime;

		clearInterval(interval);
		resetBoard();
	}

	document.getElementById("3x3").addEventListener("change", radioChange);
	document.getElementById("4x4").addEventListener("change", radioChange);
	document.getElementById("5x5").addEventListener("change", radioChange);
	document.getElementById("mobile-3x3").addEventListener("change", radioChange);
	document.getElementById("mobile-4x4").addEventListener("change", radioChange);
	document.getElementById("mobile-5x5").addEventListener("change", radioChange);


	function displayTime(d) {
		let s = String(d % 60);
		let m = String(Math.floor(d / 60));

		if (s.length < 2) {s = "0" + s}

		return m + ":" + s; 
	}

	function resetBoard() {		
		const old_element = document.getElementById("board");
		const new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);
		new_element.className = new_element.className.replace(" won", "");

		let boardTiles = document.getElementById("board").children;
		for (let row = 0; row < boardTiles.length; row++) {
			for (let col = 0; col < boardTiles[row].children.length; col++) {
				boardTiles[row].children[col].className = "row" + (row+1) + " col" + (col+1) + " tile";
			}
		}

		document.getElementById("moves").innerHTML = "0";
		document.getElementById("time").innerHTML = "0:00";
		document.getElementById("start").innerHTML = "Play";
	}

	function shuffleBoard(blank, mode) {
		let tiles = [];
		for (let row = 1; row <= mode; row++) {
			for (let col = 1; col <= mode; col++) {
				tiles.push("row" + row + " col" + col);
			}
		}
		tiles[blank] = "blank";

		for (let i = 0; i < 10000; i++) {
			let moved = false;
			while (!moved) {
				let num = Math.floor(Math.random() * 4);
				if (num === 0) {
					const moveIndex = tiles.indexOf("blank") - mode;
					if (moveIndex > -1) {
						const tmp = tiles[moveIndex];
						tiles[moveIndex] = "blank";
						tiles[moveIndex+mode] = tmp;
						moved = true;
					}
				} else if (num === 1) {
					const moveIndex = tiles.indexOf("blank") + 1;
					if (moveIndex % mode !== 0 && moveIndex < mode**2) {
						const tmp = tiles[moveIndex];
						tiles[moveIndex] = "blank";
						tiles[moveIndex-1] = tmp;
						moved = true;
					}
				} else if (num === 2) {
					const moveIndex = tiles.indexOf("blank") + mode;
					if (moveIndex < mode**2) {
						const tmp = tiles[moveIndex];
						tiles[moveIndex] = "blank";
						tiles[moveIndex-mode] = tmp;
						moved = true;
					}
				} else if (num === 3) {
					const moveIndex = tiles.indexOf("blank") - 1;
					if ((moveIndex + 1) % mode !== 0 && moveIndex > 0) {
						const tmp = tiles[moveIndex];
						tiles[moveIndex] = "blank";
						tiles[moveIndex+1] = tmp;
						moved = true;
					}
				}
			}
		}

		for (let row = 0; row < mode; row++) {
			for (let col=0; col < mode; col++) {
				document.getElementById("board").children[row].children[col].className = tiles[row*mode+col] + " tile";
			}
		}
	}

	function checkWin(blank, moves, timeStart, interval, mode) {
		let correctTiles = [];
		for (let row = 1; row <= mode; row++) {
			for (let col = 1; col <= mode; col++) {
				correctTiles.push("row" + row + " col" + col);
			}
		}
		correctTiles[blank] = "blank";

		const boardTiles = document.getElementById("board").children;
		for (let row = 0; row < mode; row++) {
			for (let col = 0; col < mode; col++) {
				if (boardTiles[row].children[col].className.replace(" tile", "") !== correctTiles[row*mode+col]) {
					return;
				}
			}
		}

		clearInterval(interval);
		document.getElementById("board").className += " won";

		if (localStorage.getItem("bestScore-x"+mode) === null || moves < Number(localStorage.getItem("bestScore-x"+mode))) {
			localStorage.setItem("bestScore-x"+mode, moves);
			document.getElementById("bestScore").innerHTML = moves;
		}

		let time = Math.floor((new Date() - timeStart)/1000);
		if (localStorage.getItem("bestTime-x"+mode) === null || time < Number(localStorage.getItem("bestTime-x"+mode))) {		
			localStorage.setItem("bestTime-x"+mode, time);
			document.getElementById("bestTime").innerHTML = displayTime(time);
		}
	}

	let interval = 0;
	document.getElementById("start").addEventListener("click", () => {
		const old_element = document.getElementById("board");
		const new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);

		new_element.className = new_element.className.replace(" won", "");
		const mode = Number(new_element.className.substr(1));
		let moves = 0;
		document.getElementById("moves").innerHTML = moves;
		let timeStart = new Date().getTime();
		document.getElementById("time").innerHTML = "0:00";

		const blank = Math.floor(Math.random() * mode**2);
		document.getElementById("start").innerHTML = "Restart";
		shuffleBoard(blank, mode);

		clearInterval(interval);
		interval = setInterval(() => {
			document.getElementById("time").innerHTML = displayTime(Math.floor((new Date().getTime() - timeStart)/1000));
		}, 250);

		const sound = new Howl({
			src: ['media/slide.wav']
		});

		document.querySelectorAll(".tile").forEach( tile => {
			tile.addEventListener("click", (e) => {
				const row = Number(tile.parentElement.id.replace("row", ""));
				let col;
				for (let c = 0; c < mode; c++) {
					if (document.getElementById("row"+row).children[c] == e.target) {
						col = c;
						break;
					}
				}

				if (row < mode) {
					if (document.getElementById("row"+String(row + 1)).children[col].className.includes("blank")) {
						if (document.getElementById("sound").checked) {
							sound.play();
						}
						let time = 0;
						if (document.getElementById("animation").checked) {
							time = 150;
							tile.className += " down";
						}
						setTimeout(() => {
							document.getElementById("row"+String(row + 1)).children[col].className = tile.className.replace(" down", "");
							tile.className = "blank tile";
							moves++;
							document.getElementById("moves").innerHTML = moves;
							checkWin(blank, moves, timeStart, interval, mode);
							return;
						}, time);
					}
				} if (row > 1) {
					if (document.getElementById("row"+String(row - 1)).children[col].className.includes("blank")) {
						if (document.getElementById("sound").checked) {
							sound.play();
						}
						let time = 0;
						if (document.getElementById("animation").checked) {
							time = 150;
							tile.className += " up";
						}
						setTimeout(() => {
							document.getElementById("row"+String(row - 1)).children[col].className = tile.className.replace(" up", "");
							tile.className = "blank tile";
							moves++;
							document.getElementById("moves").innerHTML = moves;
							checkWin(blank, moves, timeStart, interval, mode);
							return;
						}, time);
					}
				} if (col < mode-1) {
					if (document.getElementById("row"+String(row)).children[col+1].className.includes("blank")) {
						if (document.getElementById("sound").checked) {
							sound.play();
						}
						let time = 0;
						if (document.getElementById("animation").checked) {
							time = 150;
							tile.className += " right";
						}
						setTimeout(() => {
							document.getElementById("row"+String(row)).children[col+1].className = tile.className.replace(" right", "");
							tile.className = "blank tile";
							moves++;
							document.getElementById("moves").innerHTML = moves;
							checkWin(blank, moves, timeStart, interval, mode);
							return;
						}, time);
					}
				} if (col > 0) {
					if (document.getElementById("row"+String(row)).children[col-1].className.includes("blank")) {
						if (document.getElementById("sound").checked) {
							sound.play();
						}
						let time = 0;
						if (document.getElementById("animation").checked) {
							time = 150;
							tile.className += " left";
						}
						setTimeout(() => {
							document.getElementById("row"+String(row)).children[col-1].className = tile.className.replace(" left", "");
							tile.className = "blank tile";
							moves++;
							document.getElementById("moves").innerHTML = moves;
							checkWin(blank, moves, timeStart, interval, mode);
							return;
						}, time);
					}
				}
			});
		});
	});
	
	document.querySelectorAll("#images button").forEach(button => {
		button.addEventListener("click", () =>{
			document.querySelectorAll(".tile").forEach(tile => {
				tile.style.backgroundImage = "url("+button.getAttribute("data-src")+")";
			});
			clearInterval(interval);
			resetBoard();
		});
	});
	document.querySelectorAll("#mobile-images button").forEach(button => {
		button.addEventListener("click", () =>{
			document.querySelectorAll(".tile").forEach(tile => {
				tile.style.backgroundImage = "url("+button.getAttribute("data-src")+")";
			});
			clearInterval(interval);
			resetBoard();
		});
	});

	document.getElementById("img-input").onchange = function (e) {
		const files = e.target.files;
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
	document.getElementById("mobile-img-input").onchange = function (e) {
		const files = e.target.files;
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



	let bgInterval;
	function background() {
		if (backgroundOn) {
			document.getElementById("background").innerHTML = "";
			clearInterval(bgInterval);

			const cols = Math.ceil(window.innerWidth / 175);
			const rows = Math.ceil(window.innerHeight / 175);
			const randBlank = Math.floor(Math.random() * (cols*rows));

			const colours = ["#cc0000bb", "#00cc00bb", "#0000ccbb", "#cccc00bb", "#cc00ccbb", "#00ccccbb"]
			for (let r = 1; r <= rows; r++) {
				let row = document.createElement("div");
				row.id = "bg-row"+r;
				row.className = "bg-row"
				document.getElementById("background").appendChild(row);
				for (let c = 1; c <= cols; c++) {
					let col = document.createElement("div");
					document.getElementById("bg-row"+r).appendChild(col);
				}
			}

			for (let r = 1; r <= rows; r++) {
				for (let c = 1; c <= cols; c++) {
					col = document.getElementById("bg-row"+r).children[c-1];
					if ((r-1)*cols + c !== randBlank) {
						col.className = "bg-tile bg-col" + c;					
						colour1 = colours[Math.floor(Math.random() * colours.length)];
						colour2 = colours[Math.floor(Math.random() * colours.length)];
						while (colour1 == colour2) {
							colour1 = colours[Math.floor(Math.random() * colours.length)];
							colour2 = colours[Math.floor(Math.random() * colours.length)];
						}
						col.style.background = "linear-gradient("+Math.floor(Math.random() * 360)+"deg,"+colour1+","+colour2+")";
					} else {
						col.className = "bg-tile bg-blank bg-col"+c;
					}
				}
			}

			let last_direction;
			bgInterval = setInterval(() => {
				const blank = document.querySelector(".bg-blank");
				const blankRow = Number(blank.parentElement.id.replace("bg-row", ""));
				const blankCol = Number(blank.className.replace("bg-tile bg-blank bg-col", ""));
				let moved = false;
				while (!moved) {
					let direction = Math.floor(Math.random() * 4);
					while (direction === 3-last_direction) {
						direction = Math.floor(Math.random() * 4);
					}
					if (direction === 0 && blankRow < rows) {
						moved = true;
						let tile = document.getElementById("bg-row"+String(blankRow + 1)).children[blankCol-1];
						tile.className += " up";
						setTimeout(() => {
							blank.style.background = tile.style.background;
							blank.className = "bg-tile bg-col"+blankCol;
							tile.className = "bg-tile bg-blank bg-col"+blankCol;
							tile.background = "";
							last_direction = direction;
						}, 500);
					} else if (direction === 1 && blankCol < cols) {
						moved = true;
						let tile = document.getElementById("bg-row"+blankRow).children[blankCol];
						tile.className += " left";
						setTimeout(() => {
							blank.style.background = tile.style.background;
							blank.className = "bg-tile bg-col"+blankCol;
							tile.className = "bg-tile bg-blank bg-col"+(blankCol+1);
							tile.background = "";
							last_direction = direction;
						}, 500);
					} else if (direction === 2 && blankCol > 1) {
						moved = true;
						let tile = document.getElementById("bg-row"+blankRow).children[blankCol-2];
						tile.className += " right";
						setTimeout(() => {
							blank.style.background = tile.style.background;
							blank.className = "bg-tile bg-col"+blankCol;
							tile.className = "bg-tile bg-blank bg-col"+(blankCol-1);
							tile.background = "";
							last_direction = direction;
						}, 500);
					} else if (direction === 3 && blankRow > 1) {
						moved = true;
						let tile = document.getElementById("bg-row"+String(blankRow - 1)).children[blankCol-1];
						tile.className += " down";
						setTimeout(() => {
							blank.style.background = tile.style.background;
							blank.className = "bg-tile bg-col"+blankCol;
							tile.className = "bg-tile bg-blank bg-col"+blankCol;
							tile.background = "";
							last_direction = direction;
						}, 500);
					}
				}
			}, 1000);
		}
	}
	background();
	window.addEventListener("resize", background);
}