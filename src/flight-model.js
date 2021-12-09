import * as ko from 'knockout';

function FlightListViewModel() {
    function Month(data) {
        this.month = ko.observable(data.display);
        this.sort = data.month;
        var mappedFlights = $.map(data.flights, f => new Flight(f));
        this.flights = ko.observableArray(mappedFlights);
        this.getActive = () => {
            var params = new URLSearchParams(window.location.search);
            if (params.has("flight")) {
                var flight = this.flights().find(f => f.id().toLowerCase() == params.get("flight").toLowerCase());
                if (flight) {
                    console.log("Active month:", this.month());
                    return "active";
                }
            }
            return "";
        };
        this.url = () => "";
    }
    function Flight(data) {
        this.id = ko.observable(data['flight-id']);
        this.link = `#${data['flight-id']}`;
        this.name = ko.observable(data.name);
        this.description = ko.observable(data.description);
        this.url = ko.observable(data.url);
        this.dataFile = ko.observable(data.dataFile);
        this.pdf = ko.observable(data.pdf);
        this.drams = ko.observableArray([]);
        this.cssClass = ko.observable("");
        this.setActive = function () {
            this.cssClass("active");
            $.getJSON(this.dataFile(), flightData => {
                var mappedDrams = $.map(flightData, d => new Dram(d));
                this.drams(mappedDrams);
            });
            /*
            var params = new URLSearchParams(window.location.search);
            if (params.has("flight")) {
                if (params.get("flight") == this.id()) {
                    console.log(params.get("flight") + " is active");
                    return "active";
                }
            }
            */
            return "";
        }
    }
    function Dram(data) {
        this.name = ko.observable(data.name);
        this.description = ko.observable(data.description);
        this.tastingNotes = ko.observable(data.tastingNotes);
        this.proof = ko.observable(data.proof);
        this.url = ko.observable(data.url);
        this.age = ko.observable(data.age);
        this.distillery = ko.observable(data.distillery);
        this.location = ko.observable(data.location);
        this.msrp = ko.observable(data.msrp);
        this.mashbill = ko.observable(data.mashbill);
        this.image = ko.observable(data.image);
    }

    var self = this;
    // Load initial state from server, convert it to Task instances, then populate self.tasks
    /*
    $.getJSON("flights.json", function (allData) {
        var mappedMonths = $.map(allData, m => new Month(m));
        self.months(mappedMonths);
        self.setActiveFlight();
    });
    */
    this.SetData = function (flightData) {
        var mappedMonths = $.map(flightData, m => new Month(m));
        var sorted = mappedMonths.sort((a, b) => b.sort.localeCompare(a.sort));
        self.months(sorted);
        if (sorted.length > 0) {
            var params = new URLSearchParams(window.location.search);
            if (params.has("flight") && self.months()) {
                self.months().forEach(m => {
                    var flight = m.flights().find(f => f.id().toLowerCase() == params.get("flight").toLowerCase());
                    if (flight) {
                        this.setActiveFlight(flight);
                    }
                });
                console.log("Active flight: ", self.activeFlight().name());
            } else {
                var firstMonth = sorted[0];
                if (firstMonth.flights().length > 0) {
                    this.setActiveFlight(firstMonth.flights()[0]);
                }
            }
        }
    }
    this.setActiveFlight = function () { console.log("WTF"); }
    this.setActiveFlight = function (flight) {
        console.log(flight);
        if (self.activeFlight()) {
            self.activeFlight().cssClass("");
        }
        flight.setActive();
        self.activeFlight(flight);
        console.log("Active flight: ", self.activeFlight().name());
        if (flight.url()) {
            var url = `${flight.url()}`;
            console.log("Flight URL", url);
            window.history.pushState({}, '', url);
        }
    }
    self.months = ko.observableArray([]);
    self.activeFlight = ko.observable();
    let flight = new Flight({ name: ko.observable("Select a flight") });
    self.setActiveFlight(flight);

}

export { FlightListViewModel };