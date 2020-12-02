function FlightListViewModel() {
    function Month(data) {
        this.month = ko.observable(data.month);
        var mappedFlights = $.map(data.flights, f => new Flight(f));
        this.flights = ko.observableArray(mappedFlights);
        this.getActive = () => {
            var params = new URLSearchParams(window.location.search);
            if (params.has("flight")) {
                var flight = this.flights().find(f => f.name().toLowerCase() == params.get("flight").toLowerCase());
                if (flight) {
                    console.log("Active month:", this.month());
                    return "active";
                }
            }
            return "";            
        };
        this.expanded = () => {
            if(this.getActive() == "active") return "true";
            return "false";
        };
        this.url = () => "";
    }
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
    //self.flights = ko.observableArray([]);
    self.months = ko.observableArray([]);
    self.activeFlight = ko.observable(new Flight({ name: ko.observable("Select a flight") }));

    // Load initial state from server, convert it to Task instances, then populate self.tasks
    $.getJSON("flights.json", function (allData) {
        var mappedMonths = $.map(allData, m => new Month(m));
        self.months(mappedMonths);
        self.setActiveFlight();
    });

    self.setActiveFlight = function () {
        var params = new URLSearchParams(window.location.search);
        if (params.has("flight") && self.months()) {
            self.months().forEach(m => {
                var flight = m.flights().find(f => f.name().toLowerCase() == params.get("flight").toLowerCase());
                if(flight){
                    self.activeFlight(flight);
                }
            });
            console.log("Active flight: ", self.activeFlight().name());
        }
    }
}

$(document).ready(function () {
    ko.applyBindings(new FlightListViewModel());
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});