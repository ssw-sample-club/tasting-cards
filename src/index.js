import { getData } from './flights-data';
import * as ko from 'knockout';
import { FlightListViewModel } from './flight-model';

const flightList = new FlightListViewModel();

function SetFlight(flightId) {
    flightList.setActiveFlight(flightId);
}

$(document).ready(async function () {
    var params = new URLSearchParams(window.location.search);

    if (params.has("flight")) {
        var flight = params.get("flight");
        console.log(flight);
        document.title = params.get("flight");
    }
    ko.applyBindings(flightList);
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    var payload = {
        "operation": "list",
        "tableName": "flight-month",
        "payload": {}
    };

    var allData = await getData(payload);
    flightList.SetData(allData);

    $('#testButton').on('click', async function () {
        var allData = await getData(payload);
        flightList.SetData(allData);
    });
});
