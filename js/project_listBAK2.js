;(function ( $, window, undefined ) {

    $.ajaxSetup({ cache: false });
    $.getJSON('json/cws.json', function(data) {

        var CwsCarousel = {
        
            multiple : 3,
            renderTarget : $('#cwsCarousel'),
            carouselContent : data.cwsData.projects,
            carouselContentLength : data.cwsData.projects.length,
            contentIndex : 0,
            //currentSet : 0,
            showPage : function(direction){
                if (direction === "left"){
                    CwsCarousel.contentIndex = (CwsCarousel.contentIndex - (this.multiple * 2));                   
                }
                CwsCarousel.renderTarget.children('.carousel').empty();
                for (var i=0; i<this.multiple; i++) {
                    if (this.contentIndex<this.carouselContentLength) {
                        dust.render('cwsProjects', this.carouselContent[this.contentIndex], function(err, output){
                            CwsCarousel.renderTarget.children('.carousel').append(output);
                        });
                    }
                    CwsCarousel.contentIndex++;
                }
                this.checkLimits();
                        
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