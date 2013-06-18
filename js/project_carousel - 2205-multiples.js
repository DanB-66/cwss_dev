/*global dust:true, History:true */

/*
statechange only via native back forward
pushstate > statechange via UI btns and pasting url
*/

;(function ( $, window, undefined ) {

	$.ajaxSetup({ cache: false });

	$.getJSON('json/cws.json', function(data) {

		var CwsCarousel = {
		
			multiple : 3,//no if items per carousel page
			renderTarget : $('.cwsCarousel'),//elem to create it inside
			carouselContent : data.cwsData.projects,//data
			carouselContainer : '',
			//carouselBuffer : '',
			carouselContentLength : '',
			contentIndex : 0,
			bCalledByUi : false,// true if UI nav used or refresh or initial load. False if native back/forward buttons used.
			History : window.History,
			pageTitle : document.title,

			showPage : function(direction, index, bCalledByUi){

				this.bCalledByUi = bCalledByUi;
				if (index !== ('undefined' || NaN)){
					this.contentIndex = index;
				}
				if (direction === 'back'){
					this.contentIndex = (this.contentIndex - (this.multiple * 2));
				}
				var that = this;
				this.carouselContainer.fadeTo(700, 0, function(){
					that.carouselContainer.empty();
					for (var i=0; i<that.multiple; i++) {
						if (that.contentIndex<that.carouselContentLength) {
							dust.render('cwsProjects', that.carouselContent[that.contentIndex], function(err, output){
								that.carouselContainer.append(output);//todo: move append out of loop to buffer (for performance)
							});
						}
						that.contentIndex++;

					}
					that.setNav();
					var currentPage = that.contentIndex/that.multiple;
					
					if (that.bCalledByUi === true){
						console.log("PUSH STATE ****** content index: "+that.contentIndex);
						that.History.pushState({state:that.contentIndex,currMultiple:that.multiple,rand:Math.random()}, that.pageTitle + ' - Page ' + currentPage, '?page=' + currentPage + '+multiple=' + that.multiple);
						//that.bCalledByUi = false;
					}
					that.bCalledByUi = false;//move up?
					that.carouselContainer.fadeTo(700, 1);
				});

			},
			
			setNav : function(){

				if (this.contentIndex < this.carouselContentLength ) {
					$('.cwsCnext').removeClass('disabled').attr('title', 'Next');
				} else {
					$('.cwsCnext').addClass('disabled').attr('title', '');
				}
				if (this.contentIndex <= this.multiple) {
					$('.cwsCprev').addClass('disabled').attr('title', '');
				} else {
					$('.cwsCprev').removeClass('disabled').attr('title', 'Previous');
				}

			},
			
			init : function() {

				var startItem = 0;
				var pageFromUrl = 0;
				/* extract the page no and multiple from url, if its present (eg bookmark, refresh or pasted url) */
				if (window.location.search){//history-enabled eg html5
					pageFromUrl = (window.location.search.split('=')[1]).split('+')[0];
					this.multiple = window.location.search.split('+multiple=')[1];
				} else if (window.location.hash){//non-history enabled
					pageFromUrl = (window.location.hash.split('=')[1]).split('+')[0];//check this
					this.multiple = window.location.hash.split('+multiple=')[1].split('&')[0];//check this
				}
				if(pageFromUrl !== 0){//ie bookmarked/pasted url
					startItem = (--pageFromUrl)*this.multiple;
				}
				
				this.carouselContentLength = this.carouselContent.length;// length of the data        

				this.renderTarget.empty().append('<a href="#" class="cwsCprev" title="Previous">Previous</a> <a href="#" class="cwsCnext" title="Next">Next</a><div class="carousel"></div>');
				this.renderTarget.on('click','.cwsCprev',function(event){
					if (!($(this).hasClass('disabled'))){
						CwsCarousel.showPage('back', 'undefined', true);
					}
					event.preventDefault();
				});
				this.renderTarget.on('click','.cwsCnext',function(event){
					if (!($(this).hasClass('disabled'))){
						CwsCarousel.showPage('forward', 'undefined', true);
					}
					event.preventDefault();
				});
				this.carouselContainer = CwsCarousel.renderTarget.children('.carousel');
				this.showPage('forward', startItem, true);//show first set based on referrer

				History.Adapter.bind(window,'statechange',function(){// ie both browser back/fwd btn and app ui btns and initial load
					var State = History.getState();
					console.log('STATECHANGE, cbui: ' + CwsCarousel.bCalledByUi + ' datastate: ' + State.data.state + ' mult: ' + CwsCarousel.multiple);
					if(!CwsCarousel.bCalledByUi && (State.data.state >= CwsCarousel.multiple)){//then show page based on history 
						CwsCarousel.showPage(undefined, (State.data.state - CwsCarousel.multiple), false);
						
					} else if (!CwsCarousel.bCalledByUi && !State.data.state) {
						history.back();//then do normal back (note lowercase h)
					}

				}); 

			}
		};

		CwsCarousel.init();
		//test of multiples
		$('#test1').click(function (event) {
			event.preventDefault();
			CwsCarousel.multiple = 1;
			CwsCarousel.showPage('forward', 0, true);
		});
		$('#test2').click(function (event) {
			event.preventDefault();
			CwsCarousel.multiple = 2;
			CwsCarousel.showPage('forward', 0, true);
		});
		$('#test3').click(function (event) {
			event.preventDefault();
			CwsCarousel.multiple = 3;
			CwsCarousel.showPage('forward', 0, true);
		});
		$('#test4').click(function (event) {
			event.preventDefault();
			CwsCarousel.multiple = 4;
			CwsCarousel.showPage('forward', 0, true);
		});
		//end test
	});

}(jQuery, window));

