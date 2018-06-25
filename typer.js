var Word = Backbone.Model.extend({
	move: function() {
		this.set({y:this.get('y') + this.get('speed')});
	}
});

var Words = Backbone.Collection.extend({
	model:Word
});

var WordView = Backbone.View.extend({
	initialize: function() {
		$(this.el).css({position:'absolute'});
		var string = this.model.get('string');
		var letter_width = 25;
		var word_width = string.length * letter_width;
		if(this.model.get('x') + word_width > $(window).width()) {
			this.model.set({x:$(window).width() - word_width});
		}
		for(var i = 0;i < string.length;i++) {
			$(this.el)
				.append($('<div>')
					.css({
						width:letter_width + 'px',
						padding:'5px 2px',
						'border-radius':'4px',
						'background-color':'#fff',
						border:'1px solid #ccc',
						'text-align':'center',
						float:'left'
					})
					.text(string.charAt(i).toUpperCase()));
		}

		this.listenTo(this.model, 'remove', this.remove);

		this.render();
	},

	render: function () {
		$(this.el).css({
			top: this.model.get('y') + 'px',
			left: this.model.get('x') + 'px',
			width: '100%'
		});
		var highlight = this.model.get('highlight');
		var self = this;
		$(this.el).find('div').each(function (index, element) {
			if (index < highlight) {
				$(element).css({ 'font-weight': 'bolder', 'background-color': '#aaa', color: '#fff' });
			} else {
				$(element).css({ 'font-weight': 'normal', 'background-color': '#fff', color: '#000' });
			}
		});
	}
});

var TyperView = Backbone.View.extend({
	initialize: function () {
		var wrapper = $('<div>')
			.css({
				position: 'fixed',
				top: '0',
				left: '0',
				width: '100%',
				'min-width': '320px',
				height: '100%'
			});
		this.wrapper = wrapper;

		var self = this;
		var text_input = $('<input>')
			.addClass('form-control')
			.attr('disabled', true)
			.css({
				'border-radius':'4px',
				position:'absolute',
				bottom:'0',
				'min-width':'80%',
				width:'80%',
				'margin-bottom':'10px',
				'z-index':'1000'
			}).keyup(function() {
				var words = self.model.get('words');
				var counter = 0;
				for (var i = 0; i < words.length; i++) {
					var word = words.at(i);
					var typed_string = $(this).val();
					var string = word.get('string');
					if (string.toLowerCase().indexOf(typed_string.toLowerCase()) == 0) {
						word.set({ highlight: typed_string.length });
						counter++;
						if (typed_string.length == string.length) {
							$(this).val('');
							self.model.set('score', self.model.get('score') + 50);
						}
					} else {
						word.set({ highlight: 0 });
					}
				}
				  if (counter == 0 && self.model.get('iteration') != null) {
					    $(this).val('');
					         if (self.model.get('score') > 0) {
			                  self.model.set('score', self.model.get('score') - 50);
					}
				}
			});

		var Start = $('<input class="start">')
			.addClass('form-control')
			.attr('type', 'button')
			.val('Start')
			.click(function () {
				self.model.start();
				$(this).attr('disabled', true);
				Pause.removeAttr('disabled');
				Stop.removeAttr('disabled');
				text_input.removeAttr('disabled');
				text_input.focus();
			});

		var Pause = $('<input class="pause">')
			.addClass('form-control')
			.attr('type', 'button')
			.val('Pause')
			.attr('disabled', true)
			.click(function () {
				self.model.pause();
				Start.attr('disabled', true);
				Resume.removeAttr('disabled')
				text_input.attr('disabled', true);
			});

		var Stop = $('<input class="stop">')
			.addClass('form-control')
			.attr('type', 'button')
			.val('Stop')
			.attr('disabled', true)
			.click(function () {
				self.model.stop();
				Start.val('Start');
				Start.removeAttr('disabled');
				Pause.attr('disabled', true);
				Resume.attr('disabled', true);
				$(this).attr('disabled', true);
				text_input.val('');
				text_input.attr('disabled', true);
			});

		var Resume = $('<input class="resume">')
			.addClass('form-control')
			.attr('type', 'button')
			.val('Resume')
			.attr('disabled', true)
			.click(function () {
				self.model.start();
				text_input.removeAttr('disabled');
			});

		this.scoreBox = $('<label class="scorebox">')
			.text("Scores " + this.model.get('score'));

		$(this.el)
			.append(wrapper
			.append(Start)
			.append(Resume)
			.append(Pause)
			.append(Stop)
			.append(this.scoreBox))
			.append(wrapper
				.append($('<form>')
					.attr({
						role: 'form'
					})
					.submit(function () {
						return false;
					}).append(text_input)
				)
			);

		text_input.css({ left: (wrapper.width() - text_input.width()) / 2 + "px" });
		text_input.focus();

		this.listenTo(this.model, 'change', this.render);
	},

	render: function () {
		var model = this.model;
		var words = model.get('words');

		for (var i = 0; i < words.length; i++) {
			var word = words.at(i);
			if (!word.get('view')) {
				var word_view_wrapper = $('<div>');
				this.wrapper.append(word_view_wrapper);
				word.set({
					view: new WordView({
						model: word,
						el: word_view_wrapper
					})
				});
			} else {
				word.get('view').render();
			}
		}
		this.scoreBox.text(this.model.get('score') + " Scores")
	}
});

var Typer = Backbone.Model.extend({
	defaults: {
		max_num_words: 10,
		min_distance_between_words: 50,
		words: new Words(),
		score: 0,
		min_speed: 1,
		max_speed: 5,
		animation_delay: 1,
		iteration: null,
	},

	initialize: function () {
		new TyperView({
			model: this,
			el: $(document.body)
		});
		this.listenTo(this, 'pause', this.pause);
	},

	start: function () {
		var animation_delay = 30;
		var self = this;
		var interval = setInterval(function() {
			self.iterate();
		},animation_delay);
		self.set('iteration', interval)

	},

	pause: function () {
		clearInterval(this.get('iteration'));
	},

	stop: function () {
		clearInterval(this.get('iteration'));
		var words = this.get('words');
		for (var i = words.length - 1; i >= 0; i--) {
			words.remove(words.at(i));
		}
		this.set('score', 0);
	},

	iterate: function () {
		var words = this.get('words');
		if (words.length < this.get('max_num_words')) {
			var top_most_word = undefined;
			for (var i = 0; i < words.length; i++) {
				var word = words.at(i);
				if (!top_most_word) {
					top_most_word = word;
				} else if (word.get('y') < top_most_word.get('y')) {
					top_most_word = word;
				}
			}

			if (!top_most_word || top_most_word.get('y') > this.get('min_distance_between_words')) {
				var random_company_name_index = this.random_number_from_interval(0, company_names.length - 1);
				var string = company_names[random_company_name_index];
				var filtered_string = '';
				for (var j = 0; j < string.length; j++) {
					if (/^[a-zA-Z()]+$/.test(string.charAt(j))) {
						filtered_string += string.charAt(j);
					}
				}

				var word = new Word({
					x: this.random_number_from_interval(0, $(window).width()),
					y: 0,
					string: filtered_string,
					speed: (this.random_number_from_interval(this.get('min_speed'), this.get('max_speed')))
				});
				words.add(word);
			}
		}

		var words_to_be_removed = [];
		for (var i = 0; i < words.length; i++) {
			var word = words.at(i);
			word.move();
			if (word.get('y') > $(window).height() || word.get('move_next_iteration')) {
				words_to_be_removed.push(word);
			}

			if (word.get('highlight') && word.get('string').length == word.get('highlight')) {
				word.set({ move_next_iteration: true });
			}
		}

		for (var i = 0; i < words_to_be_removed.length; i++) {
			words.remove(words_to_be_removed[i]);
		}

		this.trigger('change');
	},

	random_number_from_interval: function(min,max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	}
});
