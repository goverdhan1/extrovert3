'use strict'

angular.module('extrovertApp').value('EmpValue', {

	channels: [
		{value:'AERS'},
		{value:'ARS'},
		{value:'Consulting'},
		{value:'CSDI'},
		{value:'Federal'},
		{value:'Finance'},
		{value:'Finance-BPM'},
		{value:'ITS'},
		{value:'Leader'},
		{value:'Market Development'},
		{value:'PMO'},
		{value:'SES Core'},
		{value:'Tax'},
		{value:'Talent'},
		{value:'WSG'}
	],
	cops: [
		{value:'Architecture'},
		{value:'BSA'},
		{value:'Software'},
		{value:'Specialist'},
		{value:'TDM'},
		{value:'QPE'}
	],
	initiativeTypes: ['Firm level', 'DAS Level','Channel Level','CoP Level','One Technology Level']
})