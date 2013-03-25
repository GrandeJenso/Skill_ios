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


$(document).on("mobileinit", function(){
               $.mobile.defaultPageTransition = "slide";
               // Setting #container div as a jqm pageContainer
               $.mobile.pageContainer = $('#container');
               });
$(function() {
  $("#no_internet #refresh_button").click(function(){
                                          if(!navigator.onLine)
                                          {
                                          alert("No connection to internet");
                                          }
                                          else
                                          {
                                          $.mobile.changePage("#jobs",{ transition: "none"});
                                          }
                                          });
  });


$(document).on('pageshow', "#jobs", function()
               {
               var jobs_div = $('div.wrapper ul#job');
               jobs_div.text('');
               $.mobile.loading('show');
               $.ajax({
                      type: "GET",
                      url: "http://cv.skill.se/cv/rss.jsp?format=mtrxml&allads=1",
                      dataType: "xml",
                      success: parseXml
                      });
               
               
               function parseXml(xml)
               {
               
               xml_all=xml;
               //find every Tutorial and print the author
               $(xml).find("job").each(function()
                                       {
                                       var img = $(this).find('logo link').attr('href');
                                       var title = $(this).find('title').text();
                                       var id = $(this).attr('id');
                                       var date = $(this).find('pubDate').text();
                                       var location = $(this).find('location').text();
                                       var area = $(this).find('area').text();
                                       var assignment_type = $(this).find('assignmentType').text();
                                       
                                       jobs_div.append('<li class="listelement" data-id= "' + id + '" ><a data-transition="slide"><img src="' + img +'" class="ui-li-thumb"><p class="ui-li-heading">' + title + '</p><p class="ui-li-desc">'+area+','+assignment_type+'</br>' +location+', '+date+'</p></a></li>');
                                       });
               $('div.wrapper ul#job').listview("refresh");
               $.mobile.loading('hide');
               }
});

document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is loaded and it is now safe to make calls Cordova methods
//
function onDeviceReady() {
    checkConnection();
}

function checkConnection() {
    if(!navigator.onLine)
    {
        alert("No connection to internet");
        $.mobile.changePage("#no_internet",{ transition: "none"});
    }
}



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
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
