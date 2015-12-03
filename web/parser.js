
var Parser = {
    newInstance: function() {
        var obj = {
			nodes: [],
			uid: 1,

            run: function() {
				this.bindEvent();
            },

			bindEvent: function() {
				var self = this;
				$(document).on('mouseover', 'span.phonetic-char', function(e) {
					self._MouseOver.call(this, e);
				});
			},

			_MouseOver: function(e) {
				var target = $(this);
				console.log('phonetic: %s', target.data('phonetic'));
			},
			setMouseOver: function(val) {
				this._MouseOver = val;
				return this;
			},

			parse: function(node) {
				this.handleNode(node);
				return this;
			},

			handleNode : function(node) {
				if (!node) {
					return;
				}

				//https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
				if (node.nodeType == document.TEXT_NODE) {
					this.handleNode_Text(node);
				}

				if (!node.hasChildNodes()) {
					return;
				}

				for (var key=0, len=node.childNodes.length; key<len; key++) {
					this.handleNode(node.childNodes[key]);
				}
			},

			handleNode_Text: function(node) {
				var text = node.nodeValue;
				var list = text.split('');
				var len = list.length;
				var phonetic;

				if (len == 1) {
					phonetic = this.findAssignedPhonetic(node.parentNode);

					if (phonetic !== null) {
						return;
					}

					this.assignNodePhonetic(node);
					return;
				}

				this.wrapTempNode(node, this.uid++);

				var target = $(node.parentNode);

				target.html('');

				text = '';

				for (var key=0, val=null; key<len; key++) {
					val = list[key];
					var test = $.trim(val);
					if (!test)  { // 忽略空白字元或空白字串。
						text += val;
						continue;
					}

					text += this.assignTextPhonetic(val);
				}

				target.html(text);

			},

			findAssignedPhonetic: function(node) {

				var nodeName = node.nodeName.toLowerCase();
				if (nodeName!=='span') {
					return null;
				}

				var phonetic = node.getAttribute('data-phonetic');

				if (phonetic === null) {
					return null;
				}

				$(node).addClass('phonetic-char');

				//console.log('data-phonetic: %s', phonetic);
				return phonetic;
			},

			wrapTempNode: function(node, id) {
				return $(node).wrap('<span id="text_'+id+'"></span>');
			},

			assignNodePhonetic: function(node) {
				var phonetic = this.findPhonetic(node.nodeValue);
				return $(node).wrap('<span class="phonetic-char" data-phonetic="'+phonetic+'"></span>');
			},

			assignTextPhonetic: function(char) {
				var phonetic = this.findPhonetic(char);
				return '<span class="phonetic-char" data-phonetic="'+phonetic+'">'+char+'</span>';
			},

			findPhonetic: function(char) {
				var phonetic = window.chars[char];
				if (!phonetic) {
					phonetic = '';
				}
				return phonetic;
			},

            _End: 'Object Parser',
        };
        return obj;
    },
    getInstance: function() {
        if (this._Instance === null) {
            this._Instance = this.newInstance();
        }

        return this._Instance;
    },
    _Instance: null,
    _End: 'Class Parser'
};
