window.addEventListener("load", function(){
		
	function efectoSlider(){
		var intro = document.getElementById("pt");
		var firstBoton = document.getElementById("first");
		firstBoton.addEventListener("click", function(){
			this.parentElement.parentElement.classList.add("fadeFirst");
		});
	}
	efectoSlider();

	// function secondSection(){
	// 	var segundoSlid = document.getElementsByClassName("segundoSlid")[0];
	// 	var secondBoton = document.getElementById("second");
	// 	secondBoton.addEventListener("click", function(){
	// 		segundoSlid.classList.add("fadeBotonLoad");			
	// 	});
		
	// }
	// secondSection();

	// function botonHover(){
	// 	var uno = document.getElementsByClassName("uno")[0];
	// 	var sectionFirst = document.getElementById("sectionFirst");
	// 	var firstBoton = document.getElementById("first");

	// 	firstBoton.addEventListener("click", function(){
	// 		if (sectionFirst.scrollTop < 900) {
	// 		uno.classList.add("hoverAuto");
	// 		}
	// 	})

		
	// }
	// botonHover();		
});


// function botonHover(){
// 		var uno = document.getElementsByClassName("uno")[0];
// 		var body = document.body;
// 		var html = document.documentElement;
// 		// var sectionFirst = document.getElementById("sectionFirst");
// 		var firstBoton = document.getElementById("first");
		
// 		firstBoton.addEventListener("click", function(){
// 			if (body.scrollTop > 1000 || html.scrollTop > 1000) {
// 			uno.classList.add("hoverAuto");
// 			}
// 		})
		
// 	}
// 	botonHover();
// boton.addEventListener("click", function() {
//         var color = document.getElementById("color").value;
        
//         setTimeout(function(){ 
// 		document.body.style.backgroundColor = color;
//         }, 2000);
//     }); 

