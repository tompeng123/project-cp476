(function(win,tcf){
		var doc    		= win.document;
		var docEl  		= doc.documentElement; 
		var metaEl 		= doc.querySelector('meta[name="viewport"]');
		var dpr    		= 0;
		var scale  		= 0;
		var handler	 	= null;

		var flexible = tcf.flexible || (tcf.flexible = {});

	

		if (!metaEl) {
			metaEl = doc.createElement('meta');
	        metaEl.setAttribute('name', 'viewport');
	        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale +',user-scalable=no');
	        if (docEl.firstElementChild) {
	            docEl.firstElementChild.appendChild(metaEl);
	        } else {
	            var wrap = doc.createElement('div');
	            wrap.appendChild(metaEl);
	            doc.write(wrap.innerHTML);
	        }
	    }

	    docEl.setAttribute('data-dpr', dpr);

		var setFontSize = function(){
			var width = docEl.getBoundingClientRect().width;
	        if (width / dpr > 480) {
	            width = 540 * dpr;
	        }
	        var rem = width / 10;
	        rem = Math.max(rem,32);
			docEl.style.fontSize =  rem+'px';
			flexible.width = width;
			flexible.rem = win.rem = rem;
		};

		['resize','orientationchange'].forEach(function(item){
			win.addEventListener(item, function(e) {
		        clearTimeout(handler);
		        handler = setTimeout(setFontSize, 300);
		    }, false);
		})

	    win.addEventListener('pageshow', function(e) {
	        if (e.persisted) {
	            clearTimeout(handler);
	            handler = setTimeout(setFontSize, 300);
	        }
	    }, false);

	    if (doc.readyState === 'complete') {
	    	
	        doc.body.style.fontSize = 12 * dpr + 'px';
	    } else {
	        doc.addEventListener('DOMContentLoaded', function(e) {
	            doc.body.style.fontSize = 12 * dpr + 'px';

	        }, false);
	    }
    
    	setFontSize();

	    flexible.dpr = win.dpr = dpr;
	    flexible.setFontSize = setFontSize;
	    flexible.rem2px = function(d) {
	        var val = parseFloat(d) * this.rem;
	        if (typeof d === 'string' && d.match(/rem$/)) {
	            val += 'px';
	        }
	        return val;
	    }
	    flexible.px2rem = function(d) {
	        var val = parseFloat(d) / this.rem;
	        if (typeof d === 'string' && d.match(/px$/)) {
	            val += 'rem';
	        }
	        return val;
	    }

}(window,window['tcf'] || (window['tcf'] = {})))