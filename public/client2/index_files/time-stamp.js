/*

Script:     Javascript Timestamp
Author:     Scott Gray
Version:    1.0

*/

function sg_getTime(){
var currentTime = new Date();
var month = currentTime.getMonth();
var day = currentTime.getDate();
var year = currentTime.getFullYear();
var monthText = new Array("January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November",
                    "December");

var hours = currentTime.getHours();
var minutes = currentTime.getMinutes();
var seconds = currentTime.getSeconds();
if(seconds < 10) {
    seconds = "0" + seconds;
}
if (minutes < 10){
minutes = "0" + minutes
}
if(hours > 11){
    var timeOfDay = "PM"
} else {
    var timeOfDay = "AM"
}

if(hours > 12)
{
    hours = (hours * 1) - 12
}
else
{
    if (hours == 0)
    {
        hours = 12;
    }
}

var theTime = hours + ":" + minutes + " " + timeOfDay;

var theDate = monthText[month] + " " + day + ", " + year + " - " + theTime;


document.getElementById("wenn-home-timestamp").innerHTML = theDate;

}

function sg_showhide(id)
{
    state = document.getElementById(id).style.display;
    if(state == "block")
    {
        document.getElementById(id).style.display = "none";
    }
    else
    {
        document.getElementById(id).style.display = "block";
    }
}