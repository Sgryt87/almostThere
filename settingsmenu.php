<?php 

// Settings Menu by LuckyMonkey
// Keep Settings here, not information!

// Description: A modular menu that slides in from the right when the user clicks on "Settings Menu" located on the right side of the NavBar on all pages
// The menu will contain options for the user to change related to the site in order to ensure they have the best viewing experience

// Example Structure of the HTML and CSS of the Settings Menu, Including the current options for the menu that will be added.
/*

<ul>
	<li>
		<div class='settingsIcon'><a class='icn icon-phone'>&nbsp;</a></div>
		Sounds
		<div class='setSwitch'>ON</div>
	</li>
	<li>
		<a class='icn icon-phone'>&nbsp;</a>
		Mobile View
		<div class='settingsSwitch'>ON</div>
	</li>
	<li>
		<a class='icn icon-bug'>&nbsp;</a>
		Debug Mode
		<ul>
			<li>Advanced Graphics</li>
			<li>Console Output</li>
			<li>Auto Refresh</li>
			<li>Bug Reporter</li>
		</ul>
		<div class='settingsSwitch'>ON</div>
	</li>
	<li>Privacy Mode</li>
	<li>
		Color Picker
	</li>
	<li></li>
	<li>
		Resize Page
	</li>
</ul>
*/

// #settingsMenu {width:200px;background:#333333;}
// .setting {height:40px;overflow:hidden;margin:1px 0px 0px 0px;background:#222222;}
//
// .settingIcon {height:38px;width:38px;font-size:35px;margin:2px;float:left;border-radius:5px;border 1px solid #222222;}
// .settingTitle {font-size:35;font-family: NeoSans;}
// .settingSwitch {border-radius:5px;border 1px solid #222222;}

// 3 different types of settings

// Simple Settings involving a toggle switch (boolean only)
// Option Settings involving a setting with sub options (boolean only)
// Advanced Settings involving an interger, or value and a custom sub option such as a slider or color picker.

// Each setting will have different variables appended to them
// Default Value of the setting - The value that the setting is given before a user changes it
// Min and Max Value of the setting -  Ordered Pair containing both the smallest and largest intergers that the setting is allowed to be
// Type of Setting (Boolean, Interger, and Value)

class setting {
	public $settingTitle	= "No Setting";
	public $settingID		= "nosetting";	
	public $settingIcon	    = "icon-close";
	public $settingDefault	= "0";

	function build() {
		echo "`<div class='setting' id='" . $this->settingID . "'>
					<div class='settingIcon theBGcolor'><a class='icn " . $this->settingIcon . "'></a></div>
					<div class='settingTitle'>" . $this->settingTitle . "</div>
					<div class='settingSwitch'>" . $this->settingDefault . "</div>
				</div>	";
	}
	//function getData() {};
	//function loadValue() {};
	//function parsePair() {};
}

class settingInterger extends setting {
	public $settingTitle	= "No Setting";
	public $settingID		= "nosetting";	
	public $settingIcon	    = "icon-close";
	public $settingType		= "bool";
	public $settingDefault	= "0";
	public $settingMinMax	= "(0,512";
}

class settingOptions extends setting {
	public $settingTitle	= "";
	public $settingID		= "";
	public $settingIcon	    = "";
	public $settingType		= "";
	public $settingDefault	= "";
	public $settingMinMax	= "";
	public $subObject1		= "";
	public $subObject2		= "";
	public $subObject3		= "";
	public $subObject4		= "";
}

class settingAdvanced extends setting {
	public $settingTitle	= "";
	public $settingID		= "";
	public $settingIcon	    = "";
	public $settingType		= "";
	public $settingDefault	= "";
	public $settingMinMax	= "";
	public $subObject1		= "";
}

class settingColorPicker extends settingAdvanced {

}

// SUDDENLY DUBSTEP WUBWUBWUBWUBWUBWOOOWUBWUZZUZUZUZUZUZUZWUBWUBWUBWUBWUB wooo wooo WUZZ WUZZ wonk wonk womp womp zooo zooo WUBWUBWUBWUBWUBWUB

?>