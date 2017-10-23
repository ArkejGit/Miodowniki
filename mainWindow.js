const electron = require('electron');
const {ipcRenderer, shell} = require('electron');
const path = require('path');

let loadedEpisodes;		

//load episodes
ipcRenderer.on('loadEpisodes', function(e, episodes){
	loadedEpisodes = episodes;

	const main = document.getElementsByTagName('main')[0];

	Object.keys(episodes).forEach(key => {
		const ul = document.createElement('ul');
		ul.className = 'collection with-header';
		const liHeader = document.createElement('li');
		liHeader.className = 'collection-header center-align grey lighten-4 grey-text text-darken-3';
		liHeader.innerHTML = ('<h5>SEZON ' + key.slice(-2) + '</h5>');

		ul.appendChild(liHeader);
		main.appendChild(ul);

		episodes[key].forEach(episode => {
			const li = document.createElement('li');
			li.className = 'collection-item';
			const liText = document.createTextNode(episode.title);
			const playButton = document.createElement('a');
			playButton.className = 'btn-floating waves-effect waves-light amber darken-2';
			playButton.innerHTML = '<i class="material-icons">play_arrow</i>';

			li.appendChild(liText);
			li.appendChild(playButton);
			ul.appendChild(li);

			playButton.addEventListener('click', () => {
				shell.openItem(path.join(__dirname, 'episodes/' + episode.fileName));
			});
		})

	})
});

//handle clicking searchButton
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

searchButton.addEventListener('click', () => {
	randomization.classList.add('hide');
	searchInput.classList.toggle('hide');
	randomEpisodeDiv.classList.add('hide');
	drawLotsButton.innerText = 'Losuj';
	inputAll.checked = false;
	inputOldAla.checked = false;
})

//handle search change
searchInput.addEventListener('keyup', (e) => {
	[...document.getElementsByClassName('collection-item')].forEach((item) => {
		( item.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ) ?
		item.classList.remove('hide') :
		item.classList.add('hide')
	})
});

//handle clicking randomizationButton
const randomizationButton = document.getElementById('randomizationButton');
const randomization = document.getElementById('randomization');

randomizationButton.addEventListener('click', () => {
	searchInput.classList.add('hide');
	randomization.classList.toggle('hide');
	randomEpisodeDiv.classList.add('hide');
	drawLotsButton.innerText = 'Losuj';
	inputAll.checked = false;
	inputOldAla.checked = false;
})

//handle randomization
const drawLotsButton = document.getElementById('drawLotsButton');
const inputAll = document.getElementById('inputAll');
const inputOldAla = document.getElementById('inputOldAla');
const randomEpisodeDiv = document.getElementById('randomEpisode');
const randomEpisodeTitle = document.getElementById('randomEpisodeTitle');
const playRandomEpisodeButton = document.getElementById('playRandomEpisodeButton');

drawLotsButton.addEventListener('click', () => {
	if (!inputAll.checked && !inputOldAla.checked) return;

	let episodesToDrawLots = [];

	Object.keys(loadedEpisodes).forEach(key => {
		loadedEpisodes[key].forEach(episode => {
			if (inputOldAla.checked && episode.episode >= 93) return;
			episodesToDrawLots.push(episode)
		});
	});

	const randomNumber = Math.floor(Math.random() * episodesToDrawLots.length);
	const randomEpisode = episodesToDrawLots[randomNumber];

	randomEpisodeDiv.classList.remove('hide');
	randomEpisodeTitle.innerHTML = '<b>' + randomEpisode.title + '</b>';
	drawLotsButton.innerText = 'Losuj inny odcinek';

	playRandomEpisodeButton.addEventListener('click', () => {
				shell.openItem(path.join(__dirname, 'episodes/' + randomEpisode.fileName));
			});
}) 