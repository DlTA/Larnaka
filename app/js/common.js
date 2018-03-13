
(function(window, document, $, undefined){

	var app = {
		// Initialization
		init: function() {
			// this.loadCSS("stylesheet", "css/main.min.css");
			this.navItems = document.querySelectorAll("#menu .nav-list .nav-item");
			this.tabs = document.querySelectorAll(".tabs-list li a");
			this.reviews = document.querySelectorAll(".review-text");
			this.cardBtns = document.querySelectorAll(".car-card .btn-md");
			// FAQ panels
			this.panels = document.querySelectorAll(".panel-heading  h4  a");
			this.rentForm = document.getElementById("rentForm");
			this.locBtn = document.getElementById("current-loc");
			// Owl Carousel (https://owlcarousel2.github.io/OwlCarousel2/)
			this.carousel = $("#owl-reviews").owlCarousel({
				items: 3,
				nav: true,
				center: true,
				loop: true,
				center: true,
				dots: true,
				// lazyLoad: true,
				navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
				responsive: {
					0: {
						items: 1,
					},
					768: {
						items: 2,
						center: false
					},
					992: {
						items: 3,
					}
				}
			});
			// Flatpickr.js calendar
			this.flatpickr_cfg = {
				"locale": "ru",
				dateFormat: "d.m.Y H:i",
				minDate: "today",
				defaultDate: new Date(),
				enableTime: true,
				time_24hr: true,
				onReady: function(rawdate, altdate, instance) {
					$('<div class="confirmBtn"><i></i><i></i></div>').appendTo('.flatpickr-time').click(function() {
						instance.close();
					});
					$('.flatpickr-time .confirmBtn:eq(1)').remove();
				}				
			};
			this.checkInCalendar = flatpickr("#checkInDate", Object.assign(this.flatpickr_cfg, {

			}));
			this.checkOutCalendar = flatpickr("#checkOutDate", Object.assign(this.flatpickr_cfg, {

			}));
			this.setUpListeners();
			this.loadIMG();
			// Cute reviews
			this.reviews.forEach(self.reviewTruncate);
			// 
		},

		setUpListeners: function() {
			// menu 
			this.navItems.forEach(function(el){
				el.onclick = function(e) {
					e.preventDefault();
					// close collapse menu
					document.getElementById("nav-btn").checked = false;
					// scroll to element (40 - fixed header height)
					$('html, body').animate({
						scrollTop: $(this.getAttribute("href")).offset().top - 40
					}, 400);
				};
			});
			// tabs
			this.tabs.forEach(function(el) {
				el.addEventListener("click", self.selectLocation);
			});
			// faq panels collapse
			this.panels.forEach(function(el) {
				el.addEventListener("click", self.collapsePanel);
			});
			// card buttons listener
			this.cardBtns.forEach(function(el){
				el.onclick = function(e) {
					e.preventDefault();
					self.rentForm.classList.contains("hide") ? self.rentForm.classList.remove("hide") : 0;
					// scroll to form
					$('html, body').animate({
						scrollTop: $("#rentForm").offset().top - 40
					}, 400);
				};
			});
			// scroll listener
			window.addEventListener("scroll", self.resizeHeader);
			// location placeholder
			this.locBtn.onclick = self.setLocationPlaceholder;
		},

		// Tabs handler
		selectLocation: function(e) {
			// e.preventDefault();

			if (!this.classList.contains("active")){
				document.querySelector(".tabs-list li a.active").removeAttribute("class");
				// document.querySelector(".tabs-list li a.active").classList.remove("active");
				this.classList.add("active");
			}

			self.locBtn.innerHTML = this.innerHTML;
			self.locBtn.nextElementSibling.classList.remove("show");
			self.locBtn.classList.remove("up");
			self.locBtn.classList.add("down");
		},
		// FAQ panels collapse handler
		collapsePanel: function(e) {
			var icon = this.firstElementChild,
				panelId = this.getAttribute("href").slice(1);
		
			e.preventDefault();

			if (icon.classList.contains("fa-minus")) {
				icon.className = "fas fa-plus";
				document.getElementById(panelId).classList.remove("in");

			} else {
				icon.className = "fas fa-minus";
				document.getElementById(panelId).classList.add("in");
			}
		},

		// Cut review if text > 8 lines
		reviewTruncate: function(el) {
			if (el.scrollHeight > el.offsetHeight){
				el.classList.add("cute-text");
			}
			// console.log(el.scrollHeight, el.offsetHeight);
		},

		resizeHeader: function() {
			var shrinkOn = 60,
				distanceY = window.pageYOffset || document.documentElement.scrollTop,
				header = document.getElementsByTagName("header")[0];

				distanceY > shrinkOn ? header.classList.add("shrink") : header.removeAttribute("class");
		},

		setLocationPlaceholder: function() {

			if(this.classList.contains("down")) {
				this.classList.remove("down");
				this.classList.add("up");
				this.nextElementSibling.classList.add("show");
			} else {
				this.classList.remove("up");
				this.classList.add("down");
				this.nextElementSibling.classList.remove("show");
			}

			return false;
		},

		loadCSS: function(rel, href) {
			var link = document.createElement("link");
			link.rel = rel;
			link.href = href;
			document.head.appendChild(link);
		},

		loadIMG: function() {
			document.querySelectorAll("noscript").forEach(function(noscript){
				var img = new Image();
				img.setAttribute("data-src", "");
				noscript.parentNode.insertBefore(img, noscript);
				img.onload = function() {
					img.removeAttribute("data-src");
					noscript.parentNode.removeChild(noscript);
				};
				img.alt = noscript.getAttribute("data-alt");
				img.src = noscript.getAttribute("data-src");
			});
		},

		/**
		* @param {String} text  - PopUp message (Ваша заявка принята)
		*/
		showPopUp: function(text) {
			var popUp = document.createElement('div'),
			popUpMsg = '<div class="popUpMsg"><p>'+ text +'</p></div>';

			popUp.setAttribute('id', 'popUp');
			popUp.classList.add("popUp");
			popUp.innerHTML = popUpMsg.trim();
			document.body.appendChild(popUp);

			setTimeout(function() {
				document.body.removeChild(document.getElementById('popUp'));
			}, 2000);
		},

		/**
		* @param {String} target - Blank form field
		* @param {String} msg  - Error message
		*/
		showErrMsg: function(target, msg) {
			var el = document.querySelector('[name='+ target +']'),
				errorMsg = document.createElement('div');

			// remove last error message
			document.querySelectorAll('.error').forEach(function(err){
				err.parentNode.removeChild(err);
			});

			errorMsg.classList.add('error');
			errorMsg.innerHTML = msg;
			el.focus();
			el.parentNode.appendChild(errorMsg);
		},


	};

	var self = app;

	app.init();

	window.app = app;

})(window, window.document, window.jQuery);