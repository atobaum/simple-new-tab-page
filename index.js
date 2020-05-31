function setTestData(){
	sections = [
		{
			title: 'Media',
			content: [
				{
					title: 'Pocket',
					url: 'https://www.getpocket.com',
				},
				{
					title: 'Youtube',
					url: 'https://www.youtube.com',
				}
			]
		},
		{
			title: "Dev",
			content:[
				{
					title: "Github",
					url: "https://www.github.com/atobaum",
				},
				{
					title: "GeekNews",
					url: "https://news.hada.io/"
				},
				{
					title: "프로그래머스",
					url: "https://programmers.co.kr/",
				},
				{
					title: "BOJ",
					url: "https://www.acmicpc.net/",
				}
			]
		},
		{
			title: "ETC.",
			content: [
				{
					title: "Gmail",
					url: "https://mail.google.com/"
				}
			]
		}
	];

	chrome.storage.sync.set({sections}, function(){
		render();
	});
};

function addBookmark(section, bookmark){
	console.log("add Bookmark");
}

function removeBookmark(section, bookmark){
	console.log("remove Bookmark");
}

function render(){
	chrome.storage.sync.get(['sections'], function({sections}){
		if (!sections){
			return;
		}

		let sectionsDiv = document.getElementById('sections');
		// clear
		{
			let last;
			while (last = sectionsDiv.lastChild) sectionsDiv.removeChild(last);
		}

		sections.forEach(section => {
			let panel = document.createElement('div');
			panel.classList.add('panel');

			let title = document.createElement('h2');
			title.innerText = section.title;
			panel.appendChild(title);

			let ul = document.createElement('ul');
			section.content.forEach(bookmark => {
				let li = document.createElement('li');
				let a = document.createElement('a');
				a.href = bookmark.url;
				a.innerText = bookmark.title;
				li.appendChild(a);
				ul.appendChild(li);
			});
			panel.appendChild(ul);
			
			sectionsDiv.appendChild(panel);
		});
	});
}

function importData(){
	let input = document.createElement('input');
	input.type = "file";
	input.accept = ".json";
	input.click();
	input.addEventListener('change', (evt)=>{
		input.files[0].text().then(res=>{
			let data = JSON.parse(res);
			chrome.storage.sync.set(data, function(){
				render();
			});
		});
	});
}

function exportData(){
	chrome.permissions.request({
		permissions: ['downloads']
	}, (granted) => {
		console.log(granted);
	});
	chrome.storage.sync.get(null, items => {
		let result = JSON.stringify(items);

		let url = 'data:application/json;base64,' + btoa(result);
		let now = new Date();

		chrome.downloads.download({
			url: url,
			filename: [now.getFullYear(), now.getMonth(), now.getDate()].join('-') + "-simple_new_tab_config.json"
		});
	});
}

function clearStorage(){
	chrome.storage.sync.clear(function(){
		console.log('clear');
	});
};

(function(){
//	setTestData();
	render();
})();
