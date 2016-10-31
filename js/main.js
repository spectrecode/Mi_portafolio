// menu fixed 

$(document).ready(function () {
    $(".botonCollapse").click(function () {
        $(".collapse").fadeToggle(500);
        // $(".top-menu").toggleClass("top-animate");
        // $(".mid-menu").toggleClass("mid-animate");
        // $(".bottom-menu").toggleClass("bottom-animate");
    });

    $("li.voce-menu a").click(function () {
        $(".collapse").fadeToggle(500);
        // $(".top-menu").fadeToggle("top-animate");
    //     // $(".mid-menu").toggleClass("mid-animate");
    //     // $(".bottom-menu").toggleClass("bottom-animate");
    });
});

// slider section

$(document).ready(function(){
    $("#first").click(function(){
        $("#pt").slideUp(1000);
    });
})

$(document).ready(function(){
    $("#second").click(function(){
        $(".primerSlid").slideUp(800);
    });
})

$(document).ready(function(){
    $("#thirt").click(function(){
        $(".segundoSlid").slideUp(1200);
    });
})

$(document).ready(function(){
    $("#forth").click(function(){
        $(".tercerSlid").slideUp(1200);
    });
})

// hover iconos gatos

// $(document).ready(function(){
//     var height = $("#sectionFirst").height(),
//     scrollTop = $("#sectionFirst").scrollTop(),
//     $("#sectionFirst").load(function(){
//        if height == scrollTop {
//         $(".cajaCanvas").addClass("hoverAuto");
//         } 
//     })   
// });


// $(".cajaCanvas").addClass("hoverAuto");

// $(document).ready(function(){
//     $(".cajaCanvas").mouseover(function(){
//         $(".cajaCanvas").css("color", "white");
//     });
//     $(".cajaCanvas").mouseout(function(){
//         $(".cajaCanvas").css("color", "transparent");
//     });
// });

// slider column about me

$(document).ready(function(){
    $("#second").click(function(){
        $(".colIzq").animate({
            bottom: '340px', 
            opacity: "1"
        }, 1200);
    });
});

$(document).ready(function(){
    $("#second").click(function(){
        $(".colDer").animate({
            top: '280px', 
            opacity: "1"
        }, 1200);
    });
});