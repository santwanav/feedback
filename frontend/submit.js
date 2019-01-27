function sendForm() {
	const form = document.querySelector("form");
	const data = new FormData(form);
	const url = 'http://192.168.56.101:3000/'
	payload = {};
	const length = Array.from(data.keys()).length;
	if (!validate(data))
		return;
	for (const d of data) {
		if (d[0] === 'suggestion') 
			payload[d[0]] = d[1]
		else 
			payload[d[0]] = Number(d[1])
	}
	fetch(url, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-type': 'application/json',
		}
	}).then(res => {
		const statuscode = res.status;
		if (statuscode >= 200 && statuscode < 300) {
			document.getElementById("feedback-form").reset();
		}
		else {
			res.json()
			.then(render);
		}
	})
	.catch(error => console.log('Error:', error));
}

function validate(data) {
	const length = Array.from(data.keys()).length;
	response = {}
	for (const dat of data) {
		response[dat[0]] = dat[1];
	}
	errors = []
	for (let i = 1; i < 5; i++) {
		if (response["q"+i] === undefined || response["q"+i] > 5 || response["q"+i] < 1) {
			errors.push("Question "+i+" has to be between 1 and 5");
		}
	}
	if (response["suggestion"].length > 500) {
		errors.push("The maximum length allowed is 500");
	}
	render(errors);
	return !(errors.length>0);
}

function render(errors) {
	document.getElementById("error-list").innerHTML = "";
	document.getElementById("error").classList.remove("error-visible");
	for (let err of errors) {
		let list_elem = document.createElement("li");
		list_elem.innerText = err;
		document.getElementById("error-list").appendChild(list_elem);
	}
	if (errors.length > 0) {
		document.getElementById("error").classList.add("error-visible");
	}
}
