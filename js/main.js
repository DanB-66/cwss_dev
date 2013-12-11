/*global dust:true, History:true */

define(['jquery', 'history', 'dust', 'dustTemplate1'], function ($) {

/*use strict*/
	var CwsCarousel = {
	
		multiple : 3,//default 3, no if items per carousel page
		lang : 'en',//default en
		renderTarget : $('.cwsCarousel'),//elem to create it inside
		carouselContent : '',// data
		carouselUiContent : '',// ui label data
		carouselContainer : '',
		carouselBuffer : '',//temp store of rendered dust for each page "group"
		carouselContentLength : '',
		contentIndex : '',//index of the last shown project item
		bHasCssTransforms : false,// test with modernizer
		History : window.History,//history lib in use
		pageTitle : document.title,
		startItem: '',
		currentPage: '',
		newMultiple: '',
		newLang: '',

		showPage : function(direction, index, newLang, newMultiple){
			console.log('OOO showPage - direction: '+direction+', index: '+index+', newLang: '+newLang+', newMultiple: '+newMultiple);

			if (newMultiple !== undefined) {
				this.multiple = newMultiple;
			}
			if (index !== undefined){
				this.contentIndex = index;
			}
			if (direction === 'forward'){
				this.contentIndex += this.multiple;
			}
			if (direction === 'back'){
				this.contentIndex -= this.multiple ;
			}
			if (newLang !== undefined) {
				console.info('newLang is not undefined: '+newLang);
				//this.lang = newLang; ?????????????????
			}

			this.currentPage = this.contentIndex/this.multiple;
			var that = this;

			this.carouselContainer.fadeTo(500, 0, function() {
				//here: push state and let statechange manipulate ui
				
				console.log('PUSH STATE: content index- '+that.contentIndex +'- page title' + that.pageTitle + ' page=' + that.currentPage + ' multiple=' + that.multiple + ' lang=' + that.lang);
				that.History.pushState({state: that.contentIndex, 
										rand: Math.random(), 
										direction: direction, 
										lang: that.lang, 
										multiple: that.multiple}, 
											that.pageTitle + ' - Page ' + that.currentPage, 
												'?page=' + that.currentPage + '+multiple=' + that.multiple + '+lang=' + that.lang);

			});

		},

		buildUI : function(bIsRebuild) {// build ui elems on load, on lang change refresh with new data
			var controls = '<section id="controls"><section id="setMultipleControl"><h4>'+this.carouselContent.i18n.uImultiItems+':</h4><ul><li>1</li><li>2</li><li>3</li><li>4</li></ul></section><section id="setLangControl"><h4>'+this.carouselContent.i18n.uImultiLang+':</h4><ul><li id="en">'+this.carouselContent.i18n.localeNames.uIen+'</li><li id="fr">'+this.carouselContent.i18n.localeNames.uIfr+'</li></ul></section></section>';
			var ui = '<a href="#" class="cwsCprev" title="'+this.carouselContent.i18n.uIprevious+'">'+this.carouselContent.i18n.uIprevious+'</a> <a href="#" class="cwsCnext" title="'+this.carouselContent.i18n.uInext+'">'+this.carouselContent.i18n.uInext+'</a><div class="carousel multiple'+CwsCarousel.multiple+'"></div>';
			this.renderTarget.html(controls + ui);
			this.carouselContainer = this.renderTarget.children('.carousel');
			if (bIsRebuild){// ie from lang select
				console.log('*****lang selected, in buildUI');
				bIsRebuild = 0;
				this.showPage(undefined, undefined, CwsCarousel.lang, undefined);
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
									CwsCarousel.showPage(direction, undefined, undefined, undefined);
								}
								
							});

						} else {
							//console.log('no transitions');
							CwsCarousel.showPage(direction, undefined, undefined, undefined);
						}
						
					}
					event.preventDefault();
				});

				History.Adapter.bind(window,'statechange',function() {// ie both browser back/fwd btn and app ui btns and initial load - manipulate ui
					//all logic to manipulate page navigation etc should be here
					var State = History.getState(), projData, uiData, mergedJson, i, 
						incrementBuffer = function(err, output){
							if(err !== null){
								alert("dust error: " + err);
							}
							CwsCarousel.carouselBuffer += output;
						};

					console.log('STATECHANGE, datastate: ' + State.data.state + ' direction: ' + State.data.direction + ' mult: ' + State.data.multiple+ ' lang: ' + State.data.lang);
					
					//fix Object.keys for ie8 - http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
					Object.keys = Object.keys || (function () {
						var hasOwnPropertyFlag = Object.prototype.hasOwnProperty,
							hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
							DontEnums = [
								'toString',
								'toLocaleString',
								'valueOf',
								'hasOwnProperty',
								'isPrototypeOf',
								'propertyIsEnumerable',
								'constructor'
							],
							DontEnumsLength = DontEnums.length;
						return function (o) {
							if (typeof o != "object" && typeof o != "function" || o === null)
								throw new TypeError("Object.keys called on a non-object");
							var result = [];
							for (var name in o) {
								if (hasOwnPropertyFlag.call(o, name))
									result.push(name);
							}
							if (hasDontEnumBug) {
								for (var i = 0; i < DontEnumsLength; i++) {
									if (hasOwnPropertyFlag.call(o, DontEnums[i]))
										result.push(DontEnums[i]);
								}	
							}
							return result;
						};
					})();


					if (Object.keys(State.data).length !== 0){
						
						CwsCarousel.carouselContainer.empty().removeClass('forward back enterLeft enterRight');
						
						if (State.data.multiple !== undefined) {
							CwsCarousel.multiple = State.data.multiple;
							CwsCarousel.carouselContainer.removeClass('multiple1 multiple2 multiple3 multiple4').addClass('multiple'+State.data.multiple);
							CwsCarousel.markMultiple(State.data.multiple);
						}						
						if (State.data.state !== undefined) {
							CwsCarousel.contentIndex = State.data.state;
						}
						if (State.data.lang !== undefined) {
							CwsCarousel.lang = State.data.lang;
						}
						
						CwsCarousel.carouselBuffer = '';

						CwsCarousel.setNav();
						//reduce CwsCarousel.contentIndex by multiple and iterate dust
						CwsCarousel.contentIndex = CwsCarousel.contentIndex - CwsCarousel.multiple;// fix : this can be eg 3-2?
						for (i=0; i < CwsCarousel.multiple; i++) {
							projData = CwsCarousel.carouselContent.projects[CwsCarousel.contentIndex];
							uiData = CwsCarousel.carouselUiContent;
							mergedJson = dust.makeBase(uiData);
							mergedJson = mergedJson.push(projData);
							//console.log('## CwsCarousel.contentIndex in dust: '+CwsCarousel.contentIndex);
							if (CwsCarousel.contentIndex < CwsCarousel.carouselContentLength) {
								dust.render('cwsProjects', mergedJson, incrementBuffer);//'cwsProjects' is a compiled dust template already registered
							}
							CwsCarousel.contentIndex++;
						}
						
						var transitionInClass = 'enterLeft';
						if (State.data.direction === 'back'){
							transitionInClass = 'enterRight';
						}
						CwsCarousel.carouselContainer.html(CwsCarousel.carouselBuffer).addClass(transitionInClass);
									
						
						CwsCarousel.carouselContainer.fadeTo(500, 1);
						console.log('________________________________');
						
					} else {
						alert('no State.data left, so do NORMAL history back');
						history.back();//then do normal back in users history to prev site(note lowercase h)
					}

				});
				
				// delegate click on 'set multiple' control
				this.renderTarget.on('click', '#setMultipleControl li', function() {
					var currMultiple = $(this).index()+1;
					if(currMultiple !== CwsCarousel.multiple){
						CwsCarousel.setMultiple(currMultiple);
					}
				});
				
				// delegate click on 'set lang' control
				this.renderTarget.on('click', '#setLangControl li', function() {
					var currId = $(this).attr('id');
					if(currId !== CwsCarousel.lang){
						CwsCarousel.setLang(currId);
					}
				});
				//console.log('startItem for showpage',CwsCarousel.startItem);				
				this.showPage(undefined, CwsCarousel.startItem, undefined, undefined);//show first set on load, potentially based on referrer
				//debugger;
				
			}
			this.markMultiple(this.multiple);//mark on page load
			this.markLang(this.lang);//mark on page load

		},

		loadData : function(bIsRebuild) {//load json and pass bIsRebiuld to buildUI n????????????? beforeSend to set spinner?
			$.ajax({
				url: 'json/cws_'+CwsCarousel.lang+'.json',
				dataType: 'json',
				cache: false,
				success: function(data) {
					CwsCarousel.carouselContent = data.cwsData;//data
					CwsCarousel.carouselUiContent = data.cwsData.i18n;//ui labels data
					CwsCarousel.carouselContentLength = CwsCarousel.carouselContent.projects.length;// length of the projects data 
					CwsCarousel.buildUI(bIsRebuild);
				},
				error: function() {
					alert('json failed to load...');
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
			this.showPage(undefined, CwsCarousel.multiple, undefined, newMultiple);
		},

		markLang : function(newLang) {// mark the menu selection for language
			var langMenu = $('#setLangControl');
			langMenu.find('li').removeClass('active');
			langMenu.find('#'+ newLang).addClass('active');
		},

		setLang : function(newLang) {// action the new lang
			this.lang = newLang;
			this.carouselContainer.fadeTo(700, 0, function(){
				CwsCarousel.loadData(1);//1= only refresh data		
				CwsCarousel.markLang(CwsCarousel.lang);
				//debugger;
				CwsCarousel.showPage(undefined, undefined, CwsCarousel.lang, undefined);
			});
		},

		setNav : function() {// paging back/fwd buttons toggle inactive state
			var next = $('.cwsCnext'),
				prev = $('.cwsCprev');
				//console.info('contentIndex in setnav: '+this.contentIndex);
			if (this.contentIndex < this.carouselContentLength ) {
				next.removeClass('disabled').attr('title', this.carouselContent.i18n.uInext);
			} else {
				next.addClass('disabled').attr('title', '');
			}
			if (this.contentIndex <= this.multiple) {
				prev.addClass('disabled').attr('title', '');
			} else {
				prev.removeClass('disabled').attr('title',	this.carouselContent.i18n.uIprevious);
			}
		},	

		init : function() {
			//debugger;
			var pageFromUrl = 0,
				urlLocationType = '';
			if (Modernizr.csstransforms3d){
				this.bHasCssTransforms = true;
			}
			
			// extract the page no, multiple and lang from url, if its present (eg bookmark, refresh, pasted/shared url)
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
				this.startItem = pageFromUrl*this.multiple;
			} else {
				this.startItem = this.multiple;
			}
			
			console.log('start item............................'+this.startItem);
			this.loadData(0);//0= rebuild full ui
		}

	}; 
	
	$(document).ready(CwsCarousel.init());

});
