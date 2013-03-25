;(function ( $, window, undefined ) {

    $.ajaxSetup({ cache: false });
    $.getJSON('json/cws.json', function(data) {

        var CwsCarousel = {
        
            multiple : 3,
            renderTarget : $('#cwsCarousel'),
            carouselContent : data.cwsData.projects,
            carouselContentLength : data.cwsData.projects.length,
            contentIndex : 0,

            showPage : function(direction){
                carouselContainer = this.renderTarget.children('.carousel');
                if (direction === "left"){
                    CwsCarousel.contentIndex = (CwsCarousel.contentIndex - (this.multiple * 2));
                }
                carouselContainer.fadeTo(500, 0, function(){
                    carouselContainer.empty();
                    for (var i=0; i<CwsCarousel.multiple; i++) {
                        if (CwsCarousel.contentIndex<CwsCarousel.carouselContentLength) {
                            dust.render('cwsProjects', CwsCarousel.carouselContent[CwsCarousel.contentIndex], function(err, output){
                                carouselContainer.append(output);
                            });
                        }
                        CwsCarousel.contentIndex++;

                    }
                    CwsCarousel.checkLimits();
                    carouselContainer.fadeTo(500, 1);
                });
                        
            },
            checkLimits : function(){

                if (this.contentIndex < this.carouselContentLength ) {
                    $('.cwsCnext').removeClass('disabled');
                } else {
                    $('.cwsCnext').addClass('disabled');
                }
                if (this.contentIndex <= this.multiple) {
                    $('.cwsCprev').addClass('disabled');
                } else {
                    $('.cwsCprev').removeClass('disabled');
                }
                        
            },
            init : function() {
            
                this.renderTarget.append('<a href="#" class="cwsCprev">prev</a> <a href="#" class="cwsCnext">next</a><div class="carousel"></div>');
                this.renderTarget.on('click','.cwsCprev',function(){
                    if (!($(this).hasClass('disabled'))){
                        CwsCarousel.showPage('left');
                    }
                });
                this.renderTarget.on('click','.cwsCnext',function(){
                    if (!($(this).hasClass('disabled'))){
                        CwsCarousel.showPage();
                    }
                });
                CwsCarousel.showPage();//show first set
                
            }                    
        };
    

        CwsCarousel.init();

    });

}(jQuery, window));