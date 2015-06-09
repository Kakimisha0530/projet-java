/***************************************************************************************
	JavaScript Calendar - Digital Christian Design
	//Script featured on and available at JavaScript Kit: http://www.javascriptkit.com
	// Functions
		changedate(): Moves to next or previous month or year, or current month depending on the button clicked.
		createCalendar(): Renders the calander into the page with links for each to fill the date form filds above.
			
***************************************************************************************/

var thisDate = 1;							// Tracks current date being written in calendar
var today = new Date();						// Date object to store the current date
var todaysDay = today.getDay();// + 1;					// Stores the current day number 1-7
var todaysDate = today.getDate();					// Stores the current numeric date within the month
var todaysMonth = today.getMonth() + 1;				// Stores the current month 1-12
var todaysYear = today.getFullYear();					// Stores the current year
var monthNum = todaysMonth;						// Tracks the current month being displayed
var yearNum = todaysYear;						// Tracks the current year being displayed
var firstDate = new Date(yearNum , monthNum-1 , 1 , 0 , 0 , 0 , 0);	// Object Storing the first day of the current month
var firstDay = firstDate.getDay();				// Tracks the day number 1-7 of the first day of the current month
var lastDate = new Date(String(monthNum+1)+"/0/"+String(yearNum));	// Tracks the last date of the current month
var numbDays = 0;
var calendarString = "";
var eastermonth = 0;
var easterday = 0;
var numberDays = daysInMonth(monthNum, yearNum);
var ac_list = {};

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}


function changedate(buttonpressed,dateStr) {
	if (buttonpressed == "prevyr") yearNum--;
	else if (buttonpressed == "nextyr") yearNum++;
	else if (buttonpressed == "prevmo") monthNum--;
	else if (buttonpressed == "nextmo") monthNum++;
	else  if (buttonpressed == "return") { 
		monthNum = getDatMonth;
		yearNum = getDatYear;
	}
	else if(dateStr){
		var tab = parseDateStr(dateStr);
		monthNum = parseInt(tab[1]);
		yearNum = parseInt(tab[0]);
	}

	if (monthNum == 0) {
		monthNum = 12;
		yearNum--;
	}
	else if (monthNum == 13) {
		monthNum = 1;
		yearNum++
	}

	lastDate = new Date(String(monthNum+1)+"/0/"+String(yearNum));
	numbDays = lastDate.getDate();
	numberDays = daysInMonth(monthNum,yearNum);
	firstDate = new Date(String(monthNum)+"/1/"+String(yearNum));
	firstDay = firstDate.getDay();
	createCalendar();
	return;
}


function easter(year) {
// feed in the year it returns the month and day of Easter using two GLOBAL variables: eastermonth and easterday
var a = year % 19;
var b = Math.floor(year/100);
var c = year % 100;
var d = Math.floor(b/4);
var e = b % 4;
var f = Math.floor((b+8) / 25);
var g = Math.floor((b-f+1) / 3);
var h = (19*a + b - d - g + 15) % 30;
var i = Math.floor(c/4);
var j = c % 4;
var k = (32 + 2*e + 2*i - h - j) % 7;
var m = Math.floor((a + 11*h + 22*k) / 451);
var month = Math.floor((h + k - 7*m + 114) / 31);
var day = ((h + k - 7*m +114) % 31) + 1;
eastermonth = month;
easterday = day;
}


function createCalendar() {
	var url_ = GLOBAL_host + "bytoken/activites?token=" + localStorage.getItem("ls.token");
	url_ += "&debut=" + parseDate(1,monthNum,yearNum) + "&fin=" + parseDate(numberDays,monthNum,yearNum);
	url_ += "&mois=1";
	//alert(JSON.stringify(url_));
	$.getJSON(url_,function(data_){
		//alert(JSON.stringify(data_));
	}).done(function(data_){
		if(data_.message.type.toLowerCase() == "ok")
			ac_list = data_.donnees;
		
		calendarString = '';
		var daycounter = 0;
		calendarString += '<table class="DatPick" border="0" cellpadding="0" cellspacing="0">';
		calendarString += '<thead><tr>';
		//calendarString += '<td align=\"center\" valign=\"center\" width=\"40\" height=\"40\"><a href=\"#\" onClick=\"changedate(\'prevyr\')\">Prev Y<\/a><\/td>';
		calendarString += '<td align=\"center\" valign=\"center\" class="btnPrev"><a href=\"#\" onClick=\"changedate(\'prevmo\')\">Prev Mo<\/a><\/td>';
		calendarString += '<td align=\"center\" valign=\"center\"colspan=\"5\" class="curentMonth">';
		calendarString += '<select class=\"select_box\" id=\"choix_mois\" onchange=\"reloadCalendar();\">';
		$.each(wordMonth,function(ke,val){
			calendarString += '<option value=\"' + ke + '\"' + ((ke == monthNum-1)?'selected':"") + '>' + val + '</option>';
		});
		calendarString += '<\/select><select class=\"select_box\" id=\"choix_an\" onchange=\"reloadCalendar();\").val()));createCalendar();\">';
		for(var an = Number(yearNum) - 5;an <= Number(yearNum) + 5;an++){
			calendarString += '<option value=\"' + an + '\"' + ((an == yearNum)?'selected':"") + '>' + an + '</option>';
		}
		calendarString += '<\/select><\/td>';
		calendarString += '<td align=\"center\" valign=\"center\" class="btnNext"><a href=\"#\" onClick=\"changedate(\'nextmo\')\">Next Mo<\/a><\/td>';
		//calendarString += '<td align=\"center\" valign=\"center\" width=\"40\" height=\"40\"><a href=\"#\" onClick=\"changedate(\'nextyr\')\">Next Y<\/a><\/td>';
		calendarString += '<\/tr>';
		calendarString += '<tr>';
		
		calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">L<\/td>';
		calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">M<\/td>';
		calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">M<\/td>';
		calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">J<\/td>';
		calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">V<\/td>';
		calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">S<\/td>';
		calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">D<\/td>';
		calendarString += '<\/tr><\/thead>';
		calendarString += '<tbody>';

		thisDate == 1;

		for (var i = 1; i <= 6; i++) {
			if(daycounter < numberDays){
				calendarString += '<tr>';
				for (var x = 1; x <= 7; x++) {
					daycounter = (thisDate - firstDay)+1;
					thisDate++;
					if ((daycounter > numberDays) || (daycounter < 1)) {
						calendarString += '<td align=\"center\" class="day off">&nbsp;<\/td>';
					}
					else
					{
						var d_today = (((todaysDay == x) && (todaysDate == daycounter) && (todaysMonth == monthNum))?" today":"");
						var has_activity = "";/*(checkevents(daycounter,monthNum,yearNum,i,x)?" on":" off");
						if(parseDate(daycounter,monthNum,yearNum) == Number(dateCur))
							has_activity += " selected";
							href=\"javascript:showevents(' + daycounter + ',' + monthNum + ',' + yearNum + ',' + i + ',' + x + ')\"
							*/
						calendarString += '<td align=\"center\" class="day' + has_activity + d_today + '">';
						calendarString += '<a onclick="changeview(\'' + parseDate(daycounter,monthNum,yearNum) + '\');">' + daycounter + '<\/a>';
						if(ac_list[parseDate(daycounter,monthNum,yearNum)]){
							calendarString += '<div class=\"ac_list\">';
							$.each(ac_list[parseDate(daycounter,monthNum,yearNum)],function(ke,val){
								calendarString += '<div class=\"cate' + ke + '\"><span class=\"titre4\">' + val + '</span></div>';
							});
							calendarString += '</div>';
						}
						calendarString += '<\/td>';
					}
				}
				calendarString += '<\/tr>';
			}		
		}
		
		calendarString += '<\/tbody>';

		var object=document.getElementById('calendar');
		object.innerHTML= calendarString;
		thisDate = 1;
	});
}

function createWeekCalendar() {
	calendarString = '';
	var daycounter = 0;
	calendarString += '<table class="DatPick" border="0" cellpadding="0" cellspacing="0">';
	calendarString += '<tr>';
	//calendarString += '<td align=\"center\" valign=\"center\" width=\"40\" height=\"40\"><a href=\"#\" onClick=\"changedate(\'prevyr\')\">Prev Y<\/a><\/td>';
	calendarString += '<td align=\"center\" valign=\"center\" class="btnPrev"><a href=\"#\" onClick=\"changedate(\'prevmo\')\">Prev Mo<\/a><\/td>';
	calendarString += '<td align=\"center\" valign=\"center\"colspan=\"5\" class="curentMonth">' + wordMonth[monthNum-1] + '&nbsp;&nbsp;' + yearNum + '<\/td>';
	calendarString += '<td align=\"center\" valign=\"center\" class="btnNext"><a href=\"#\" onClick=\"changedate(\'nextmo\')\">Next Mo<\/a><\/td>';
	//calendarString += '<td align=\"center\" valign=\"center\" width=\"40\" height=\"40\"><a href=\"#\" onClick=\"changedate(\'nextyr\')\">Next Y<\/a><\/td>';
	calendarString += '<\/tr>';
	calendarString += '<tr>';
	
	var x_d = "jj/mm";
	
	calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">Lun. ' + x_d + '<\/td>';
	calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">Mar. ' + x_d + '<\/td>';
	calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">Mer. ' + x_d + '<\/td>';
	calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">Jeu. ' + x_d + '<\/td>';
	calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">Ven. ' + x_d + '<\/td>';
	calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">Sam. ' + x_d + '<\/td>';
	calendarString += '<td align=\"center\" valign=\"center\" class="labelDay">Dim. ' + x_d + '<\/td>';
	calendarString += '<\/tr>';

	thisDate == 1;

	for (var i = 1; i <= 6; i++) {
		if(daycounter < numberDays){
			calendarString += '<tr>';
			for (var x = 1; x <= 7; x++) {
				daycounter = (thisDate - firstDay)+1;
				thisDate++;
				if ((daycounter > numberDays) || (daycounter < 1)) {
					calendarString += '<td align=\"center\" class="day off">&nbsp;<\/td>';
				}
				else
				{
					var d_today = (((todaysDay == x) && (todaysDate == daycounter) && (todaysMonth == monthNum))?" today":"");
					var has_activity = "";/*(checkevents(daycounter,monthNum,yearNum,i,x)?" on":" off");
					if(parseDate(daycounter,monthNum,yearNum) == Number(dateCur))
						has_activity += " selected";*/
					calendarString += '<td align=\"center\" class="day' + has_activity + d_today + '">';
					calendarString += '<a href=\"javascript:showevents(' + daycounter + ',' + monthNum + ',' + yearNum + ',' + i + ',' + x + ')\">' + daycounter + '<\/a><\/td>';
				}
			}
			calendarString += '<\/tr>';
		}		
	}

	var object=document.getElementById('calendar');
	object.innerHTML= calendarString;
	thisDate = 1;
}



function checkevents(day,month,year,week,dayofweek) {
	//return liste_de_date.indexOf(parseDate(day,month,year)) > 0;
}


function showevents(day,month,year,week,dayofweek) {
	if (day < 10) { day = "0"+day;}else{}
	if (month < 10) { month = "0"+month;}else{}
	var strDay = day.toString();
	var strMonth = month.toString();
	var strYear = year.toString();
	var newdate = strYear + strMonth + strDay;
	var newdateInt = parseInt(newdate);
	CalendarChanged(newdateInt);
}

function floatingholiday(targetyr,targetmo,cardinaloccurrence,targetday) {}