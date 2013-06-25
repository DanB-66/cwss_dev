/*global dust:true, History:true */

/*
statechange only via native back forward
pushstate > statechange via UI btns and pasting url
*/

;(function ( $, window, undefined ) {

	var CwsCarousel = {
	
		multiple : 3,//default 3, no if items per carousel page
		lang : 'en',//default en
		renderTarget : $('.cwsCarousel'),//elem to create it inside
		carouselContent : '',// data
		carouselUiContent : '',// ui label data
		carouselContainer : '',
		carouselBuffer : '',//temp store of rendered dust for each page "group"
		carouselContentLength : '',
		contentIndex : 0,//index of the project item
		bCalledByUi : false,// true if UI nav used or refresh or initial load. False if browser native back/forward buttons used.
		History : window.History,//history lib in use
		pageTitle : document.title,
		startItem: 0,
		newMultiple: '',

		showPage : function(direction, index, bCalledByUi, newMultiple){
			//console.log('showPage - direction, index, bCalledByUi, newMultiple '+direction, index, bCalledByUi, newMultiple); 
			this.bCalledByUi = bCalledByUi;
			if (index !== ('undefined' || NaN)){
				this.contentIndex = index;
			}
			if (direction === 'back'){
				this.contentIndex = (this.contentIndex - (this.multiple * 2));
			}
			var that = this;

			function setNav(){
				if (that.contentIndex < that.carouselContentLength ) {
					$('.cwsCnext').removeClass('disabled').attr('title', that.carouselContent.i18n.uInext);
				} else {
					$('.cwsCnext').addClass('disabled').attr('title', '');
				}
				if (that.contentIndex <= that.multiple) {
					$('.cwsCprev').addClass('disabled').attr('title', '');
				} else {
					$('.cwsCprev').removeClass('disabled').attr('title',  that.carouselContent.i18n.uIprevious);
				}
			}

			this.carouselContainer.fadeTo(700, 0, function(){
				if (newMultiple !== 'undefined') {
					that.carouselContainer.removeClass('multiple1 multiple2 multiple3 multiple4').addClass('multiple'+newMultiple);
				}
				that.carouselContainer.empty();
				that.carouselBuffer = '';
				function incrementBuffer(err, output){
					if(err !== null){
						alert("dust error: " + err);
					}
					that.carouselBuffer += output;
				}
				for (var i=0; i < that.multiple; i++) {
					if (that.contentIndex < that.carouselContentLength) {
						var projData = that.carouselContent.projects[that.contentIndex];
						var uiData = that.carouselUiContent;
						var mergedJson = dust.makeBase(uiData);
						mergedJson = mergedJson.push(projData);
						dust.render('cwsProjects', mergedJson, incrementBuffer);
					}
					that.contentIndex++;

				}
				that.carouselContainer.html(that.carouselBuffer);
				setNav();
				var currentPage = that.contentIndex/that.multiple;
				
				if (that.bCalledByUi === true){
					//console.log('PUSH STATE: content index'+that.contentIndex +': page title' + that.pageTitle + ' page=' + currentPage + ' multiple=' + that.multiple + ' lang=' + that.lang);
					that.History.pushState({state:that.contentIndex,rand:Math.random()}, that.pageTitle + ' - Page ' + currentPage, '?page=' + currentPage + '+multiple=' + that.multiple + '+lang=' + that.lang);
					that.bCalledByUi = false;
				}
				that.carouselContainer.fadeTo(700, 1);
			});

		},
		
		markMultiple : function(newMultiple) {// mark the menu selection for multiple
			var multipleMenu = $('#setMultipleControl');
			multipleMenu.find('li').removeClass('active');
			multipleMenu.find('li:eq('+ --newMultiple +')').addClass('active');
		},
		
		setMultiple : function(newMultiple) {// action the new multiple
			this.multiple = newMultiple;
			this.markMultiple(newMultiple);
			this.showPage('forward', 0, true, newMultiple);
		},
		
		markLang : function(newLang) {// mark the menu selection for lang
			var langMenu = $('#setLangControl');
			langMenu.find('li').removeClass('active');
			langMenu.find('#'+ newLang).addClass('active');
		},
		
		setLang : function(newLang) {// action the new lang
			this.lang = newLang;
			this.carouselContainer.fadeTo(700, 0, function(){
				CwsCarousel.loadData(1);
				CwsCarousel.markLang(CwsCarousel.lang);
			});
		},

		buildUI : function(bIsRebuild) {// build elems on load and lang change
			var controls = '<section id="controls"><section id="setMultipleControl"><h4>'+this.carouselContent.i18n.uImultiItems+':</h4><ul><li>1</li><li>2</li><li>3</li><li>4</li></ul></section><section id="setLangControl"><h4>'+this.carouselContent.i18n.uImultiLang+':</h4><ul><li id="en">'+this.carouselContent.i18n.localeNames.uIen+'</li><li id="fr">'+this.carouselContent.i18n.localeNames.uIfr+'</li></ul></section></section>';
			var ui = '<a href="#" class="cwsCprev" title="'+this.carouselContent.i18n.uIprevious+'">'+this.carouselContent.i18n.uIprevious+'</a> <a href="#" class="cwsCnext" title="'+this.carouselContent.i18n.uInext+'">'+this.carouselContent.i18n.uInext+'</a><div class="carousel multiple'+CwsCarousel.multiple+'"></div>';
			this.renderTarget.html(controls + ui);
			this.carouselContainer = this.renderTarget.children('.carousel');
			if(bIsRebuild){// ie from lang select
				bIsRebuild = 0;
				this.showPage('undefined', (CwsCarousel.contentIndex - CwsCarousel.multiple), true, 'undefined');
			} else {
				this.renderTarget.on('click','.cwsCprev',function(event){
					if (!($(this).hasClass('disabled'))){
						$(this).removeClass('tiltForward tiltBack');
						CwsCarousel.showPage('back', 'undefined', true, 'undefined');
					}
					event.preventDefault();
				});
				this.renderTarget.on('click','.cwsCnext',function(event){
					if (!($(this).hasClass('disabled'))){
						$(this).removeClass('tiltForward tiltBack');
						CwsCarousel.showPage('forward', 'undefined', true, 'undefined');
					}
					event.preventDefault();
				});
				
				this.renderTarget.on('mouseover','.cwsCnext',function(event){
					if (!($(this).hasClass('disabled'))){
						$('.carousel').addClass('tiltForward');
					}
				});
				this.renderTarget.on('mouseout','.cwsCnext',function(event){
					if (!($(this).hasClass('disabled'))){
						$('.carousel').removeClass('tiltForward');
					}
				});
				this.renderTarget.on('mouseover','.cwsCprev',function(event){
					if (!($(this).hasClass('disabled'))){
						$('.carousel').addClass('tiltBack');
					}
				});
				this.renderTarget.on('mouseout','.cwsCprev',function(event){
					if (!($(this).hasClass('disabled'))){
						$('.carousel').removeClass('tiltBack');
					}
				});
				
				// delegate click on 'set multiple' control
				this.renderTarget.on('click', '#setMultipleControl li', function(){
					var currMultiple = $(this).index()+1;
					if(currMultiple !== CwsCarousel.multiple){
						CwsCarousel.setMultiple(currMultiple);
					}
				});
				
				// delegate click on 'set lang' control
				this.renderTarget.on('click', '#setLangControl li', function(){
					var currId = $(this).attr('id');
					if(currId !== CwsCarousel.lang){
						CwsCarousel.setLang(currId);
					}
				});
				
				this.showPage('forward', this.startItem, true, 'undefined');//show first set based on referrer
				
				History.Adapter.bind(window,'statechange',function(){// ie both browser back/fwd btn and app ui btns and initial load
					var State = History.getState();
					//console.log('STATECHANGE, cbui: ' + CwsCarousel.bCalledByUi + ' datastate: ' + State.data.state + ' mult: ' + CwsCarousel.multiple);
					if(!CwsCarousel.bCalledByUi && (State.data.state >= CwsCarousel.multiple)){//native back fwd pressed, then show page based on History 
						CwsCarousel.showPage('undefined', (State.data.state - CwsCarousel.multiple), false, 'undefined');					
					} else if (!CwsCarousel.bCalledByUi && !State.data.state) {
						history.back();//then do normal back (note lowercase h)
					}

				});
			}
			this.markMultiple(this.multiple);//mark on page load
			this.markLang(this.lang);//mark on page load

		},

		loadData : function(bIsRebuild) {
			$.ajax({
				url: 'json/cws_'+CwsCarousel.lang+'.json',
				dataType: 'json',
				cache: false,
				success: function( data ) {
					CwsCarousel.carouselContent = data.cwsData;//data
					CwsCarousel.carouselUiContent = data.cwsData.i18n;//ui labels data
					CwsCarousel.carouselContentLength = CwsCarousel.carouselContent.projects.length;// length of the projects data 
					CwsCarousel.buildUI(bIsRebuild);
				},
				error: function() {
					alert( "Failed to load json...");
				}
			});
		},

		init : function() {
			//debugger;
			var pageFromUrl = 0,
				urlLocationType = '';
			/* extract the page no, multiple and lang from url, if its present (eg bookmark, refresh or pasted url) */
			if (window.location.search !== ''){//history-enabled
				urlLocationType = window.location.search;
			} else if (window.location.hash !== ''){//non-history enabled
				urlLocationType = window.location.hash;
			}
			if (urlLocationType !== ''){
				pageFromUrl = parseInt((urlLocationType.split('=')[1]).split('+')[0], 10);
				this.multiple = parseInt(urlLocationType.split('+multiple=')[1].split('+lang=')[0], 10);
				this.lang = urlLocationType.split('+lang=')[1].split('&')[0];
			}

			if(pageFromUrl !== 0){//ie it's a bookmarked/pasted url
				this.startItem = --pageFromUrl*this.multiple;
			}
			
			this.loadData(0);

		}

	}; 
	
	CwsCarousel.init();

}(jQuery, window));
