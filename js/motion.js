$(document).ready(function () {
//CHANGE ONCLICK TO WHATEVER
    $("#settingsBtn").click(function () {

            //SET TEST CSS VALUES
            $("#totalDataPlanCurrent").text(totalVal+" "+selectedOp+"  per day");
            $(".mypanel").css("background-color", "#cccccc");
            $(".mypanel").css("border-radius", "5vw 5vw 0 0");
            $(".mypanel").css("width", "90vw");
            $(".mypanel").css("right", "5vw")
            $(".mypanel").css("top", "3vh");
            $(".settings").fadeIn(20);
            $(".settings").css("box-shadow", "0px -3px 37px 0px rgba(0,0,0,0.75);");
            $(".settings").css("top", "5vh");
            $(".settings").css("display", "flex");
            $("#bodyId").css("overflow", "hidden");






    });
    $("#settingDoneBtn").click(function () {

        //SET TEST CSS VALUES

        $(".settings").css("top", "100vh");
        $(".settings").css("box-shadow","none");
        $(".settings").fadeOut(1000);
        $(".mypanel").css("background-color", "white");
        $(".mypanel").css("border-radius", "0 0 0 0");
        $(".mypanel").css("width", "100vw");
        $(".mypanel").css("right", "0vw")
        $(".mypanel").css("top", "0vh");
        $("#bodyId").css("overflow", "auto");




    });



});


