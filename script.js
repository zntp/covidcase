const app = document.getElementById('covid-container');

var request = new XMLHttpRequest();
request.open('GET', 'https://coronavirus-ph-api.now.sh/cases', true);

request.onload = function () {

    var data = JSON.parse(this.response);
    console.log(data);
    if (request.status >= 200 && request.status < 400) {

        let totalMale = 0;
        let totalFemale = 0;

        for (let i = 0, len = data.length; i < len; i++) {
                currentData = data[i];
                const card = document.createElement('div');
                card.setAttribute('class', 'covid-cards');

                const h3 = document.createElement('h3');
                h3.textContent = "Case #" + currentData.case_no;

                const date = document.createElement('p');
                date.textContent = "Date: " + currentData.date;

                const age = document.createElement('p');
                age.textContent = "Age: " + currentData.age;

                const gender = document.createElement('p');
                if (currentData.gender === 'Male') {
                    totalMale++;
                } else {
                    totalFemale++;
                }
                gender.textContent = "Gender: " + currentData.gender;

                const nationality = document.createElement('p');
                nationality.textContent = "Nationality: " + currentData.nationality;

                const hospital = document.createElement('p');
                hospital.textContent = "Hospital Admitted To: " + currentData.hospital_admitted_to;

                const history = document.createElement('p');
                history.textContent = "Travel History Abroad: " + currentData.had_recent_travel_history_abroad;

                const status = document.createElement('p');
                if (currentData.status === 'Recovered'){
                    status.setAttribute('class', 'text-green large');
                } else if (currentData.status === 'Admitted') {
                    status.setAttribute('class', 'text-orange large');
                } else {
                    status.setAttribute('class', 'text-red large');
                }
                status.textContent = "Status: " + currentData.status;

                const notes = document.createElement('p');
                notes.setAttribute('class', 'covid-note');
                notes.textContent = "Notes: " + currentData.notes;
                
                card.appendChild(h3);
                card.appendChild(date);
                card.appendChild(age);
                card.appendChild(gender);
                card.appendChild(nationality);
                card.appendChild(hospital);
                card.appendChild(history);
                card.appendChild(status);
                card.appendChild(notes);
                app.appendChild(card);
        }
        totalMaleContainer = document.getElementById('total-male');
        totalFemaleContainer = document.getElementById('total-female');
        totalMaleContainer.textContent = totalMale;
        totalFemaleContainer.textContent = totalFemale;
    } else {
        const error = document.createElement('section');
        error.setAttribute('class', 'error-message');
        error.textContent = 'ERROR! Please try again later';
        app.appendChild(error);
    }
}

request.send();