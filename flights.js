function FlightListViewModel() {
    function Flight(data) {
        this.name = ko.observable(data.name);
        this.description = ko.observable(data.description);
        this.url = ko.observable(data.url);
        var mappedDrams = $.map(data.drams, d => new Dram(d));
        this.drams = ko.observableArray(mappedDrams);
        this.getActive = function () {
            var params = new URLSearchParams(window.location.search);
            if (params.has("flight")) {
                if (params.get("flight") == this.name()) {
                    console.log(params.get("flight") + " is active");
                    return "active";
                }
            }
            return "";
        }
    }
    function Dram(data) {
        this.name = ko.observable(data.name);
        this.description = ko.observable(data.description);
        this.notes = ko.observable(data.notes);
        this.proof = ko.observable(data.proof);
        this.url = ko.observable(data.url);
        this.age = ko.observable(data.age);
        this.distillery = ko.observable(data.distillery);
        this.location = ko.observable(data.location);
        this.msrp = ko.observable(data.msrp);
        this.mashbill = ko.observable(data.mashbill);
        this.image = ko.observable(data.image);
        console.log(this.image());
    }
    var self = this;
    self.flights = ko.observableArray([]);
    self.activeFlight = ko.observable(new Flight({ name: ko.observable("Select a flight") }));

    // Load initial state from server, convert it to Task instances, then populate self.tasks
    $.getJSON("flights.json", function (allData) {
        var mappedFlights = $.map(allData, function (item) { return new Flight(item) });
        self.flights(mappedFlights);
        self.setActiveFlight();
    });

    self.setActiveFlight = function () {
        var params = new URLSearchParams(window.location.search);
        if (params.has("flight") && self.flights()) {
            self.activeFlight(self.flights().find(f => f.name().toLowerCase() == params.get("flight").toLowerCase()));
            console.log("Active flight: ", self.activeFlight().name());
        }
    }
}

$(document).ready(function () {
    ko.applyBindings(new FlightListViewModel());
});
