let allStudents = [];

function buildStudents(studs) {
	for (const s of studs){
		const div = document.createElement("div");
		div.className = "col-12 col-md-6 col-lg-4 col-xl-3";
		const parent = document.getElementById("students"); 
		parent.appendChild(div);
		// first + last name
		const name = document.createElement("h2");
		
		// Name
		div.appendChild(name);
		name.textContent = `${s.name.first} ${s.name.last}`;
		// Major
		const major = document.createElement("h5");
		div.appendChild(major);
		major.textContent = `${s.major}`;
		// number of credits
		const body = document.createElement("body");
		div.appendChild(body);
		const credits = document.createElement("p");
		body.appendChild(credits);
		if (s.fromWisconsin){
			credits.textContent = `${s.name.first} is taking ${s.numCredits} credits and is from Wisconsin.`;
		} else {
			credits.textContent = `${s.name.first} is taking ${s.numCredits} credits and is not from Wisconsin.`;
		}

		let interestCount = s.interests.length;
		const interestHeader = document.createElement("p");
		interestHeader.textContent = `They have ${interestCount} interests including...`

		body.appendChild(interestHeader);

		const interests = document.createElement("ul"); 
		body.appendChild(interests);
		for (const interestStr of s.interests) {
			const interest = document.createElement("li");
			interest.textContent = interestStr;
			interest.addEventListener("click", (e) => {
				document.getElementById("search-interest").value = e.target.innerText;
				document.getElementById("search-name").value = "";
				document.getElementById("search-major").value = "";
				handleSearch(); 
			});
		interests.appendChild(interest);
		}
	}
}

function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	const nameTerm = document.getElementById("search-name").value.trim().toLowerCase();
	const majorTerm = document.getElementById("search-major").value.trim().toLowerCase();
	const interestTerm = document.getElementById("search-interest").value.trim().toLowerCase();

	const results = allStudents.filter(s => {
		const fullName = `${s.name.first} ${s.name.last}`.toLowerCase();
		const major = (s.major ?? "").toLowerCase();
		const interests = (s.interests ?? []).map(i => i.toLowerCase());

		const matchesName = nameTerm === "" || fullName.includes(nameTerm);
		const matchesMajor = majorTerm === "" || major.includes(majorTerm);
		const matchesInterest =
		interestTerm === "" || interests.some(i => i.includes(interestTerm));

		return matchesName && matchesMajor && matchesInterest; 
  	});
  
  document.getElementById("students").innerHTML = "";
  document.getElementById("num-results").textContent = `${results.length}`;
  buildStudents(results);
}


fetch('https://cs571api.cs.wisc.edu/rest/s26/hw2/students', {
    headers: {
        // The API requires a BadgerID header for authentication
        "X-CS571-ID": CS571.getBadgerId()
    }
})
.then(res => {
    // res is the "Response" object from fetch (status code, headers, etc.)
    console.log(res.status);

    // Only parse JSON if status is OK (200). Otherwise treat it as an error.
    if(res.status === 200) {
        return res.json(); // res.json() reads the response body and converts it to a JS object
    } else {
        // Throwing causes execution to jump to .catch(...) below
        throw new Error();
    }
})
.then(data => {
	console.log(data);
	const studs = Array.isArray(data) ? data : (data.students ?? []);
	document.getElementById("num-results").textContent = `${studs.length}`;
	buildStudents(studs);
	allStudents = studs;
})
.catch(err => {
  console.error(err);
  document.getElementById("num-results").textContent = "0 students";
});

document.getElementById("search-btn").addEventListener("click", handleSearch);