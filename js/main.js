var usageLiteral = ""; //Variable for storing Data Usage in Literal Format
var usage = 0;
var flagUnit = "KB";
var totalVal = 0;
var selectedOp = "KB";
var counterVal = 1000;

//Database Functions
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}
var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
    read();
    add();
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    //Table Creation
    var objectStore = db.createObjectStore("OpenFlag", {keyPath: "id"});
    var objectStore1 = db.createObjectStore("MaxDataValue", {keyPath: "id"});
};

function add() {
    let request1 = db.transaction("OpenFlag", "readwrite").objectStore("OpenFlag").add({id: 1, value: 1});
    let request2 = db.transaction(["MaxDataValue"], "readwrite").objectStore("MaxDataValue").add({
        id: 1,
        num: totalVal,
        unit: selectedOp
    });
    request2.onerror = function (event) {

    }
}

function addMaxValue() {
    let request2 = db.transaction("MaxDataValue", "readwrite").objectStore("MaxDataValue").add({
        id: 1,
        num: totalVal,
        unit: selectedOp
    });
    request2.onerror = function (event) {

        let request3 = db.transaction("MaxDataValue", "readwrite").objectStore("MaxDataValue").delete(1);
        let request4 = db.transaction("MaxDataValue", "readwrite").objectStore("MaxDataValue").add({
            id: 1,
            num: totalVal,
            unit: selectedOp
        });
    };
    $(document).ready(function () {
    $("#totalDataPlanCurrent").text(totalVal+" "+selectedOp+"  per day")});

}

function read() {
    var transaction = db.transaction(["MaxDataValue"]);
    var objectStore = transaction.objectStore("MaxDataValue");
    var request = objectStore.get(1);
    request.onerror = function (event) {
        addMaxValue();
    };

    request.onsuccess = function (event) {
        try {
            totalVal = request.result.num;
            selectedOp = request.result.unit;
        } catch (err) {
            if ((totalVal == 0) && (selectedOp == "KB")) {
                $(".formInitial").css("display", "block");
                $(".overlay").fadeIn(1000);
            }
        }
        if ((totalVal == 0) && (selectedOp == "KB")) {
            $(".formInitial").css("display", "block");
            $(".overlay").fadeIn(1000);
        }
        if (request.result.num === undefined) {
            addMaxValue();
        }
    };


}

// Database Functions END HERE


$(document).ready(function () {
    setInterval(fetchdata, 2000);

        function fetchdata() {
            $.ajax({
                //Replace the JSON url with : http://172.30.110.25:8090/ssssportal/fetchUserQuotaPM.do
                url: 'http://172.30.110.25:8090/ssssportal/fetchUserQuotaPM.do',
                type: 'post',
                datatype : "json",
                mtype : 'POST',
                success: function (response) {
                    // Perform operation on the return value
                    //Replace the JSON url with : http://172.30.110.25:8090/ssssportal/fetchUserQuotaPM.do
                    $.getJSON('http://172.30.110.25:8090/ssssportal/fetchUserQuotaPM.do', function (data) {

                        usageLiteral = data.rows[0].dailyUsedOctets;
                        console.log("Pulled Usage = " + usageLiteral);
                        $('#serviceStatus').text("Status : " + data.rows[0].serviceStatus);
                        $('#totalDownload').text("Total Downloaded : " + data.rows[0].downloadOctets);
                        $('#totalUpload').text("Total Uploaded : " + data.rows[0].uploadOctets);
                        $('#totalDataUsage').text("Total Data Usage : " + data.rows[0].totalOctets);
                        $('#serviceType').text("Service Type : " + data.rows[0].serviceType);


                    });

                    //console.log(response);
                    //$(".mypanel").text(usageLiteral);
                    //var usage = usageLiteral.slice(0,(usageLiteral.length)-3);
                    usage = parseFloat(usageLiteral);
                    //console.log("Numerical Value of Data Usage is :" + "##" + usage + "##");
                    //usage is the numerical value for Data Usage
                    var posKB = usageLiteral.indexOf("KB");
                    var posMB = usageLiteral.indexOf("MB");
                    var posGB = usageLiteral.indexOf("GB");
                    var posTB = usageLiteral.indexOf("TB");
                    flagUnit = "KB";
                    if (posKB == -1) {
                        flagUnit = "MB";
                        if (posMB == -1) {
                            flagUnit = "GB";
                            if (posGB == -1) {
                                flagUnit = "TB";
                            }
                        }
                    }
                    //console.log("The Data unit is in : " + flagUnit);
                    var finalResult = computePercentage(usage, flagUnit);
                    if ((isNaN(finalResult)) || (finalResult == Infinity)) {
                        finalResult = 0;
                    }
                    if (navigator.onLine == true) {

                        $("#connectStatus").css("color", "#32cd32");
                        $("#connectStatus").text("CONNECTED");
                    } else {

                        $("#connectStatus").css("color", "#b22222");
                        $("#connectStatus").text("DISCONNECTED");
                    }
                    console.log("Percentage Use: " + finalResult);
                    execCircleBar(finalResult);

                } // Response (SYNC CODE) Code Ends HERE
            });
        }

    function execCircleBar (inpValue)
    {
        //PERCENT VAR TO BE LINKED
        var val = parseInt(inpValue);
        var $circle = $('#svg #bar');
        if (isNaN(val)) {
            val = 100;
        } else {
            var r = $circle.attr('r');
            var c = Math.PI * (r * 2);

            if (val < 0) {
                val = 0;
            }
            if (val > 100) {
                val = 100;
            }

            var pct = ((100 - val) / 100) * c;

            $circle.css({strokeDashoffset: pct});
            $('#cont').attr('data-pct', val);
            $('.panelDataShow').text(usageLiteral);
            colorChanger(val);
        }
    }
    function colorChanger(val){
        //RED 1- 20
        if( (val >= 1) && (val <= 20)){
            document.getElementById("gradientPanel").style.backgroundImage="linear-gradient(to bottom right, #0470dc, #13f1fc)";
        }
        //ORANGE 21 - 40
        if( (val >= 21) && (val <= 40)){
            document.getElementById("gradientPanel").style.backgroundImage="linear-gradient(to bottom right, #DFEC51, #73AA0A)";
        }
        //YELLOW 41 - 60
        if( (val >= 41) && (val <= 60)){
            document.getElementById("gradientPanel").style.backgroundImage="linear-gradient(to bottom right, #fad961, #f76b1c)";
        }
        //GREEN 61 - 80
        if( (val >= 61) && (val <= 80)){
            document.getElementById("gradientPanel").style.backgroundImage="linear-gradient(to bottom right, #f2d50f, #da0641)";
        }
        //BLUE 81 - 100
        if( (val >= 81) && (val <= 100)){
            document.getElementById("gradientPanel").style.backgroundImage="linear-gradient(to bottom right, #F5515F, #A1051D)";
        }


    }




});

function computePercentage(value, unit) {
    var percent = (value / totalVal) * 100;
    if (unit == "KB") {
        if (selectedOp == "KB") {
            percent = 1 * percent;
        }
        if (selectedOp == "MB") {
            percent = 0.001 * percent;
        }
        if (selectedOp == "GB") {
            percent = 0.000001 * percent;
        }
        if (selectedOp == "TB") {
            percent = 0.000000001 * percent;
        }
    }
    if (unit == "MB") {
        if (selectedOp == "KB") {
            percent = 1000 * percent;
        }
        if (selectedOp == "MB") {
            percent = 1 * percent;
        }
        if (selectedOp == "GB") {
            percent = 0.001 * percent;
        }
        if (selectedOp == "TB") {
            percent = 0.000001 * percent;
        }

    }
    if (unit == "GB") {
        if (selectedOp == "KB") {
            percent = 1000000 * percent;
        }
        if (selectedOp == "MB") {
            percent = 1000 * percent;
        }
        if (selectedOp == "GB") {
            percent = 1 * percent;
        }
        if (selectedOp == "TB") {
            percent = 0.001 * percent;
        }

    }
    if (unit == "TB") {
        if (selectedOp == "KB") {
            percent = 1000000000 * percent;
        }
        if (selectedOp == "MB") {
            percent = 1000000 * percent;
        }
        if (selectedOp == "GB") {
            percent = 1000 * percent;
        }
        if (selectedOp == "TB") {
            percent = 1 * percent;
        }

    }
    return Math.round(percent);
}




