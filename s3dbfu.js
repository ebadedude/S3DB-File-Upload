/*
 * JavaScript S3DB File Upload 1.0.1
 * https://github.com/ebadedude/S3DB-File-Upload
 *
 * Copyright 2012, Bade Iriabho
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Namespace: s3dbfu
 * Depends on: 
 * 		JQuery [http://code.jquery.com/jquery-1.7.2.min.js], 
 * 		Twitter Bootstrap [https://github.com/twitter/bootstrap], 
 * 		JQuery File Upload [https://github.com/blueimp/jQuery-File-Upload],
 * 		JavaScript Templates [https://github.com/blueimp/JavaScript-Templates],
 * 		Javascript Load Image [https://github.com/blueimp/JavaScript-Load-Image],
 */

//String trim function definition
if(!String.hasOwnProperty('trim')) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,"");
	};
}

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
     // Use AMD.
        define(["jquery"], factory);
    } else {
     // Use browser globals.
        root.s3dbfu = factory(root.jQuery);
    }
}(this, function ($) {
	var _qparams, _buildtable, _jsonread, _delelement, _spinner, _getspinnerimg, _s3dburl='', _apikey='', _projid='', _collid='', _itemid='', _ruleid='', _logintype='', _username='', _json={}, _messages={};
	
	//TODO: use this to allow users to start application with querystring agruments
	_qparams = function() {
		var e,urlParams={},
		d = function (s) { return decodeURIComponent(s).replace(/\+/g, " "); },
		q = window.location.search.substring(1),
		r = /([^&=]+)=?([^&]*)/g;
		
		while (e = r.exec(q)) {
		    if (e[1].indexOf("[") == "-1") {
		    	urlParams[d(e[1])] = d(e[2]);
		    } else {
			    var b1 = e[1].indexOf("["),
			        aN = e[1].slice(b1+1, e[1].indexOf("]", b1)),
			        pN = d(e[1].slice(0, b1));
			  
			    if (typeof urlParams[pN] != "object") {
					urlParams[d(pN)] = {};
					urlParams[d(pN)].length = 0;
			    }
				if(aN) {
					urlParams[d(pN)][d(aN)] = d(e[2]);
				} else {
					Array.prototype.push.call(urlParams[d(pN)], d(e[2]));
				}
		    }
		}
		return urlParams;
	};
	
	_loadscript = function(src,parentid,id,type) {
		if(src && src.trim().length > 0) {
			var myscript = document.createElement('script');
			myscript.src = src;

			//Script Tag ID
			if(id && id.trim().length > 0) {
				myscript.id = id;
			}
			
			//Script Tag Type
			if(type && type.trim().length > 0) {
				myscript.type = type;
			} else {
				myscript.type = 'text/javascript';
			}
			
			//if parentid is not specified use the DOM Head Tag
			if(parentid && parentid.trim().length > 0) {
				var elem = document.getElementById(parentid);
				elem.appendChild(myscript);
			} else {
				var elem = document.getElementsByTagName('head')[0];
				elem.appendChild(myscript);
			}
		}
	};
	
	//type: right, left
	_padzero = function(str,len,type) {
		var diff='', mylen=str.trim().length;
		len = parseInt(len);
		
		if(mylen >= len) {
			return str;
		} else {
			for(var i=0; i < (len-mylen); i++) {
				diff += '0';
			}
			if(type.trim().toLowerCase() === 'right') {
				return str.trim()+diff;
			} else if(type.trim().toLowerCase() === 'left') {
				return diff+str.trim();
			} else {
				return str;
			}
		}
	};
	
	_buildtable = function(id, rows, cols) {
		var tb = document.createElement('table');
		tb.id=id;
		var tbh = document.createElement('thead');
		tbh.id=(id+'_thead');
		tb.appendChild(tbh);
		var tbd = document.createElement('tbody');
		tbd.id=(id+'_tbody');
		for (var i=1; i<=rows; i++) {
			var tr = document.createElement('tr');
			tr.id=(id+'_'+i);               
			for (var j=1; j<=cols; j++) {
				var td = document.createElement('td');
				td.id=(id+'_'+i+'_'+j);
				tr.appendChild(td);
			}
			tbd.appendChild(tr);
		}
		tb.appendChild(tbd);
		return tb;
	};
	
	_jsonread = function(src,id,nexteval) {
	    // Read JSON data structure formated as s3db_json()
	    _json.done=0;
	    _json.nexteval=nexteval;
	    
	    var headID = document.getElementsByTagName("head")[0];
	    var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = src;
	    script.id = id;
	    script.defer=false;

	    _json.id = id;
	    _json.query = src;
	    
	    headID.appendChild(script); 
	};
	
	_delelement = function(id) {
	    var e = document.getElementById(id);
	    if (e) {e.parentNode.removeChild(e);}
	};

	//generate and return a spinner image
	_getspinnerimg = function() {
		var spinner = new Image();
		spinner.alt = "";
		spinner.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABK1JREFUeNqMVt1ZGzkUvVfS4IW1l8GO82w6IBXE7mCpAFMB+Pt4Z6iApALcAe4AU0HoAJfg7BPYHinnXmmciX+y0YdmJHnQ0bk/R5cvh5cUyFPwRD4EChgEvGWMB36R3+JaiTkmD5gOs8yNb25uLlerFf1pM2yIGA82TEY7xow1oj4GBU6S6yywPNG4JwDH+XGv0Whs7ndN8n97mmPsLCSYgy7ImPQE/pFDyAF+7L0fgTNFUDBcLal90taD1doQ/T6NT9DnW8zkT+jJuQVYukG3hifCVk/L3JOxMBa8VVlSp9MhHKLaB+zpNo1fdgEpmByuMqUAV5viOQLwXNax9KBAFNEEpN1pUwnQmvl6aTza6zNjrCKaymeyOdYAMgfg18iG4T/qw+AC94zvpzDjcwqOXo3VGH26H0xMZ7jPxgT0R2zUi4BYt6bAfEbJvJFZKA4ODgZ5nhcJLE9mk35X21vWC/TXKmiwr2xszoQd/PQv3t/QCzY2twpqBpb5FKOp+hCgzWaTWq0W1Xx0ij5An9WC5VtiLMwvNBrVaSGMvQk5jHQVPN7sb0HzAtE+QJrNgrcUNEARieWCut0ugR0tl8sKcJ5Ahc3jRviPK8ZGTaaBwGKyT+gTiwM4a3Jrba6MbeVXo5F4kp9shn29ndUYC9vLirGDXzRhrYhD8DME5Hkg22df5rDYS/RXmVIsaP/Q/SXs600YnifTjbeSWliEdTYb3QyTqYfdDKTL4B1KS6tVqf6SgGq3P9BvZGpvNIrPCgVKZlGlCDQDxJiCjVppCab05DJHzb+b1Gm36X80cVjLuzozexs0f6IgRkA5XRhzIixRL1+IzhwdHVHrn1Y9oXe1i10aKT6bGGhg1CKK+cT0zCGCs0oXTIogybJMw/779//o48duMvnO9rzLn+Kz8wgS5Shqo4njpCoOQA5Ajb8adHh4SMvVghaLhYb/HsBip88krNVISSEigOlhjmi0LziNhr6wOsgO9C1339vbGznnNAU2AM9Svk235cqKieKGkldAf7DGvTrjnjJnzyQoMu0ZTuZgUqvmlYR+f39XIE4uqCX1E/rDZpCYmKwOOmivAfYK9KF1AM7EdG4uAMLAOjmQideQXOJQkyUisqYiFRhtSFbxCxj8do0T30dmTvLhC+an0MZZVBHX09tBTG4qFigZEJEChjTIEwtRik81Qa7uOQU0IrYAe7FRjqYw6SlYjgAyN1GmHsFIGPfVnxzFuFITKEkfYK+oWZ5qKlIkcZ7UE92oXBmeIgIxtAO5UtSHqo9uiLW+sme5ejSIRASeAFR4LYy8MMzL1aq3EYWzJF28BgMEzGYpBkrMKelgl+P6uTcVY8NjLYyYPwMTCcufSaouH6al9xNJcjC82vDb9uVZKbrWIumNO+waVsu1TCC+Wxcg6xaSpsZSYM2wLO9/U8qZWH+wztQnsfAxV/E3MIKZVf1FsmJVV8mamhEmxZ0X7sSsABsGv1tZJGejmptU7FBUDYzPAXQBwFEEl+9+stFEroJEci2ELwIMmZuWoSTE9DYYcWVCjlJrZWMpeBhlAEqBiulPE84S3ixU5gSTwGGOdyEVNJXxA8nPevshwABHktBS1YoQ+QAAAABJRU5ErkJggg=='; // Set source path
		return spinner;
	};

	//NOTE: Built to allow just one spinner session at a time so ideally 
	//		you won't need two spinners going on at the same time 
	_spinner = {
			'intid':'',
			'rotation':0,
			'image':_getspinnerimg(), 
			'currentid':'',
			'displaytext':''
		};
	
	return {
		s3dburl:function() { return _s3dburl; },
		apikey:function() { return _apikey; },
		projectid:function() { return _projid; },
		collectionid:function() { return _collid; },
		itemid:function() { return _itemid; },
		ruleid:function() { return _ruleid; },
		username:function() { return _username; },
		loginmenu:function() {
			$("#username").text(_username);
			$("#user-access-options")
				.empty()
				.append($('<li></li>')
					.append($('<a></a>')
						.attr('href','javascript:window.location.reload();void(0);')
						.text("Sign Out")))
				.append($('<li></li>')
					.addClass('divider'))	
				.append($('<li></li>')
					.append($('<a></a>')
						.attr('href','javascript:void(0);')
						.text('KEY: '+_apikey)

			));
			$("#s3db-instance").text("connected to " + _s3dburl);
		},
		loadmodals:function() {
			var unCode='luntbl', akCode='laktbl', hasS3DBUrl=false, loginUN, loginAK;
			
			if(_s3dburl.trim().length > 0) {
				hasS3DBUrl = true;
			}
			loginUN = _buildtable(unCode, 4, 2);
			loginAK = _buildtable(akCode, 3, 2);

			
			//login username
			$("<div></div>")
				.addClass('modal hide')
				.attr('id', 'loginUN')
				.append($("<div></div>")
						.addClass('modal-header')
						.append($("<button></button>")
								.addClass('close')
								.attr('type', 'button')
								.attr('data-dismiss','modal')
								.html('&times;'))
						.append($("<h3></h3>").text('S3DB Login')))
				.append($("<div></div>")
						.addClass('modal-body')
						.append(loginUN))
				.append($("<div></div>")
						.addClass('modal-footer')
						.append($("<a></a>")
								.attr('href',"javascript:s3dbfu.s3dblogin('loginUN')")
								.attr('id','unlogin')
								.addClass('btn btn-primary')
								.text('Login'))
						.append($("<a></a>")
								.attr('href','#')
								.attr('data-dismiss','modal')
								.addClass('btn')
								.text('Cancel'))).appendTo("body");
			
			$('#'+unCode+'_1_1').html('<p>S3DB URL: </p>');
			$('#'+unCode+'_2_1').html('<p>Username: </p>');
			$('#'+unCode+'_3_1').html('<p>Password: </p>');
			if(hasS3DBUrl) {
				$('#'+unCode+'_1_2').html('<p>'+_s3dburl+' (<i class="icon-pencil"></i><span style="font-size:.7em;"><a href="javascript:s3dbfu.changes3dburl(1);">change</a></span>)</p>');
			} else {
				var a_input1 = document.createElement("input");
				a_input1.type = "text";
				a_input1.id = "un_s3dburi";
				document.getElementById(unCode+'_1_2').appendChild(a_input1);
			}
			var a_input1_2 = document.createElement("input");
			a_input1_2.type = "hidden";
			a_input1_2.id = "un_s3dburi_f";
			document.getElementById(unCode+'_1_1').appendChild(a_input1_2);
			var a_input2 = document.createElement("input");
			a_input2.type = "text";
			a_input2.id = "l_username";
			document.getElementById(unCode+'_2_2').appendChild(a_input2);
			var a_input3 = document.createElement("input");
			a_input3.type = "password";
			a_input3.id = "l_password";
			document.getElementById(unCode+'_3_2').appendChild(a_input3);
			var a_canvas1 = document.createElement("canvas");
			a_canvas1.id = "cv_unspin";
			a_canvas1.height = 5;
			a_canvas1.width = 5;
			document.getElementById(unCode+'_4_2').appendChild(a_canvas1);
			
			//login api key
			$("<div></div>")
			.addClass('modal hide')
			.attr('id', 'loginAK')
			.append($("<div></div>")
					.addClass('modal-header')
					.append($("<button></button>")
							.addClass('close')
							.attr('type', 'button')
							.attr('data-dismiss','modal')
							.html('&times;'))
					.append($("<h3></h3>").text('S3DB Login')))
			.append($("<div></div>")
					.addClass('modal-body')
					.append(loginAK))
			.append($("<div></div>")
					.addClass('modal-footer')
					.append($("<a></a>")
							.attr('href',"javascript:s3dbfu.s3dblogin('loginAK')")
							.attr('id','aklogin')
							.addClass('btn btn-primary')
							.text('Login'))
					.append($("<a></a>")
							.attr('href','#')
							.attr('data-dismiss','modal')
							.addClass('btn')
							.text('Cancel'))).appendTo("body");

			$('#'+akCode+'_1_1').html('<p>S3DB URL: </p>');
			$('#'+akCode+'_2_1').html('<p>API Key: </p>');
			if(hasS3DBUrl) {
				$('#'+akCode+'_1_2').html('<p>'+_s3dburl+' (<i class="icon-pencil"></i><span style="font-size:.7em;"><a href="javascript:s3dbfu.changes3dburl(2);">change</a></span>)</p>');
			} else {
				var b_input1 = document.createElement("input");
				b_input1.type = "text";
				b_input1.id = "ak_s3dburi";
				document.getElementById(akCode+'_1_2').appendChild(b_input1);
			}
			var b_input1_2 = document.createElement("input");
			b_input1_2.type = "hidden";
			b_input1_2.id = "ak_s3dburi_f";
			document.getElementById(akCode+'_1_1').appendChild(b_input1_2);
			var b_input2 = document.createElement("input");
			b_input2.type = "text";
			b_input2.id = "l_apikey";
			document.getElementById(akCode+'_2_2').appendChild(b_input2);
			var b_canvas1 = document.createElement("canvas");
			b_canvas1.id = "cv_akspin";
			b_canvas1.height = 5;
			b_canvas1.width = 5;
			document.getElementById(akCode+'_3_2').appendChild(b_canvas1);
		},
		s3dblogin:function(type) {
			var s3dburl_input, username_input, password_input, apikey_input;
			
			username_input = $("#l_username").val().trim();
			password_input = $("#l_password").val().trim();
			apikey_input = $("#l_apikey").val().trim();
			_logintype = type;

			if(type == 'loginUN') {
				s3dburl_input = $("#un_s3dburi").val();
			} else {
				s3dburl_input = $("#ak_s3dburi").val();
			}

			if(typeof s3dburl_input === "undefined") { s3dburl_input = _s3dburl; }
			if(s3dburl_input.trim().length > 0) {
				if(s3dburl_input.trim().substr(s3dburl_input.trim().length-1,1)== "/"){
					s3dburl_input = s3dburl_input.trim().substr(0,s3dburl_input.trim().length-1);
					_s3dburl = s3dburl_input;
				}
			}
			if(s3dburl_input.trim().length > 0) {
				if(s3dburl_input.trim().substr(0,7).toLowerCase() === "http://"){
					//do nothing
				} else if(s3dburl_input.trim().substr(0,8).toLowerCase() === "https://") {
					//do nothing
				} else {
					s3dburl_input = 'http://'+s3dburl_input;
					_s3dburl = s3dburl_input;
				}
			}
			
			if(type == 'loginUN') {
				$("#un_s3dburi_f").val(s3dburl_input);
				_jsonread(s3dburl_input+'/URI.php?format=json&callback=s3dbfu.jsonexec','s_un_url',"s3dbfu.s3dblogin_un('"+username_input+"','"+password_input+"')");
			} else {
				$("#ak_s3dburi_f").val(s3dburl_input);
				_jsonread(s3dburl_input+'/URI.php?format=json&callback=s3dbfu.jsonexec','s_un_url',"s3dbfu.s3dblogin_ak('"+apikey_input+"')");
			}
		},
		s3dblogin_un:function(uname,pass){
			var s3dburl_input = $("#un_s3dburi_f").val();
			_jsonread(s3dburl_input+"/apilogin.php?username="+uname+"&password="+pass+"&format=json&callback=s3dbfu.jsonexec",'s_un_login',"s3dbfu.s3dblogin_result('un')");
		},
		s3dblogin_ak:function(apikey) {
			var s3dburl_input = $("#ak_s3dburi_f").val();
			_jsonread(s3dburl_input+'/URI.php?format=json&key='+apikey+'&callback=s3dbfu.jsonexec','s_ak_login',"s3dbfu.s3dblogin_result('ak')");
			_apikey = apikey;
		},
		s3dblogin_result:function(type) {
			if(_json.data[0].error_code) {
				_apikey = '';
				if(type === 'un') {
					_messages.login = "Could not verify username and password combination with S3DB server. Please re-enter your values.";
					console.log(_messages.login);
					//TODO: do user GUI messages
				} else { 
					_messages.login = "Specified API key could not be found in the S3DB server. if your key is expired or you cannot remember it, use your username and password.";
					console.log(_messages.login);
					//TODO: do user GUI messages
				}
			} else {
				if(type === 'un') {
					console.log("successful login...");
					console.log("New API key generated ["+_json.data[0].key_id+"]...");
					$("#ak_s3dburi_f").val($("#un_s3dburi_f").val());
					s3dbfu.s3dblogin_ak(_json.data[0].key_id);
				} else {
					console.log("successful key validation...");
					_username = _json.data[0].fullname;
					s3dbfu.loginmenu();
					s3dbfu.hidemodal(_logintype);
					$("#fileupload").attr('action', _s3dburl+'/multiupload.php?key='+_apikey+'&collection_id='+_collid+'&rule_id='+_ruleid+'&format=json');
			        // Load S3DB's existing files for the specified collection:
			        $('#fileupload').each(function () {
			            var that = this;
			            $.getJSON(this.action, function (result) {
			                if (result && result.length) {
			                	var tmp_str,tmp_str1,reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?\^=%&amp;:\/~\+#]*[\w\-\@?\^=%&amp;\/~\+#])?/;
								for(var i=0; i < result[0].message.result.length; i++) {
									tmp_str = result[0].message.result[i].value.replace(' ', '');
									tmp_str1 = tmp_str.match(reg);
									if(tmp_str1 && tmp_str1.length > 0) {
										result[0].message.result[i].download_url = tmp_str1[0];
									} else {
										result[0].message.result[i].download_url = '#';
									}
									//fix delete button
									
								}
			                    $(that).fileupload('option', 'done')
			                        .call(that, null, {result: result[0].message.result});
			                }
			            });
			        });
				}
			}
		},
		showmodal:function(str) {
			if(str && (str=='loginUN' || str=='loginAK')) {
				$("#"+str).modal('show');
		//		s3dbfu.startspinner('cv_unspin',15);
		//		setTimeout("s3dbfu.stopspinner()",20000);
			}
		},
		hidemodal:function(str) {
			if(str && (str=='loginUN' || str=='loginAK')) {
				$("#"+str).modal('hide');
			}
		},
		jsonexec:function(data) {
			_json.data = data;
			_json.done = 1;
		    try {
		    	eval(_json.nexteval);
		    } catch (err) {
		    	_messages.login = "Could not establish connection to S3DB.";
		    	console.log(_messages.login);
		    	//TODO: do user GUI messages
		    	_json.done = 0; // evaluation check failed so this call is not complete
		    }       
		    _delelement(_json.id);
		},
		changes3dburl:function(type) {
			var unCode='luntbl', akCode='laktbl';
			type = parseInt(type);
			
			var input1 = document.createElement("input");
			input1.type = "text";
			input1.value = _s3dburl;
			if(type==1) {
				input1.id = "un_s3dburi";
				$('#'+unCode+'_1_2').html('');
				document.getElementById(unCode+'_1_2').appendChild(input1);
			} else {
				input1.id = "ak_s3dburi";
				$('#'+akCode+'_1_2').html('');
				document.getElementById(akCode+'_1_2').appendChild(input1);
			}
		},
		//draw spinner on specified canvas id (id) and size (s)
		//sugested width and height of included image is 27px
		drawspinner:function(id,s) {
			s = parseInt(s);
			var s2 = s/2;
			
			//set canvas size
			var cv = document.getElementById(id);
			cv.width = s;
			cv.height = s;
			
			//draw image
			var ctx = document.getElementById(id).getContext('2d');
			ctx.globalCompositeOperation = 'destination-over';
			ctx.save();
			ctx.clearRect(0,0,s,s);
			ctx.translate(s2,s2); // to get it in the origin
			_spinner.rotation +=1;
			ctx.rotate(_spinner.rotation*Math.PI/64); //rotate in origin
			ctx.translate(-s2,-s2); //put it back
			ctx.drawImage(_spinner.image,0,0,s,s);
			ctx.restore();
		},
		startspinner:function(id,s) {
			var disptext = _spinner.displaytext;	//" working...";
			_spinner.currentid = id;
			
			var txt = document.createElement('span');
			txt.id = id+"_txt";
			txt.innerHTML = disptext;
			
			var cv = document.getElementById(id);
			if (cv) {cv.parentNode.appendChild(txt);}
			
			_spinner.intid = setInterval("s3dbfu.drawspinner('"+id+"',"+s+")",10);
		},
		stopspinner:function() {
			clearInterval(_spinner.intid);
			_delelement(_spinner.currentid+"_txt");
			
			var cv = document.getElementById(_spinner.currentid);
			cv.width = 5;
			cv.height = 5;
			cv.getContext('2d').clearRect(0, 0, 5, 5);
			
			_spinner.rotation = 0;
		},
		init:function(data) {
			if(data.s3dburl && data.s3dburl.trim().length > 0) {
				_s3dburl = data.s3dburl;
			}
			if(data.projectid && data.projectid.trim().length > 0) {			//NOTE: Future Use
				_projid = data.projectid;
			}
			if(data.collectionid && data.collectionid.trim().length > 0) {		//NOTE: Future Use
				_collid = data.collectionid;
			}
			if(data.itemid && data.itemid.trim().length > 0) {
				_itemid = data.itemid;
			}
			if(data.ruleid && data.ruleid.trim().length > 0) {
				_ruleid = data.ruleid;
			}
			if(data.spinnertext && data.spinnertext.trim().length > 0) {
				_spinner.displaytext = data.spinnertext;
			} else {
				_spinner.displaytext = " working...";
			}
			s3dbfu.loadmodals();
		}
	};	
}));