/*global dust:true, History:true */

/*
using: jquery, dust.js templating, History.js

statechange only via native back forward
pushstate > statechange via UI btns and pasting url/loading
*/

;(function ( window, $, undefined ) {
/*use strict */
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
		bHasCssTransforms : false,// test with modernizer
		History : window.History,//history lib in use
		pageTitle : document.title,
		startItem: 0,
		newMultiple: '',
		newLang: '',

		showPage : function(direction, index, bCalledByUi, newMultiple){
			console.log('showPage - direction: '+direction+', index: '+index+', bCalledByUi: '+bCalledByUi+', newMultiple: '+newMultiple);
	
			this.bCalledByUi = bCalledByUi;
			if (index !== undefined){
				this.contentIndex = index;
			}
			if (direction === 'back'){
				this.contentIndex = (this.contentIndex - (this.multiple * 2));
			}
			var that = this;

			this.carouselContainer.fadeTo(500, 0, function(){
			
				var projData, uiData, mergedJson, i;
												
				if (newMultiple !== undefined) {
					that.carouselContainer.removeClass('multiple1 multiple2 multiple3 multiple4').addClass('multiple'+newMultiple);
				}
				that.carouselContainer.empty().removeClass('forward back enterLeft enterRight');
				that.carouselBuffer = '';
				function incrementBuffer(err, output){
					if(err !== null){
						alert("dust error: " + err);
					}
					that.carouselBuffer += output;
				}	
				
				for (i=0; i < that.multiple; i++) {
					projData = that.carouselContent.projects[that.contentIndex];
					uiData = that.carouselUiContent;
					mergedJson = dust.makeBase(uiData);
					mergedJson = mergedJson.push(projData);
					if (that.contentIndex < that.carouselContentLength) {
						dust.render('cwsProjects', mergedJson, incrementBuffer);//'cwsProjects' is a compiled dust template already registered
					}
					that.contentIndex++;
				}
				
				var transitionInClass = 'enterLeft';
				if (direction === 'back'){
					transitionInClass = 'enterRight';
				}
				that.carouselContainer.html(that.carouselBuffer).addClass(transitionInClass);
				var currentPage = that.contentIndex/that.multiple;
				
				if (that.bCalledByUi === true){
					console.log('PUSH STATE: content index- '+that.contentIndex +'- page title' + that.pageTitle + ' page=' + currentPage + ' multiple=' + that.multiple + ' lang=' + that.lang);
					that.History.pushState({state:that.contentIndex, rand:Math.random(), lang:that.lang, multiple:that.multiple}, that.pageTitle + ' - Page ' + currentPage, '?page=' + currentPage + '+multiple=' + that.multiple + '+lang=' + that.lang);
					that.bCalledByUi = false;
				}
				CwsCarousel.setNav();
				that.carouselContainer.fadeTo(500, 1);

			});

		},


		buildUI : function(bIsRebuild) {// build ui elems on load, on lang change refresh with new data
			var controls = '<section id="controls"><section id="setMultipleControl"><h4>'+this.carouselContent.i18n.uImultiItems+':</h4><ul><li>1</li><li>2</li><li>3</li><li>4</li></ul></section><section id="setLangControl"><h4>'+this.carouselContent.i18n.uImultiLang+':</h4><ul><li id="en">'+this.carouselContent.i18n.localeNames.uIen+'</li><li id="fr">'+this.carouselContent.i18n.localeNames.uIfr+'</li></ul></section></section>';
			var ui = '<a href="#" class="cwsCprev" title="'+this.carouselContent.i18n.uIprevious+'">'+this.carouselContent.i18n.uIprevious+'</a> <a href="#" class="cwsCnext" title="'+this.carouselContent.i18n.uInext+'">'+this.carouselContent.i18n.uInext+'</a><div class="carousel multiple'+CwsCarousel.multiple+'"></div>';
			this.renderTarget.html(controls + ui);
			this.carouselContainer = this.renderTarget.children('.carousel');
			if(bIsRebuild){// ie from lang select
				bIsRebuild = 0;
				this.showPage(undefined, (CwsCarousel.contentIndex - CwsCarousel.multiple), true, undefined);
			} else {
				this.renderTarget.on('click','.cwsCprev, .cwsCnext', function(event){			
					if (!($(this).hasClass('disabled'))){
						var direction = 'forward';
						if ($(this).hasClass('cwsCprev')){
							direction = 'back';
						}
						if (CwsCarousel.bHasCssTransforms){// wait for n transitions to end (sequenced)
							var transitionCount = 0;
							CwsCarousel.carouselContainer.addClass(direction).on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
								transitionCount++;
								if (transitionCount === CwsCarousel.carouselContainer.children().length){
									CwsCarousel.carouselContainer.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');									
									CwsCarousel.showPage(direction, undefined, true, undefined);
								}
								
							});

						} else {
							//console.log('no transitions');
							CwsCarousel.showPage(direction, undefined, true, undefined);
						}
						
					}
					event.preventDefault();
				});

				History.Adapter.bind(window,'statechange',function(){// ie both browser back/fwd btn and app ui btns and initial load
					var State = History.getState();
					console.log('STATECHANGE, cbui: ' + CwsCarousel.bCalledByUi + ' datastate: ' + State.data.state + ' mult: ' + State.data.multiple+ ' lang: ' + State.data.lang);
					if(!CwsCarousel.bCalledByUi && (State.data.state >= CwsCarousel.multiple)){//native back fwd pressed, then show page based on History 
						//CwsCarousel.showPage(undefined, (State.data.state - CwsCarousel.multiple), false, undefined);//good

						CwsCarousel.showPage(undefined, (State.data.state - CwsCarousel.multiple), false, undefined);//, CwsCarousel.lang#######changed						
console.log('paging buttons back fwd');				
					} else if (!CwsCarousel.bCalledByUi && (State.data.multiple !== CwsCarousel.multiple) ){
console.log('not called by ui should change multiple now');
console.log('lang should be: '+State.data.lang);//NOT CwsCarousel.lang !!!!
console.log('multiple should be: '+State.data.multiple);//NOT CwsCarousel.lang !!!!	
console.log('cws multiple is: '+CwsCarousel.multiple);//NOT CwsCarousel.lang !!!
CwsCarousel.multiple = State.data.multiple;
CwsCarousel.showPage('forward', 0, true, CwsCarousel.multiple);


					} else if (!CwsCarousel.bCalledByUi && !State.data.state){
						history.back();//then do normal back in users history to prev site(note lowercase h)
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
				
				this.showPage('forward', this.startItem, true, undefined);//show first set based on referrer
				
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

		setNav : function() {// paging back/fwd buttons toggle inactive state
			var next = $('.cwsCnext'),
				prev = $('.cwsCprev');
			if (this.contentIndex < this.carouselContentLength ) {
				next.removeClass('disabled').attr('title', this.carouselContent.i18n.uInext);
			} else {
				next.addClass('disabled').attr('title', '');
			}
			if (this.contentIndex <= this.multiple) {
				prev.addClass('disabled').attr('title', '');
			} else {
				prev.removeClass('disabled').attr('title',  this.carouselContent.i18n.uIprevious);
			}
		},

		init : function() {
			if (Modernizr.csstransforms){
				this.bHasCssTransforms = true;
			}
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
				this.startItem = --pageFromUrl*this.multiple;//Fix --
				console.log('start item: '+this.startItem);
			}
			
			this.loadData(0);
		}

	}; 
	
	CwsCarousel.init();

}(window, jQuery));
