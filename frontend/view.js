window.onload = function showStats() {
	const url = 'http://192.168.56.101:3000/results';
	fetch(url, {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
		}
	})
	.then(res => res.json())
	.then(response => {
		stats = {
			"q1": [],
			"q2": [],
			"q3": [],
			"q4": [],
			"suggestion": []
		};
		const keys = Object.keys(response[0]);
		console.log(keys);
		console.log(response);
		console.log(response[0]);
		for (let i = 0; i < response.length; i++) {
			for (let k of keys) {
				stats[k].push(response[i][k]);
			}
		}
		console.log(stats);
		let newList = document.createElement("ol");
		for (let i = 0; i < stats["suggestion"].length; i++) {
			if (stats["suggestion"][i] !== null && stats["suggestion"][i] !== "") {
				let listElem = document.createElement("li");
				listElem.innerHTML = stats["suggestion"][i];
				newList.appendChild(listElem);
			}
		}
		document.getElementById('q1').innerHTML = getAverage(stats["q1"]);
		document.getElementById('q2').innerHTML = getAverage(stats["q2"]);
		document.getElementById('q3').innerHTML = getAverage(stats["q3"]);
		document.getElementById('q4').innerHTML = getAverage(stats["q4"]);
		document.getElementById('show_suggestions').appendChild(newList);
	})
}

function getAverage(arr) {
	var sum = 0;
	var len = arr.length;
	console.log(len);
	for (let i = 0; i < len; i++) {
		sum = sum + Number(arr[i]);
	}
	return (sum/len).toFixed(1);
}
