var JS_SURVEY_ID;
var JS_SURVEY_STARTDATE;
var JS_SURVEY_ENDDATE;
var JS_SURVEY_MAXENT;
var JS_SURVEY_URL;
var surveyurl;
var oCallback;
var cookiestring;
var instances;
var cookie = new Array();
var cookiesurveyid = new Array();
var cookieBlockCount = new Array();
var Datenow = new Date();
var BlockCount = 0;
var surveyCat;
var SURVEYID;
var isBlockerOn;
var Day;
var tempMonth;
var Month;
var Year;
var Hour;
var formattedDate;
var unformattedDate;
var strSTARTDATE;
var strENDDATE;
var STARTDATE;
var ENDDATE;
var startEnd;
var stringDate;


//Based on whether or not "|" is in the SURVEYID String build surveyurl
//string accordingly


if ((JS_SURVEY_ID != undefined) && (JS_SURVEY_STARTDATE != undefined) && (JS_SURVEY_ENDDATE != undefined) && (JS_SURVEY_MAXENT != undefined))
{
    if (JS_SURVEY_ID.indexOf("|") == -1)
    {
        SURVEYID = JS_SURVEY_ID;
        if ((typeof (JS_SURVEY_URL) != "undefined") && (JS_SURVEY_URL != ""))
        {
            surveyurl = JS_SURVEY_URL;
            if (surveyurl.indexOf("?") == -1)
            {
                surveyurl += "?";
            }
            else if (!/[\?&]$/g.test(surveyurl))
            {
                surveyurl += "&";
            }
            surveyurl += "surveyid=" + SURVEYID + "&inpopup=true";
        }
        else
        {
            surveyurl = "http://survey.ninemsn.com.au/survey/network/survey" + SURVEYID + "_1.asp";
        }
    }
    else
    {
        surveyCat = JS_SURVEY_ID.substring(0, JS_SURVEY_ID.indexOf("|"));
        SURVEYID = JS_SURVEY_ID.substring(JS_SURVEY_ID.indexOf("|") + 1);
        surveyurl = "http://survey.ninemsn.com.au/survey/" + surveyCat + "/" + "survey" + SURVEYID + "_1.asp";
    }

    //Check that JS_SURVEY_ID  and JS_SURVEY_MAXENT are not blank and that JS_SURVEY_MAXENT >0,
    if ((JS_SURVEY_ID != "") && (JS_SURVEY_MAXENT != "") && (parseInt(JS_SURVEY_MAXENT) > 0) && (JS_SURVEY_MAXENT.indexOf(".") == -1))
    {
        // Check that the Survey Start date and End date is in the correct date or datetime format
        if (((isDate(JS_SURVEY_STARTDATE, "dd/MM/yyyy HH:mm:ss")) || (isDate(JS_SURVEY_STARTDATE, "dd/MM/yyyy"))) && ((isDate(JS_SURVEY_ENDDATE, "dd/MM/yyyy HH:mm:ss")) || (isDate(JS_SURVEY_ENDDATE, "dd/MM/yyyy"))))
        {
            strSTARTDATE = formatdate(JS_SURVEY_STARTDATE, "start", "stringtype");
            strENDDATE = formatdate(JS_SURVEY_ENDDATE, "end", "stringtype");
            STARTDATE = formatdate(JS_SURVEY_STARTDATE, "start", "datetype");
            ENDDATE = formatdate(JS_SURVEY_ENDDATE, "end", "datetype");

            //Check that the start date is <= present, that the end date is >=present and that the startdate is <= the enddate
            if ((STARTDATE <= Datenow) && (ENDDATE >= Datenow) && (ENDDATE >= STARTDATE))
            {
                cookiestring = getcookie("surveyvlist");

                if (cookiestring.length > 0)
                {
                    if (cookiestring.indexOf("&") == -1)
                    {
                        instances = 0;
                        cookielen = cookiestring.length;
                        cookiesurveyid[0] = cookiestring.substring(0, cookiestring.indexOf("="));
                        cookieBlockCount[0] = cookiestring.substring(cookiestring.indexOf("=") + 1);
                        if (cookiesurveyid[0] == SURVEYID)
                        {
                            BlockCount = cookieBlockCount[0];
                        }
                    }
                    else
                    {
                        var delimiter = "&";
                        var re = new RegExp(delimiter, "g");
                        var result = cookiestring.match(re);
                        instances = result.length;

                        for (var i = 0; i < instances; i++)
                        {
                            cookie[i] = cookiestring.substring(0, cookiestring.indexOf("&"));
                            cookiestring = cookiestring.substring(cookiestring.indexOf("&") + 1);
                            cookiesurveyid[i] = cookie[i].substring(0, cookie[i].indexOf("="));
                            cookieBlockCount[i] = cookie[i].substring(cookie[i].indexOf("=") + 1);
                        }

                        cookiesurveyid[instances] = cookiestring.substring(0, cookiestring.indexOf("="));
                        cookieBlockCount[instances] = cookiestring.substring(cookiestring.indexOf("=") + 1);
                        cookie[instances] = cookiestring.substring(0);

                        if (instances == 0)
                        {
                            if (cookiesurveyid[0] == SURVEYID)
                            {
                                BlockCount = cookieBlockCount[0];
                            }
                        }
                        else
                        {
                            for (var j = 0; j <= instances; j++)
                            {
                                var temp;
                                temp = cookiesurveyid[j];
                                if (temp == SURVEYID)
                                {
                                    BlockCount = cookieBlockCount[j];
                                    break;
                                }
                            }
                        }
                    }
                }

                if (BlockCount < 2)
                {
                    if (IsPopupBlocker())
                    {
                        isBlockerOn = "true";
                    }
                    else
                    {
                        isBlockerOn = "false";
                    }
                    var url = "http://data.ninemsn.com.au/SurveyWS/CheckCount.aspx?surveyID=" + SURVEYID + "&startDate=" + strSTARTDATE + "&endDate=" + strENDDATE + "&maxEntries=" + JS_SURVEY_MAXENT + "&popupBlocker=" + isBlockerOn.toLowerCase();

                    oCallback = function(responseElement)
                    {
                        if (responseElement != undefined)
                        {
                            if (responseElement.ShowSurvey.toLowerCase() == "true")
                            {
                                window.open(surveyurl, 'NinemsnSurvey', 'left=210,top=300,width=660,height=500,scrollbars=1,resizable=1,menubar=1');
                            }
                        }
                    };

                    try
                    {
                        Ninemsn.Site.NH.FeedReader.Get(url, oCallback);
                    }
                    catch (e)
                    {
                        //do nothing
                    }
                }
            }
        }
    }
}
//Standard get cookie function
function getcookie(name)
{

    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen)
    {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
        {
            return getCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
        {
            break;
        }
    }
    return "";
}

//Standard get cookie helper function
function getCookieVal(offset)
{

    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
    {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
}

// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// Modified by Jason Depenha (21/06/2007)
// WWW: http://www.mattkruse.com/
// ===================================================================
// HISTORY
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// The format string consists of the following abbreviations:
//
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)            |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
function LZ(x)
{
    return (x < 0 || x > 9 ? "" : "0") + x
}

// ------------------------------------------------------------------
// isDate ( date_string, format_string )
// Returns true if date string matches format of format string and
// is a valid date. Else returns false.
// It is recommended that you trim whitespace around the value before
// passing it to this function, as whitespace is NOT ignored!
// ------------------------------------------------------------------
function isDate(val, format)
{
    var date = getDateFromFormat(val, format);
    if (date == 0)
    {
        return false;
    }
    return true;
}

// ------------------------------------------------------------------
// Utility functions for parsing in getDateFromFormat()
// ------------------------------------------------------------------
function _isInteger(val)
{
    var digits = "1234567890";

    for (var i = 0; i < val.length; i++)
    {
        if (digits.indexOf(val.charAt(i)) == -1)
        {
            return false;
        }
    }
    return true;
}

function _getInt(str, i, minlength, maxlength)
{
    for (var x = maxlength; x >= minlength; x--)
    {
        var token = str.substring(i, i + x);
        if (token.length < minlength)
        {
            return null;
        }
        if (_isInteger(token))
        {
            return token;
        }
    }
    return null;
}

// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------
function getDateFromFormat(val, format)
{
    val = val + "";
    format = format + "";
    var i_val = 0;
    var i_format = 0;
    var c = "";
    var token = "";
    var x, y;
    var now = new Date();
    var year = now.getYear();
    var month = now.getMonth() + 1;
    var date = 1;
    var hh = now.getHours();
    var mm = now.getMinutes();
    var ss = now.getSeconds();

    while (i_format < format.length)
    {
        // Get next token from format string
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length))
        {
            token += format.charAt(i_format++);
        }
        // Extract contents of value based on format token
        if (token == "yyyy")
        {
            x = 4;
            y = 4;

            year = _getInt(val, i_val, x, y);
            if (year == null)
            {
                return 0;
            }
            i_val += year.length;
        }
        else if (token == "MM")
        {
            month = _getInt(val, i_val, token.length, 2);
            if (month == null || (month < 1) || (month > 12))
            {
                return 0;
            }
            i_val += month.length;
        }
        else if (token == "dd")
        {
            date = _getInt(val, i_val, token.length, 2);
            if (date == null || (date < 1) || (date > 31))
            {
                return 0;
            }
            i_val += date.length;
        }
        else if (token == "HH")
        {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh == null || (hh < 0) || (hh > 23))
            {
                return 0;
            }
            i_val += hh.length;
        }
        else if (token == "mm")
        {
            mm = _getInt(val, i_val, token.length, 2);
            if (mm == null || (mm < 0) || (mm > 59))
            {
                return 0;
            }
            i_val += mm.length;
        }
        else if (token == "ss")
        {
            ss = _getInt(val, i_val, token.length, 2);
            if (ss == null || (ss < 0) || (ss > 59))
            {
                return 0;
            }
            i_val += ss.length;
        }
        else
        {
            if (val.substring(i_val, i_val + token.length) != token)
            {
                return 0;
            }
            else
            {
                i_val += token.length;
            }
        }
    }
    // If there are any trailing characters left in the value, it doesn't match
    if (i_val != val.length)
    {
        return 0;
    }
    // Is date valid for month?
    if (month == 2)
    {
        // Check for leap year
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
        { // leap year
            if (date > 29)
            {
                return 0;
            }
        }
        else
        {
            if (date > 28)
            {
                return 0;
            }
        }
    }
    if ((month == 4) || (month == 6) || (month == 9) || (month == 11))
    {
        if (date > 30)
        {
            return 0;
        }
    }
    var newdate = new Date(year, month - 1, date, hh, mm, ss);
    return newdate.getTime();
}

// Standard Pop up detection function
function IsPopupBlocker()
{

    var oWin = window.open("", "testpopupblocker", "menubar=no,toolbar=no,scrollbars=no,width=1,height=1,top=900,left=1200,alwaysLowered=yes");
    if (oWin == null || typeof (oWin) == "undefined")
    {
        return true;
    }
    else
    {
        oWin.close();
        return false;
    }
}


//Created by Jason Depenha
// Purpose: return either a date object or a string representing the date, both in date time format
function formatdate(unformattedDate, startEnd, stringDate)
{
    Day = unformattedDate.substring(0, 2);
    tempMonth = unformattedDate.substring(3, 5);
    Year = unformattedDate.substring(6, 10);
    Month = convertMonth(tempMonth);

    if (unformattedDate.length > 10)
    {
        Hour = unformattedDate.substring(11, 13);
        Min = unformattedDate.substring(14, 16);
        Sec = unformattedDate.substring(17, 19);
    }
    else
    {
        if (startEnd.toLowerCase() == "start")
        {
            Hour = "00";
            Min = "00";
            Sec = "00";
        }
        else
        {
            Hour = "23";
            Min = "59";
            Sec = "59";
        }
    }
    if (stringDate.toLowerCase() == "datetype")
    {
        formattedDate = new Date(Year, Month, Day, Hour, Min, Sec);
        return formattedDate;
    }
    else
    {
        formattedDate = Day + "/" + tempMonth + "/" + Year + " " + Hour + ":" + Min + ":" + Sec;
        return formattedDate;
    }

}

//Created by Jason Depenha
function convertMonth(monthbefore)
{
    switch (monthbefore)
    {
        case "01": Month = "00"; break;
        case "02": Month = "01"; break;
        case "03": Month = "02"; break;
        case "04": Month = "03"; break;
        case "05": Month = "04"; break;
        case "06": Month = "05"; break;
        case "07": Month = "06"; break;
        case "08": Month = "07"; break;
        case "09": Month = "08"; break;
        case "10": Month = "09"; break;
        case "11": Month = "10"; break;
        case "12": Month = "11"; break;
    }

    return Month;

}
