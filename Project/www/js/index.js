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
    
    FastClick.attach(document.body);
    
    if(!((settings_array = JSON.parse(db.getItem("settings"))) || (push_boolean = db.getItem("push_boolean"))))
    {
        $.mobile.changePage("#first_time_view",{ transition: "none"});
    }
    else
    {
        $('#first_time_view').remove();
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
             'css/images/ajax-loader.gif',
             'css/images/dromkandidater.png',
             'css/images/email.png',
             'css/images/twitter.png',
             'css/images/facebook.png'
             
             ]);
    
    detailed_div=$("div#detailed_job_content ul");
    
    $.mobile.loadPage("#settings");
    
    
    if(push_boolean = localStorage.getItem("push_boolean"));
    {
        if(push_boolean=="false")
        {
            $('#settings #settings_slider').val('off');
            $('#settings #settings_slider').slider('refresh');
            $('#toggle_push').hide();
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
    
    
    $.mobile.loadPage("#jobs");
    /*$('#jobs').load(function()
                    {
                        navigator.splashscreen.hide();
                    });*/
    /*
    $.mobile.loadPage("#jobs",true, function()
                      {
                        navigator.splashscreen.hide();
                      });*/
    
}

function onResume()
{
    checkConnection();
    
    
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
             'css/images/ajax-loader.gif',
             'css/images/dromkandidater.png',
             'css/images/email.png',
             'css/images/twitter.png',
             'css/images/facebook.png'
             ]);
    preload(image_array);
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
        return false;
    }
    return true;
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
    //$.mobile.showPageLoadingMsg("z");
}

//Laddar alla bilder
function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
                          $('<img/>')[0].src = this;
                          });
    
}

function showJobFromNotification(button_nr)
{
    if(button_nr == 1)
    {
        $.mobile.changePage('#detailed_job_view',{transition:"slide"});
    }
}


function refreshAbout()
{
    $.ajax({
           type: "GET",
           url: "http://skill.se/millnet/about.xml",
           dataType: "xml",
           success: readAboutXml,
           error: errorMessage
           });
    function readAboutXml(xml)
    {
        $('#refresh_about').hide();
        //$.mobile.hidePageLoadingMsg("z");
        about_xml = xml;
        var about_content_staff = $('div#about_content ul div#about_staff');
        var about_text = $(about_xml).find('about about_content').text();
        $('div#about_content ul div#about_text').html(about_text);
        var index = 0;
        
        about_content_staff.append('<table>');
        
        $(about_xml).find("staff recruiter").each(function()
                                                  {
                                                  if(index%2 == 0)
                                                  {
                                                  about_content_staff.find("table").append('<tr>');
                                                  }
                                                  var recruiter_img = $(this).find('image').text();
                                                  var recruiter_name = $(this).find('name').text();
                                                  var recruiter_phone = $(this).find('phone').text();
                                                  var recruiter_mobile = $(this).find('mobile').text();
                                                  var recruiter_mail = $(this).find('mail').text();
                                                  var recruiter_info = $(this).find('info').text();
                                                  
                                                  about_content_staff.find("tr:last").append('<td>');
                                                  about_content_staff.find("td:last").append('<img src="'+recruiter_img+'"class="recruiter_img"/><h3>'+recruiter_name+'</h3><p><a href="tel://'+recruiter_phone+'">'+recruiter_phone+'</a></p><p><a href="tel://'+recruiter_mobile+'">'+recruiter_mobile+'</a></p><p><a id="recruiter_mail_link">'+recruiter_mail+'</a></p><p>'+recruiter_info+'</p>');
                                                  about_content_staff.find("tr:last").append('</td>');
                                                  index++;
                                                  });
        
        $('#about_content img.recruiter_img').load(function()
                                            {
                                            $('div#about_content').trigger("create");
                                            $('div#about_content').iscrollview("refresh");
                                            });
        $('a#recruiter_mail_link').click(function(){
                                  if(checkConnection())
                                  {
                                         var email_args = {
                                         toRecipients : $(this).text(),
                                         ccRecipients : "",
                                         bccRecipients : "",
                                         subject : "",
                                         body : "",
                                         bIsHtml : false
                                         };
                                  Cordova.exec(null, null, "EmailComposer", "showEmailComposer", [email_args]);
                                  }
                                  });
    }
}

function refreshTips()
{
    $.ajax({
           type: "GET",
           url: "http://skill.se/millnet/tips.xml",
           dataType: "xml",
           success: readTipsXml,
           error: errorMessage
           });
    
    function readTipsXml(xml)
    {
        //$.mobile.hidePageLoadingMsg("z");
        $('#refresh_tips').hide();
        tips_xml = xml;
        var tips_text = $(tips_xml).find('tips tips_content').text();
        $('#tips_content ul #tips_text').html(tips_text);
        $('div#tips_content').trigger("create");
        $('div#tips_content').iscrollview("refresh");
        
        
    }
    
}

function refreshJobs()
{
    
    //Tömmer diven med alla jobben
    var jobs_div = $('div#jobs_content ul#job');
    jobs_div.text('');
    
    //Hämtar xml med alla jobb
    $.ajax({
           type: "GET",
           url: "http://skill.se/rss/jobs.xml",
           dataType: "xml",
           success: parseXml,
           error: errorMessage
           });
    
    //Lägger till alla jobb i listan från xml
    function parseXml(xml)
    {
        $.mobile.loadPage("#about");
        $.mobile.loadPage("#tips");
        $('#refresh_jobs').hide();
        jobs_xml=xml;
        var jobs_list = ' ';
        $(xml).find("item").each(function()
                                 {
                                 var img = $(this).find('small_logo').text();
                                 //Lägger till alla bilder från xml till en array för att preloadas
                                 image_array.push(img);
                                 
                                 var title = $(this).find('title').text();
                                 var id = $(this).find('job_id').text();
                                 var date = $(this).find('pubDate').text();
                                 var location = $(this).find('city').text();
                                 var area = $(this).find('field').text();
                                 var assignment_type = $(this).find('assignment').text();
                                 
                                 //Lägger till listelementen
                                 
                                 jobs_list+='<li class="listelement" data-id= "' + id + '" ><a data-transition="slide" ><img src="' + img +'" class="ui-li-thumb"><p class="ui-li-heading">' + title + '</p><p class="ui-li-desc">'+area+', '+assignment_type+'</br>' +location+', '+date+'</p></a></li>';
                                 
                                 });
        jobs_div.append(jobs_list);
        
        //$.mobile.hidePageLoadingMsg("z");
        
        //Laddar alla bilder från xml
        preload(image_array);
        
        
        //Klicka på jobben i listan
        $('li.listelement').click(function(){
                                  job_id = $(this).data('id');
                                  $.mobile.loadPage('#detailed_job_view');
                                  $.mobile.changePage('#detailed_job_view',{transition:"slide"});
                                  });
        //Updaterar listan
        $('div#jobs_content ul#job').listview('refresh');
        navigator.splashscreen.hide();
        
    }

}

//Globala variabler
var jobs_xml;
var detailed_div;
var job_id;
var link;
var image_array=new Array();
var detailed_link;
var device_token;
var settings_array = new Array();
var db = window.localStorage;
var push_boolean;
var tips_xml;
var about_xml;

var detailed_job;
var detailed_title;
var detailed_company;
var detailed_area;
var detailed_assignment_type;
var detailed_location;
var detailed_positions;
var detailed_img;
var detailed_description;

$(document).on('pageinit', "#jobs", function()
               {
                refreshJobs();
                $('#refresh_jobs').mousedown(function()
                                             {
                                             refreshJobs();
                                             
                                             });
               });

$(document).on('pagebeforeshow', '#detailed_job_view', function()
               {
               //detailed_div.text('');
               
               detailed_job = $(jobs_xml).find('item  job_id:contains("'+job_id+'")').parent();
               detailed_title = detailed_job.find('title').text();
               detailed_company = detailed_job.find('employer').text();
               detailed_area = detailed_job.find('field').text();
               detailed_assignment_type = detailed_job.find('assignment').text();
               detailed_location = detailed_job.find('city').text();
               detailed_positions = detailed_job.find('positions').text();
               detailed_img = detailed_job.find('small_logo').text();
               detailed_description = detailed_job.find('content\\:encoded, encoded').text();
               
               var detailed_job_image = new Image();
               detailed_job_image.src = detailed_img;
               $('#detailed_job_view div.header h1').html(detailed_company);
               
               $(detailed_job_image).load(function()
               {
                                          detailed_div.append('<h1 id="job_title">'+detailed_title+'</h1><img src="' + detailed_img +'" id="job_image"/><table><tr><td> Arbetsgivare </td><td>' +detailed_company+ '</td></tr><tr><td> Uppdragstyp </td><td>' +detailed_assignment_type+ '</td></tr><tr><td> Område </td><td>' +detailed_area+ '</td></tr><tr><td> Ort </td><td>' +detailed_location+ '</td></tr><tr><td> Platser </td><td>'+detailed_positions+ '</td></tr></table><hr/><div id="description">'+detailed_description+'</div><div id="social"><img src="css/images/facebook.png" id="fb_link" class="social_images" /><img src="css/images/twitter.png" id="twitter_link" class="social_images"/><img src="css/images/email.png" id="email_link" class="social_images"/></div><hr/><a data-role="button" id="job_link">Ansök</a>');
                                          
                                          //Updaterar innehållet i detaljerad jobb vy
                                          $('#detailed_job_content').iscrollview("scrollTo",0,0,0,false);
                                          $('#detailed_job_view').trigger("create");
                                          $('#detailed_job_content').iscrollview("refresh");
                                          
                                          //Klicka på ansök om jobb knapp
                                          $('a#job_link').click(function(){
                                                                if(checkConnection())
                                                                {
                                                                var ref = window.open('http://cv.skill.se/cv/assignment.jsp?id='+job_id+'&action=&previewcode=&tc=xml&i18nl=sv&i18nc=SE&i18nv=SKILL'+'&skillapp','_blank', 'location=no');
                                                                }
                                                                });
                                          
                                          $('img#fb_link').click(function(){
                                                                 if(checkConnection())
                                                                 {
                                                                 var detailed_job_link = detailed_job.find('link').text();
                                                                 var fb_ref = window.open(encodeURI('https://www.facebook.com/dialog/feed?app_id=587758617909778&link='+detailed_job_link+'/&picture=http://skill.se/millnet/logo-facebook-app.png&name='+detailed_title+'&caption='+detailed_location+'&description=Ett ledigt jobb på '+detailed_company+'&redirect_uri=http://www.facebook.com/skilligt?fref=ts'),'_blank', 'location=no');
                                                                 }
                                                                 });
                                          
                                          $('img#twitter_link').click(function(){
                                                                      if(checkConnection())
                                                                      {
                                                                      var detailed_job_link = detailed_job.find('link').text();
                                                                      
                                                                      var twitter_ref = window.open('https://twitter.com/intent/tweet?text='+encodeURI('Ledigt jobb: '+detailed_title+': ')+detailed_job_link + escape(' #skilligt #nyttjobb'), '_blank', 'location=no');
                                                                      }
                                                                      });
                                          
                                          $('img#email_link').click(function(){
                                                                    if(checkConnection())
                                                                    {
                                                                    var detailed_job_link = detailed_job.find('link').text();
                                                                    var email_args = {
                                                                    toRecipients : "",
                                                                    ccRecipients : "",
                                                                    bccRecipients : "",
                                                                    subject : "Tips om ett ledigt jobb: ",
                                                                    body : "Jag skulle vilja tipsa om ett ledigt jobb: " + detailed_job_link,
                                                                    bIsHtml : false
                                                                    }
                                                                    Cordova.exec(null, null, "EmailComposer", "showEmailComposer", [email_args]);
                                                                    }
                                                                    });
                                          
                                          
                                          
                                          
                                          //Klicka på en länk i texten
                                          $('div#description a').click(function(event)
                                                                       {
                                                                        event.preventDefault();
                                                                        var anchor_text = $(this).text();
                                                                        var charExists = (anchor_text.indexOf('@') >=0);
                                                                        if(charExists)
                                                                        {
                                                                            if(checkConnection())
                                                                            {
                                                                                var email_args = {
                                                                                    toRecipients : anchor_text,
                                                                                    ccRecipients : "",
                                                                                    bccRecipients : "",
                                                                                    subject : "",
                                                                                    body : "",
                                                                                    bIsHtml : false
                                                                                }
                                                                                Cordova.exec(null, null, "EmailComposer", "showEmailComposer", [email_args]);
                                                                            }
                                                                        }
                                                                       });
               });
               
               
            
               
               
               
               
               });

$(document).on('pagehide', '#detailed_job_view', function()
               {
                detailed_div.text('');
               });



$(document).on('pageinit', "#settings", function()
               {
               $('input[type="checkbox"]').click(function(e) {
                                                 e.preventDefault(); // or return false;
                                                 });

               $('#settings #settings_slider').bind("change",function()
                                           {
                                            if($(this).val() == "on")
                                            {
                                                $("#toggle_push").show();
                                            }
                                            else
                                            {
                                                $("#toggle_push").hide();
                                            }
                                                $('#settings').trigger("create");
                                           });
               
               $('div#settings a#save_settings').mouseup(function()
                                                           {
                                                           if($("#settings #settings_slider").val()=="on")
                                                           {
                                                           push_boolean = true;
                                                           
                                                           settings_array = $('#settings input:checkbox:checked.checkbox_group').map(function ()
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

$(document).on('pageinit', "#about", function()
               {
               refreshAbout();
               $('#refresh_about').mousedown(function()
                                             {
                                             refreshAbout();
                                             
                                             });
               
               });


$(document).on('pageinit', "#tips", function()
               {
                refreshTips()
                $('#refresh_tips').mousedown(function()
                                             {
                                             refreshTips();
                                             
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
               
               $('input[type="checkbox"]').click(function(e) {
                                                 e.preventDefault(); // or return false;
                                                 });
               
               $('#first_time_view').trigger('create');
               
               $('#welcome_continue').mousedown(function(event)
                                                {
                                                if($("#welcome #welcome_slider").val()=="off")
                                                {
                                                push_boolean = false;
                                                db.setItem("push_boolean", push_boolean);
                                                $('#settings #settings_slider').val('off');
                                                $('#settings #settings_slider').slider('refresh');
                                                $('#toggle_push').hide();
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
                                                         settings_array = $('#first_time_view input:checkbox:checked.checkbox_group').map(function ()
                                                                                                                         {                                                    return this.value;                                                  }).get();
                                                         
                                                         
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
                                                                navigator.notification.alert(
                                                                                             'Det gick ej att spara dina inställningar',
                                                                                             null,
                                                                                             'Inställningar',
                                                                                             'OK'
                                                                                             );
                                                                }
                                                                });

                                                         }
                                                         db.setItem("settings",JSON.stringify(settings_array));
                                                         db.setItem("push_boolean",push_boolean);
                                                         
                                                         $.each(settings_array, function(index,value)
                                                                {
                                                                $('input[name="'+value+'"]').prop("checked",true);
                                                                });
                                                        $('#settings_content').trigger("create");
                                                    
                                                        $.mobile.changePage("#jobs",{ transition: "none"});
                                                        $('#first_time_view').remove();
                                                         
                                                         
                                                         

                });
               
               $('#placement_back').mousedown(function(event)
                                              {
                                              placement_div.hide();
                                              welcome_div.show();
                                              });
               
               $('#area_back').mousedown(function(event)
                                         {
                                         area_div.hide();
                                         placement_div.show();
                                         });
               
               $('#assignment_back').mousedown(function(event)
                                               {
                                               assignment_type_div.hide();
                                               area_div.show();
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
        
        job_id=event.job_id;
        
        navigator.notification.confirm(
                                     event.alert,  // message
                                     showJobFromNotification,         // callback
                                     'Ett nytt jobb som passar dig',            // title
                                     'Visa,Stäng'                  // buttonName
                                     );
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
