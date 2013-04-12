/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("resume", onResume, false);

function onDeviceReady() {
    checkConnection();
    
    if(!((settings_array = JSON.parse(db.getItem("settings"))) && (push_boolean = db.getItem("push_boolean"))))
    {
        $.mobile.changePage("#first_time_view",{ transition: "none"});
    }
    //Laddar alla ikoner som finns i header
    preload([
             'css/images/info_blue.png',
             'css/images/info_dark.png',
             'css/images/jobs_blue.png',
             'css/images/jobs_dark.png',
             'css/images/settings_blue.png',
             'css/images/settings_dark.png',
             'css/images/tips_blue.png',
             'css/images/tips_dark.png',
             'css/images/footer.png',
             'css/images/ajax-loader.gif'
             ]);
    
    detailed_div=$("div#detailed_job_content ul");
    
    $.mobile.loadPage("#settings");
    $.mobile.loadPage("#about");
    $.mobile.loadPage("#tips");
    
    if(push_boolean = localStorage.getItem("push_boolean"));
    {
        if(push_boolean=="false")
        {
            $('#settings #slider').val('off');
            $('#settings #slider').slider('refresh');
            $('#toggle_push').toggle();
        }
    }
    if(settings_array = JSON.parse(localStorage.getItem("settings")))
    {
        $.each(settings_array, function(index,value)
               {
               $('input[value="'+value+'"]').attr("checked","");
               });     
    }
    $('#settings').trigger("create");
    setTimeout(function() {
               navigator.splashscreen.hide();
               },2000);
}

function onResume()
{
    checkConnection();
    alert("resume");
    preload(image_array);
    
    preload([
             'css/images/info_blue.png',
             'css/images/info_dark.png',
             'css/images/jobs_blue.png',
             'css/images/jobs_dark.png',
             'css/images/settings_blue.png',
             'css/images/settings_dark.png',
             'css/images/tips_blue.png',
             'css/images/tips_dark.png',
             'css/images/footer.png',
             'css/images/ajax-loader.gif'
             ]);
    
}


//kollar om det finns anslutning till internet
function checkConnection() {
    
    if(!navigator.onLine)
    {
        navigator.notification.alert(
                                     'Du måste vara ansluten till internet för att se denna del av applikationen',  // message
                                     alertDismissed,         // callback
                                     'Ingen internetanslutning',            // title
                                     'OK'                  // buttonName
                                     );
    }
}

//Om det inte går att hämta xml
function errorMessage(error)
{
    navigator.notification.alert(
                                 'Du måste vara ansluten till internet för att se denna del av applikationen',  // message
                                 alertDismissed,         // callback
                                 'Ingen internetanslutning',            // title
                                 'OK'                  // buttonName
                                 );
}

function alertDismissed()
{
    $.mobile.showPageLoadingMsg("z");
}

//Laddar alla bilder
function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
                          $('<img/>')[0].src = this;
                          });
}

//Globala variabler
var xml_all;
var detailed_div;
var job_id;
var link;
var image_array=new Array();
var detailed_link;
var device_token;
var settings_array = new Array();
var db = window.localStorage;
var push_boolean;

$(document).on('pageinit', "#settings", function()
               {
               var settings_array = new Array();
               
               $('#settings #slider').bind("change",function()
                                  {
                                 $("#toggle_push").toggle();
                                 $('#settings').trigger("create");
                                  });
               $('div#settings a#save_settings').mousedown(function()
                                                       {
                                                        if($("#settings #slider").val()=="on")
                                                           {
                                                           push_boolean = true;
                                                           
                                                           settings_array = $('input:checkbox:checked.checkbox_group').map(function ()
                                                                                                                       {
                                                                                                                       return this.value;
                                                                                                                       }).get();
                                                           }
                                                        else
                                                           {
                                                           push_boolean = false;
                                                           settings_array=new Array();
                                                           }
                                                       if(device_token.length>0)
                                                       {
                                                       $.ajax({
                                                              type: 'POST',
                                                              data: {"device_token":device_token,"prenum_array":settings_array} ,
                                                              url: 'http://pervelander.se/examensarbete/post_prenum_ios.php',
                                                              success: function(data){
                                                              console.log(data);
                                                              navigator.notification.alert(
                                                                                           'Dina inställningar sparades',
                                                                                           null,
                                                                                           'Inställningar',
                                                                                           'OK'
                                                                                           );
                                                              },
                                                              error: function(){
                                                              console.log(data);
                                                              navigator.notification.alert(
                                                                                           'Det gick ej att spara dina inställningar',
                                                                                           null,
                                                                                           'Inställningar',
                                                                                           'OK'
                                                                                           );
                                                              }
                                                              });
                                                           db.setItem("settings",JSON.stringify(settings_array));
                                                           db.setItem("push_boolean",push_boolean);
                                                       }
                                                       
                                                       
                                                       });
               
               
               
               });

$(document).on('pagebeforeshow', "#jobs", function()
               {
               //Laddar alla bilder från xml
               preload(image_array);
               if(!xml_all)
               {
               //Tömmer diven med alla jobben
               var jobs_div = $('div#jobs_content ul#job');
               jobs_div.text('');
               
               //Hämtar xml med alla jobb
               $.ajax({
                      type: "GET",
                      url: "http://cv.skill.se/cv/rss.jsp?format=mtrxml&allads=1&fullad=1",
                      dataType: "xml",
                      success: parseXml,
                      error: errorMessage
                      });
               }
               
               //Lägger till alla jobb i listan från xml
               function parseXml(xml)
               {
               xml_all=xml;
               $(xml).find("job").each(function()
                                       {
                                       var img = $(this).find('logo link').attr('href');
                                       //Lägger till alla bilder från xml till en array för att preloadas
                                       image_array.push(img);
                                       
                                       var title = $(this).find('title').text();
                                       var id = $(this).attr('id');
                                       var date = $(this).find('pubDate').text();
                                       var location = $(this).find('location').text();
                                       var area = $(this).find('area').text();
                                       var assignment_type = $(this).find('assignmentType').text();
                                       
                                       //Lägger till listelementen
                                       jobs_div.append('<li class="listelement" data-id= "' + id + '" ><a data-transition="slide" ><img src="' + img +'" class="ui-li-thumb"><p class="ui-li-heading">' + title + '</p><p class="ui-li-desc">'+area+', '+assignment_type+'</br>' +location+', '+date+'</p></a></li>');
                                       });
               
               //Updaterar listan
               $('div#jobs_content ul#job').listview('refresh');
               $.mobile.hidePageLoadingMsg("z");
               
               //Laddar alla bilder från xml
               preload(image_array);
               
               
               //Klicka på jobben i listan
               $('li.listelement').click(function(){
                                        detailed_div.text('');
                                        job_id = $(this).data('id');
                                         var detailed_job = $(xml_all).find("job[id="+job_id+"]");
                                         var detailed_title = detailed_job.find('title').text();
                                         var detailed_company = detailed_job.find('company name').text();
                                         var detailed_area = detailed_job.find('area').text();
                                         var detailed_assignment_type = detailed_job.find('assignmentType').text();
                                         var detailed_location = detailed_job.find('location').text();
                                         var detailed_description = detailed_job.find('description').text();
                                         var detailed_img = detailed_job.find('logo link').attr('href');
                                         detailed_link = detailed_job.find('applicationMethods link').attr('href');
                                         $('#detailed_job_view div.header h1').html(detailed_company);
                                         detailed_div.append('<h1 id="job_title">'+detailed_title+'</h1>');
                                         detailed_div.append('<img src="' + detailed_img +'" id="job_image"></img>');
                                         
                                         detailed_div.append('<table>');
                                         detailed_div.append('<tr>');
                                         detailed_div.append('<td> Arbetsgivare </td> ');
                                         detailed_div.append('<td>' +detailed_company+ '</td>');
                                         detailed_div.append('</tr>');
                                         detailed_div.append('<tr>');
                                         detailed_div.append('<td> Uppdragstyp </td>');
                                         detailed_div.append('<td>' +detailed_assignment_type+ '</td>');
                                         detailed_div.append('</tr>');
                                         detailed_div.append('<tr>');
                                         detailed_div.append('<td> Område </td>');
                                         detailed_div.append('<td>' +detailed_area+ '</td>');
                                         detailed_div.append('</tr>');
                                         detailed_div.append('<tr>');
                                         detailed_div.append('<td> Ort </td>');
                                         detailed_div.append('<td>' +detailed_location+ '</td>');
                                         detailed_div.append('</tr>');
                                         detailed_div.append('<tr>');
                                         detailed_div.append('<td> Platser </td>');
                                         detailed_div.append('<td> 2 </td>');
                                         detailed_div.append('</tr>');
                                         detailed_div.append('<tr>');
                                         detailed_div.append('<td> Sista ansökningsdagen </td>');
                                         detailed_div.append('<td> 2013-06-28 </td>');
                                         detailed_div.append('</tr>');
                                         detailed_div.append('</table>');
                                         detailed_div.append('<hr/>');
                                         
                                         detailed_div.append('<div id="description">'+detailed_description+'</div>');
                                         detailed_div.append('<hr/>');
                                         detailed_div.append('<a data-role="button" id="job_link">Ansök</a>');
                                         $.mobile.loadPage('#detailed_job_view');
                                        $.mobile.changePage('#detailed_job_view',{transition:"slide"});
                                        
                });
               
               }
});




$(document).on('pagebeforeshow', '#detailed_job_view', function()
               {
               
               //Updaterar innehållet i detaljerad jobb vy
               $('#detailed_job_content').iscrollview("refresh");
               $('#detailed_job_content').iscrollview("scrollTo",0,0,0,false);
               $('#detailed_job_view').trigger("create");
               
               //Klicka på ansök om jobb knapp
               $('a#job_link').mousedown(function(){
                                     ref = window.open(detailed_link,'_blank', 'location=no');
                                         });
               
               //Klicka på en länk i texten
               $('div#description a').click(function(event)
                                            {
                                            var anchor_text = $(this).text();
                                            var charExists = (anchor_text.indexOf('@') >=0);
                                            if(!charExists)
                                            {
                                                event.preventDefault();
                                            }
                                            });
               
               });

$(document).on('pagebeforeshow', "#first_time_view", function()
               {
               var placement_div = $('#first_time_view #placement');
               var area_div = $('#first_time_view #area');
               var assignment_type_div = $('#first_time_view #assignment_type');
               var welcome_div = $('#first_time_view #welcome');
               
               placement_div.hide();
               area_div.hide();
               assignment_type_div.hide();
               
               $('#first_time_view').trigger('create');
               
               $('#welcome_continue').mousedown(function(event)
                                                {
                                                if($("#welcome #slider").val()=="off")
                                                {
                                                push_boolean = false;
                                                db.setItem("push_boolean", push_boolean);
                                                $('#settings #slider').val('off');
                                                $('#settings #slider').slider('refresh');
                                                //$('#toggle_push').toggle();
                                                $.mobile.changePage("#jobs",{ transition: "none"});
                                                }
                                                else
                                                {
                                                push_boolean = true;
                                                welcome_div.hide();
                                                placement_div.show();
                                                }
                                                });
               
                $('#placement_continue').mousedown(function(event)
                {
                                            placement_div.hide();
                                            area_div.show();
                });

                $('#area_continue').mousedown(function(event)
                {
                                              area_div.hide();
                                              assignment_type_div.show();
                });

                $('#assignment_type_continue').mousedown(function(event)
                {
                                                         settings_array = $('input:checkbox:checked.checkbox_group').map(function ()
                                                                                                                         {
                                                                                                                         return this.value;
                                                                                                                         }).get();
                                                         if(device_token.length>0)
                                                         {
                                                         $.ajax({
                                                                type: 'POST',
                                                                data: {"device_token":device_token,"prenum_array":settings_array} ,
                                                                url: 'http://pervelander.se/examensarbete/post_prenum_ios.php',
                                                                success: function(data){
                                                                console.log(data);
                                                                navigator.notification.alert(
                                                                                             'Dina inställningar sparades',
                                                                                             null,
                                                                                             'Inställningar',
                                                                                             'OK'
                                                                                             );
                                                                },
                                                                error: function(){
                                                                console.log(data);
                                                                navigator.notification.alert(
                                                                                             'Det gick ej att spara dina inställningar',
                                                                                             null,
                                                                                             'Inställningar',
                                                                                             'OK'
                                                                                             );
                                                                }
                                                                });
                                                         db.setItem("settings",JSON.stringify(settings_array));
                                                         db.setItem("push_boolean",push_boolean);
                                                         }
                                                         $.mobile.changePage("#jobs",{ transition: "none"});

                });
});




var app = {
    // Application Constructor
initialize: function() {
    this.bindEvents();
},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
onDeviceReady: function() {
    app.receivedEvent('deviceready');
},
tokenHandler:function(msg) {
    console.log("Token Handler " + msg);
    device_token = msg;
    //alert(msg);
},
errorHandler:function(error) {
    console.log("Error Handler  " + error);
    alert(error);
},
    // result contains any message sent from the plugin call
successHandler: function(result) {
    alert('Success! Result = '+result)
},
    // Update DOM on a Received Event
receivedEvent: function(id) {
    var pushNotification = window.plugins.pushNotification;
    // TODO: Enter your own GCM Sender ID in the register call for Android
    if (device.platform == 'android' || device.platform == 'Android') {
        pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"1011544002093","ecb":"app.onNotificationGCM"});
    }
    else {
        pushNotification.register(this.tokenHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
    }
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
    
    console.log('Received Event: ' + id);
},
    // iOS
onNotificationAPN: function(event) {
    var pushNotification = window.plugins.pushNotification;
    console.log("Received a notification! " + event.alert);
    console.log("event sound " + event.sound);
    console.log("event badge " + event.badge);
    console.log("event " + event);
    if (event.alert) {
        navigator.notification.alert(event.alert);
    }
    if (event.badge) {
        console.log("Set badge on  " + pushNotification);
        pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
    }
    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }
},
    // Android
onNotificationGCM: function(e) {
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                alert('registration id = '+e.regid);
            }
            break;
            
        case 'message':
            // this is the actual push notification. its format depends on the data model
            // of the intermediary push server which must also be reflected in GCMIntentService.java
            alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
            
        case 'error':
            alert('GCM error = '+e.msg);
            break;
            
        default:
            alert('An unknown GCM event has occurred');
            break;
    }
}};
