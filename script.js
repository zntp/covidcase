const app = document.getElementById('covid-container');
const otherContainer = document.getElementById('other-container');
const testContainer = document.getElementById('test-container');
const checkpointContainer = document.getElementById('checkpoint-container');
const apiUrl = 'https://coronavirus-ph-api.now.sh/';
const method = "GET";
let mainEndpoint = 'cases';
let endpointList = ['cases-outside-ph', 'test-results', 'patients-under-investigation', 'mm-checkpoints'];

var request = new XMLHttpRequest();
request.open(method, apiUrl+mainEndpoint, true);

request.onload = function () {
    
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {

        let totalCases = data.length;
        let totalMale = 0;
        let totalFemale = 0;
        let caseRecovered = 0;
        let caseAdmitted = 0;
        let caseDied = 0;
        let mortality;
        let month = undefined;

        for (let i = 0, len = data.length; i < len; i++) {
                currentData = data[i];                

                const card = document.createElement('div');
                card.setAttribute('class', 'covid-cards');

                const cardPad = document.createElement('div');
                cardPad.setAttribute('class', 'covid-cards-pad');

                const h3 = document.createElement('h3');
                h3.textContent = "Case #" + currentData.case_no;

                const date = document.createElement('p');
                var caseDate = new Date(currentData.date);
                date.textContent = "Date: " + caseDate.toDateString();            
                month = caseDate.toDateString().split(" ");
                currentMonth = month[1].toLowerCase();
                card.classList.add(currentMonth);
                
                const age = document.createElement('p');
                age.textContent = "Age: " + currentData.age;

                const gender = document.createElement('p');
                if (currentData.gender === 'M') {
                    card.classList.add('male');
                    totalMale++;
                } else {
                    card.classList.add('female');
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
                    card.classList.add('recovered');
                    h3.classList.add('text-green');
                    caseRecovered++;
                } else if (currentData.status === 'Admitted') {
                    status.setAttribute('class', 'text-orange large');
                    card.classList.add('admitted');
                    h3.classList.add('text-orange');
                    caseAdmitted++;
                } else {
                    status.setAttribute('class', 'text-red large');
                    card.classList.add('died');
                    h3.classList.add('text-red');
                    caseDied++
                }
                status.textContent = "Status: " + currentData.status;

                const notes = document.createElement('p');
                notes.setAttribute('class', 'covid-note');
                notes.textContent = "Notes: " + currentData.other_information;
                
                card.appendChild(cardPad);
                cardPad.appendChild(h3);
                cardPad.appendChild(date);
                cardPad.appendChild(age);
                cardPad.appendChild(gender);
                cardPad.appendChild(nationality);
                cardPad.appendChild(hospital);
                cardPad.appendChild(history);
                cardPad.appendChild(status);
                cardPad.appendChild(notes);
                app.appendChild(card);
        }

        document.getElementById('case-total').textContent = totalCases;

        totalMaleContainer = document.getElementById('total-male');
        totalFemaleContainer = document.getElementById('total-female');
        totalMaleContainer.textContent = totalMale;
        totalFemaleContainer.textContent = totalFemale;

        totalCaseRecovered = document.getElementById('case-recovered');
        totalCaseAdmitted = document.getElementById('case-admitted');
        totalCaseDied = document.getElementById('case-died');
        totalCaseRecovered.textContent = caseRecovered;
        totalCaseAdmitted.textContent = caseAdmitted;
        totalCaseDied.textContent = caseDied;

        mortality = document.getElementById('mortality-rate')
        mortality.textContent = ((caseDied/totalCases)*100).toFixed(2);



        
        function covidTime(){
            let date = new Date();
            document.getElementById('current-date').innerHTML = date;
        }
        setInterval(covidTime, 1000);


        /*
        * Sorting of Covid cases cards
        */
        var $container = $('.covid-container').isotope({
            itemSelector: '.covid-cards'
        });
        
        var filters = {};
        
        $('.filters').on( 'click', 'a', function( event ) {
            var $button = $( event.currentTarget );
            // get group key
            var $buttonGroup = $button.parents('.covid-filter');
            var filterGroup = $buttonGroup.attr('data-filter-group');
            // set filter for group
            filters[ filterGroup ] = $button.attr('data-filter');
            // combine filters
            var filterValue = concatValues( filters );
            // set filter for Isotope
            $container.isotope({ filter: filterValue });
        });
        
        // change current class on buttons
        $('.covid-filter').each( function( i, buttonGroup ) {
            var $buttonGroup = $( buttonGroup );
            $buttonGroup.on( 'click', 'a', function( event ) {
            $buttonGroup.find('.current').removeClass('current');
            var $button = $( event.currentTarget );
            $button.addClass('current');
            });
        });
            
        // flatten object by concatting values
        function concatValues( obj ) {
            var value = '';
            for ( var prop in obj ) {
            value += obj[ prop ];
            }
            return value;
        }

    } else {
        const error = document.createElement('section');
        error.setAttribute('class', 'error-message');
        error.textContent = 'ERROR! Please try again later';
        app.appendChild(error);
    }
}
request.send();



/**
 * FETCH REMAINING API
 * cases outside PH, suspected cases, PUI, checkpoints
 */

newRequest = new Array(endpointList.length);

for(let c = 0; c < endpointList.length; c++) {

    let newData = [];
    newRequest[c] = new XMLHttpRequest();
    newRequest[c].open(method, apiUrl + endpointList[c], true);
    newRequest[c].onload = function() {

        newData = JSON.parse(this.response);
        console.log(c);

        if (newRequest[c].status >= 200 && newRequest[c].status < 400) {

            if(c === 0) {
                for (let j = 0, len = newData.length; j < len; j++) { 

                    let currentD0 = newData[j];
                    
                    const casesOutside = document.createElement('div');
                    casesOutside.setAttribute('class', 'cases-outside');

                    const casesOutsideTitle = document.createElement('h3');
                    casesOutsideTitle.textContent = currentD0.country_territory_place;

                    const casesOutsideData = document.createElement('p');
                    casesOutsideData.textContent = "Confirmed:" + currentD0.confirmed + " | Recovered:" + currentD0.recovered + " | Died:" + currentD0.died;
                    

                    casesOutside.appendChild(casesOutsideTitle);
                    casesOutside.appendChild(casesOutsideData);
                    otherContainer.appendChild(casesOutside);
                }
            } else if (c === 1) {                
                let currentD1 = newData;
                
                const confirmedCasesContainer = document.createElement('div');
                confirmedCasesContainer.setAttribute('class', 'confirmed-cases');

                const confirmedCases = document.createElement('p');
                confirmedCases.textContent = "Confirmed Cases: " + currentD1.confirmed_cases;

                const testedNegative = document.createElement('p');
                testedNegative.textContent = "Cases Tested Negative: " + currentD1.cases_tested_negative;

                const pendingResult = document.createElement('p');
                pendingResult.textContent = "Pending Test Results: " + currentD1.cases_pending_test_results;                    

                confirmedCasesContainer.appendChild(confirmedCases);
                confirmedCasesContainer.appendChild(testedNegative);
                confirmedCasesContainer.appendChild(pendingResult);
                testContainer.appendChild(confirmedCasesContainer);                
            }  else if (c === 2) {                
                /*
                 * waiting for endpoint
                */
            } else {
                /*
                 * Hiding result temporarily
                 *
                for (let m = 0, len = newData.length; m < len; m++) {
                    let currentD3 = newData[m];

                    const checkPoint = document.createElement('div');
                    checkPoint.setAttribute('class', 'checkpoint-container');

                    const checkpointCity = document.createElement('p');
                    checkpointCity.textContent = "City: " + currentD3.city;

                    const checkpointLocation = document.createElement('p');
                    checkpointLocation.textContent = "Location: " + currentD3.location;

                    const checkpointDescription = document.createElement('p');
                    checkpointDescription.textContent = "Description: " + currentD3.checkpointDescription;

                    checkPoint.appendChild(checkpointCity);
                    checkPoint.appendChild(checkpointLocation);
                    checkpointContainer.appendChild(checkPoint);
                }
                */
            }            
        } else {
            const error = document.createElement('section');
            error.setAttribute('class', 'error-message');
            error.textContent = 'ERROR! Please try again later';
            app.appendChild(error);
        }
    }
    newRequest[c].send();
}

/**
 * PANELS
 * selectors for right panel
 */
let generalPanel = document.querySelector('.data-container__general');
let otherPanel = document.querySelector('.data-container__other');
let checkpointPanel = document.querySelector('.data-container__checkpoint');

/**
 * EVENTS
 * event buttons
 */
let buttons = document.querySelectorAll('.grid-container__card');
let generalButton = document.querySelector('.grid-container__card-general');
let otherButton = document.querySelector('.grid-container__card-other');
let checkpointButton = document.querySelector('.grid-container__card-checkpoint');

/**
 * Active panel
 */
let activePanel = document.querySelector('.data-container');
let dataCase;

for (var i=0; i < buttons.length; i++) {
    buttons[i].onclick = function(){
        activePanelSelector = activePanel.querySelector('.active');
        activePanelSelector.classList.remove('active');
        dataCase = this.dataset.case;
        if(dataCase == 'other') {            
            otherPanel.classList.add('active');            
        } else if (dataCase == 'checkpoint') {
            checkpointPanel.classList.add('active');
        } else {
            generalPanel.classList.add('active');
        }
    }
}


/**
 * i don't know why i used jQuery here LOL, i'll update this soon
 */
jQuery(document).ready(function(){
    jQuery(document).on("click", ".covid-cards", function(){
        jQuery(".covid-cards.clicked").removeClass('clicked');
        jQuery(this).addClass('clicked');
    });
    jQuery(document).on("click", ".covid-cards.clicked", function(){
        jQuery(this).removeClass('clicked');
    });    
});