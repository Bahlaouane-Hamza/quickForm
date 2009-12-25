/*
---
description:     qkForm

authors:
  - Hamza Bahlaouane (http://quick2ouch.com)

license:
  - MIT-style license
  
Version: 
	1.0
	
requires:
  core/1.2.4:   '*'

provides:
  - qkForm
...
*/

	var QuickForm = new Class({
		Implements: Options,
		options: {
			speed:300,
			fx:Fx.Transitions.linear.easeOut
		},
		initialize: function(e,b){
			this.formContainerId = $(e);
			this.setOptions(b);
			
			// add qkFormdone class to the form
			if(this.formContainerId.hasClass('qkFormdone')) {return;}
			this.formContainerId.addClass('qkFormdone');

			
			// get all elements needed
			this.getSelects = this.formContainerId.getElements('select');
			this.getFields = this.formContainerId.getElements('input[type=text]');
			this.getButtons = this.formContainerId.getElements('input[type=submit], input[type=reset],input[type=button]');
			this.getTextareas = this.formContainerId.getElements('textarea');
			this.getCheckboxs = this.formContainerId.getElements('input[type=checkbox]');
			this.getRadios = this.formContainerId.getElements('input[type=radio]');	
			
			// start parsing
			this.parseButtons();
			this.parseTextareas();
			this.parseFields();
			this.parseCheckboxs();
			this.parseRadios();
			this.parseSelects();
		},
		parseButtons:function(){
			this.getButtons.each(function(item){
			
				// create new button element
				var newBtn = new Element('button', {
					'id': item.id,
					'name': item.name,
					'type': item.type,
					'class': 'qkFormButton',
					// add click event and hover
					'events': {
					/*
						'click': function(){
							newBtn.addClass('qkFormButton_click');
						},
						'blur': function(){
							newBtn.removeClass('qkFormButton_click');
						},
					*/
						'mouseover': function(){
            				newBtn.addClass('qkFormButton_hover');
						},
						'mouseleave': function(){
            				newBtn.removeClass('qkFormButton_hover');
						}
					}
				});
				
					// element & inserations
					var myFirstSpan  = new Element('span');
					var mySecondSpan  = new Element('span');
					mySecondSpan.appendText(item.value); 
					mySecondSpan.inject(myFirstSpan); 
					myFirstSpan.inject(newBtn); 
				
					newBtn.inject(item,'before');
					item.destroy();
					// i used inject then destroy because replaces won't work :(
				}); // for end's here 
		},
		
		parseTextareas:function(){
			this.getTextareas.each(function(textarea){
				if(textarea.hasClass('qkFormdone')) {return;}
				textarea.addClass('qkFormdone');

				var myDiv  = new Element('div');
				// prepare the html code and put it inside myDiv elemet , without using createElement a lot of time to create the table html code
				myDiv.set('html','<table cellspacing="0" cellpadding="0" border="0" class="qkFormTextarea" ><tr><td id="qkFormTextarea-tl"></td><td id="qkFormTextarea-tm"></td><td id="qkFormTextarea-tr"></td></tr><tr><td id="qkFormTextarea-ml">&nbsp;</td><td id="qkFormTextarea-mm"><div class="qkFormTextarea-placeholder"></div></td><td id="qkFormTextarea-mr">&nbsp;</td></tr><tr><td id="qkFormTextarea-bl"></td><td id="qkFormTextarea-bm"></td><td id="qkFormTextarea-br"></td></tr></table>');
		
				myDiv.inject(textarea,'before');
				textarea.inject(myDiv.getElement('.qkFormTextarea-placeholder'));
				if(textarea.get('html') == "") textarea.set('html','&nbsp;'); // fix bug on ie7 , textarea is too small when it is empty
				
				//tx_placeholder.set('html',tx_placeholder.get('html')+'</textrea>');
				
				
				// hover events
				
				myDiv.addEvents({
					'mouseover': function(){
						myDiv.getElement('table').addClass('qkFormTextarea-hover');
					},
					'mouseleave': function(){
            			myDiv.getElement('table').removeClass('qkFormTextarea-hover');
					}
				});
				
				
			});// for end's here 
		},
		
		parseFields:function(){
			this.getFields.each(function($input){
			
				if($input.hasClass('jqtranformdone')) {return;}
				$input.addClass('jqtranformdone');
		
		
				// setup deaut width
				var inputSize=$input.getSize().x;
				
					if($input.size){
						inputSize = $input.size*10;
						$input.setStyle('width',inputSize);
					}

				// add qkFormInput class
				$input.addClass("qkFormInput");

				// setup environment
				var myFirstDiv  = new Element('div',{'class':'qkFormInputWrapper'});
				var mySecondDiv  = new Element('div',{'class':'qkFormInputInner'});
				var myThirdDiv  = new Element('div');
				mySecondDiv.inject(myFirstDiv);
				myThirdDiv.inject(mySecondDiv);
				myFirstDiv.inject($input,'before');
				$input.inject(myThirdDiv);
			

				
				// var $wrapper = $input.getParent().getParent().getParent();
				var $wrapper = myFirstDiv;
				$wrapper.setStyle("width", inputSize+10);

				
				// focus & blur & hover events
				$input.addEvents({
					'focus': function(){
						$wrapper.addClass("qkFormInputWrapper_focus");
					},
					'blur': function(){
						$wrapper.removeClass("qkFormInputWrapper_focus");
					},
					'mouseover': function(){
						$wrapper.addClass("qkFormInputWrapper_hover");
					},
					'mouseleave': function(){
            				$wrapper.removeClass("qkFormInputWrapper_hover");
					}
				});

				/* If this is safari we need to add an extra class */
				if(Browser.Engine.webkit){
					$wrapper.addClass('qkFormSafari');
					$input.setStyle('width',getSize().x+16);
				}

			});// for end's here 
		},
		
		parseCheckboxs:function(){
			this.getCheckboxs.each(function($input){
				
				if($input.hasClass('qkFormHidden')) {return;}
				else{$input.addClass('qkFormHidden');}
				$input.setStyle('display','none'); // qkFormHidden won't work in some case , pfff !!
		
		
				// get the next label element , we need to position & add a click event to it
				var nextLabel = $input.getNext('label');
				if(nextLabel != null) nextLabel.setStyles({'cursor':'pointer','padding':'3px 0 0 2px'});
		
				// setup environment
				var mySpan = new Element('span',{'class':'qkFormCheckboxWrapper'});
				var myAnchor = new Element('a',{'class':'qkFormCheckbox'});
				myAnchor.inject(mySpan);

				
				// add qkFormChecked class when input is already checked , for loading stuff ... 
				if($input.getProperty('checked')){
					myAnchor.addClass('qkFormChecked');
				}
		
				// click event : add checked class & remove it
				myAnchor.addEvent('click',function(){
					if($input.getProperty('disabled')){return false;}
					myAnchor.addClass('qkFormChecked');
					
					if($input.getProperty('checked') && myAnchor.hasClass('qkFormChecked')){
						myAnchor.removeClass('qkFormChecked');
						$input.setProperty('checked',false);
					}
					else{
						$input.setProperty('checked','checked');
						myAnchor.addClass('qkFormChecked');
					}

					return false;
				});

				// next label element do the same thing as anchor, so no need the repeat the same event , just clone it
				nextLabel.cloneEvents(myAnchor,'click');
				
				// insert the element now
				mySpan.inject($input,'before');
				$input.inject(mySpan);
				
			});// for end's here 
		},
		
		parseRadios:function(){
			this.getRadios.each(function($input){
				
				if($input.hasClass('qkFormHidden')) {return;}
				else{$input.addClass('qkFormHidden');}
				$input.setStyle('display','none');
		
				var nextLabel = $input.getNext('label');
				if(nextLabel != null) nextLabel.setStyles({'cursor':'pointer','padding':'3px 0 0 2px'});
		
				var mySpan = new Element('span',{'class':'qkFormRadioWrapper'});
				var myAnchor = new Element('a',{'class':'qkFormRadio','rel':$input.name});
				myAnchor.inject(mySpan);

				if($input.getProperty('checked')){
					myAnchor.addClass('qkFormChecked');
				}
		

				myAnchor.addEvent('click',function(){
					if($input.getProperty('disabled')){return false;}
			
					// uncheck all others of same name input radio elements
					this.formContainerId.getElements('input[name="'+$input.getProperty('name')+'"]').each(function(rd){
						rd.setProperty('checked',false);
					});
					this.formContainerId.getElements('a[rel="'+$input.getProperty('name')+'"]').each(function(rd){
						rd.removeClass('qkFormChecked');
					});
											
					if($input.getProperty('checked') && myAnchor.hasClass('qkFormChecked')){
						myAnchor.removeClass('qkFormChecked');
						$input.setProperty('checked',false);
					}
					else{
						$input.setProperty('checked','checked');
						myAnchor.addClass('qkFormChecked');
					}

					

					return false;
				}.bind(this));
				
				nextLabel.cloneEvents(myAnchor,'click');
				
				mySpan.inject($input,'before');
				$input.inject(mySpan);
				
			}.bind(this)); // for end's here 
		},
		
		parseSelects:function(){
			this.getSelects.each(function($select,index){
				
				var $getSize = $select.getSize();
				var anchorMax = 1;
				var $hideAllMenusTimeout = null;
				
				if($select.hasClass('qkFormHidden')) {return;}
				if($select.multiple) {return;}
				$select.addClass('qkFormHidden');

				/* First thing we do is Wrap it */
				var myDiv  = new Element('div',{'class':'qkFormSelectWrapper'});
				myDiv.setStyle('zIndex',10-index);

				var mySecDiv = new Element('div');
				mySecDiv.inject(myDiv);
				var mySpan = new Element('span');
				mySpan.inject(mySecDiv);

				var myAnchor  = new Element('a',{'href':'#','class':'qkFormSelectOpen'});
				myAnchor.inject(mySecDiv);

				var myUl = new Element('ul',{'width':$getSize.x,'overflow':'none'});
				
				myUl.inject(myDiv);

				var $firstSpan = mySpan;
				var $ul = myUl;
		

		

				var currentY = 0;
				$select.getElements('option').each(function(op,i){
					var oli = new Element('li');
					oli.setStyle('margin',0);
					var oa = new Element('a',{'index':i});
					if(op.get('selected')) oa.addClass('selected');
					currentY+= $getSize.y;
					oa.set('rel',currentY);
					
					oa.appendText(op.get('html'));
					oa.inject(oli);
					oli.inject(myUl);
					anchorMax++;
				});

				
				
				$anchors = myUl.getElements('a');
				$open = myDiv.getElement('a.qkFormSelectOpen');

				// tween effect ( control ul height )
				var $myFx = new Fx.Tween($ul,{duration:this.options.speed,transition:this.options.fx});

				$anchors.each(function(iti){
					iti.addEvents({
						'click': function(){
							if(myDiv.getElement('a.selected')) myDiv.getElement('a.selected').removeClass('selected');
							iti.addClass('selected');
							if ($select[0].selectedIndex != iti.get('index') && $select[0].onchange) { $select[0].selectedIndex = iti.get('index'); $select[0].onchange(); }
							$select[0].selectedIndex = iti.get('index');
				
							// $firstSpan.set('text',iti.get('html')); // error on ie7 when using html method
							mySpan.set('text',iti.get('html'));
							$myFx.start('height', 0).chain(function(){ $ul.setStyle('display','none'); });
							$anchors.each(function(w){w.removeClass('hover');});
							return false;
						},				
						'mouseover': function(){
            					if($hideAllMenusTimeout) $clear($hideAllMenusTimeout);
								if(iti.hasClass('selected')){
									iti.removeClass('selected');
									iti.addClass('_selected');
								}
								iti.addClass('hover');

						},
						'mouseleave': function(){
								iti.removeClass('hover');
								if(iti.hasClass('_selected')){
									iti.removeClass('_selected');
									iti.addClass('selected');
								}
						}
					});

				});

				
				
				$anchors[$select.selectedIndex].fireEvent('click');
				mySpan.setStyle('width',$getSize.x);
		
				$open.addEvent('click',function(e){
					e.stop(); 
					if($hideAllMenusTimeout) $clear($hideAllMenusTimeout);
					$$(this.getSelects).fireEvent('hide');
					
					
					$anchors.each(function(w){w.removeClass('hover');});
					
					if($ul.getStyle('display') == 'none'){
						$ul.setStyle('display','block');
							if(anchorMax > 8){ 
								anchorMax = 8;
								$ul.setStyle('overflow','y');
							}
					
						// start tween effect
						$myFx.start('height', $getSize.y*anchorMax);

						// set timeout : if the menu is opened and nothing happen in the next 2 sec , hide the menu
						$hideAllMenusTimeout = (function(){
							$clear($hideAllMenusTimeout);
							$ul.fireEvent('hide');	
						}).delay(2000);

					}
					else{
						$myFx.start('height', 0).chain(function(){ $ul.setStyle('display','none');  });
					}
			
					// scroll to y cordinate when the menu is open
					myUl.scrollTo(0, myUl.getElement('a.selected').get('rel'));
					
					return false;

				}.bind(this));
				
				
				//  mouseleave , when leaving the contener div , hide the mneu
				/*
				myDiv.addEvent('mouseleave',function(){
						if($ul.getStyle('display') == 'block'){
							$hideAllMenusTimeout = (function(){
								$clear($hideAllMenusTimeout);
								$ul.fireEvent('hide');		
							}).delay(50);
						}
				});
				*/
				
				// first span & drop button are the same
				mySpan.cloneEvents($open, 'click');


				// hide event , no need to write this code everytime we want to hide menus , just firEvent the ul element
				$ul.addEvent('hide',function(){
					if($ul.getStyle('display') == 'block' && $hideAllMenusTimeout){
						$clear($hideAllMenusTimeout);
						$myFx.start('height', 0).chain(function(){ $ul.setStyle('display','none'); });
						$anchors.each(function(w){w.removeClass('hover');});
					}
				});


				// Set the new width
				var iSelectWidth = $getSize.x;
				var oSpan = mySpan;
				var newWidth = (iSelectWidth > oSpan.getSize().x)?iSelectWidth+$open.getSize().x:myDiv.getSize().x;
				myDiv.setStyle('width',newWidth+20);
				$ul.setStyle('width',(newWidth-2)+20);
				oSpan.setStyle('width',iSelectWidth+20);

				
				// insert the new select
				myDiv.inject($select,'before');
				$select.inject(myDiv);

			
			}.bind(this));// for end's here 
		}
	
	});