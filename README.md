Quick Form
=====

quickForm is a free plugin that allow you to skin your HTML forms using Mootools , inpired from iPhone & a clone to jqtransform

![Screenshot](http://quick2ouch.com/docs/qkForm/screenshot.png)

How to use
----------

qkForm can be initialized at any time but is generally initialized at the top of the document during the page's normal load.  It require an id of the form to skin it

### JavaScript

	var MyForm = new QuickForm('contact-form',{
		speed:300,
		fx:Fx.Transitions.linear.easeOut 
	});
	
contact-form is the form id that you want to apply skin on it