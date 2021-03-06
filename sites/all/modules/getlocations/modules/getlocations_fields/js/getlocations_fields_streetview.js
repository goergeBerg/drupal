/**
 * @file getlocations_fields_streetview.js
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations_fields module
 * jquery stuff
*/
(function ($) {
  Drupal.behaviors.getlocations_fields_streetview = {
    attach: function() {
      var getlocations_pano = [];

      // bail out
      if (typeof Drupal.settings.getlocations_fields_streetview === 'undefined') {
        return;
      }

      $.each(Drupal.settings.getlocations_fields_streetview, function (key, settings) {

        // functions
        function FullScreenControl(fsd) {
          fsd.style.margin = "5px";
          fsd.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";
          fsdiv = document.createElement("DIV");
          fsdiv.style.height = "22px";
          fsdiv.style.backgroundColor = "white";
          fsdiv.style.borderColor = "#717B87";
          fsdiv.style.borderStyle = "solid";
          fsdiv.style.borderWidth = "1px";
          fsdiv.style.cursor = "pointer";
          fsdiv.style.textAlign = "center";
          fsdiv.title = Drupal.t('Full screen');
          fsdiv.innerHTML = '<img id="svbtnFullScreen" src="' + js_path + 'images/fs-map-full.png"/>';
          fsd.appendChild(fsdiv);
          google.maps.event.addDomListener(fsdiv, "click", function() {
            toggleFullScreen();
          });
        }

        function toggleFullScreen() {
          $("#getlocations_streetview_wrapper_" + key).toggleClass("fullscreen");
          $("html,body").toggleClass("svfullscreen-body-" + key);
          $(document).scrollTop(0);
          google.maps.event.trigger(getlocations_pano[key], "resize");
          setTimeout( function() {
            if($("#getlocations_streetview_wrapper_" + key).hasClass("fullscreen")) {
              $("#svbtnFullScreen").attr("src", js_path + 'images/fs-map-normal.png');
              fsdiv.title = Drupal.t('Normal screen');
            }
            else {
              $("#svbtnFullScreen").attr("src", js_path + 'images/fs-map-full.png');
              fsdiv.title = Drupal.t('Full screen');
            }
          },200);
        }

        // end functions

        if ($("#getlocations_streetview_canvas_" + key).is('div')) {

          var addresscontrol         = (settings.sv_addresscontrol ? true : false);
          var addresscontrolposition = settings.sv_addresscontrolposition;
          var pancontrol             = (settings.sv_pancontrol ? true : false);
          var pancontrolposition     = settings.sv_pancontrolposition;
          var zoomcontrol            = settings.sv_zoomcontrol;
          var zoomcontrolposition    = settings.sv_zoomcontrolposition;
          var linkscontrol           = (settings.sv_linkscontrol ? true : false);
          var imagedatecontrol       = (settings.sv_imagedatecontrol ? true : false);
          var scrollwheel            = (settings.sv_scrollwheel ? true : false);
          var clicktogo              = (settings.sv_clicktogo ? true : false);
          var js_path                = settings.js_path;
          var fullscreen             = (settings.sv_fullscreen ? true : false);
          var pos = new google.maps.LatLng(parseFloat(settings.latitude), parseFloat(settings.longitude));

          var sv_heading = settings.sv_heading;
          if (sv_heading == '') {
            sv_heading = 0;
          }
          var sv_zoom = settings.sv_zoom;
          if (sv_zoom == '') {
            sv_zoom = 1;
          }
          var sv_pitch = settings.sv_pitch;
          if (sv_pitch == '') {
            sv_pitch = 0;
          }

          var controlpositions = [];
          controlpositions['tl'] = google.maps.ControlPosition.TOP_LEFT;
          controlpositions['tc'] = google.maps.ControlPosition.TOP_CENTER;
          controlpositions['tr'] = google.maps.ControlPosition.TOP_RIGHT;
          controlpositions['rt'] = google.maps.ControlPosition.RIGHT_TOP;
          controlpositions['rc'] = google.maps.ControlPosition.RIGHT_CENTER;
          controlpositions['rb'] = google.maps.ControlPosition.RIGHT_BOTTOM;
          controlpositions['br'] = google.maps.ControlPosition.BOTTOM_RIGHT;
          controlpositions['bc'] = google.maps.ControlPosition.BOTTOM_CENTER;
          controlpositions['bl'] = google.maps.ControlPosition.BOTTOM_LEFT;
          controlpositions['lb'] = google.maps.ControlPosition.LEFT_BOTTOM;
          controlpositions['lc'] = google.maps.ControlPosition.LEFT_CENTER;
          controlpositions['lt'] = google.maps.ControlPosition.LEFT_TOP;

          // streetview options
          var popt = {
            position: pos,
            pov: {
              heading: parseInt(sv_heading),
              pitch: parseInt(sv_pitch)
            },
            enableCloseButton: false,
            zoom: parseInt(sv_zoom),
            visible: true
          };

          if (addresscontrol) {
            popt.addressControl = true;
            if (addresscontrolposition) {
              popt.addressControlOptions = {position: controlpositions[addresscontrolposition]};
            }
          }
          else {
            popt.addressControl = false;
          }

          if (pancontrol) {
            popt.panControl = true;
            if (pancontrolposition) {
              popt.panControlOptions = {position: controlpositions[pancontrolposition]};
            }
          }
          else {
            popt.panControl = false;
          }

          if (zoomcontrol == 'none') {
            popt.zoomControl = false;
          }
          else {
            popt.zoomControl = true;
            var zco = {};
            if (zoomcontrolposition) {
              zco.position = controlpositions[zoomcontrolposition];
            }
            if (zoomcontrol == 'small') {
              zco.style = google.maps.ZoomControlStyle.SMALL;
            }
            else if (zoomcontrol == 'large') {
              zco.style = google.maps.ZoomControlStyle.LARGE;
            }
            if (zco) {
              popt.zoomControlOptions = zco;
            }
          }

          if (! linkscontrol) {
            popt.linksControl = false;
          }

          if (imagedatecontrol) {
            popt.imageDateControl = true;
          }
          else {
            popt.imageDateControl = false;
          }

          if (! scrollwheel) {
            popt.scrollwheel = false;
          }
          if (! clicktogo) {
            popt.clickToGo = false;
          }

          getlocations_pano[key] = new google.maps.StreetViewPanorama(document.getElementById("getlocations_streetview_canvas_" + key), popt);

          // fullscreen
          if (fullscreen) {
            var fsdiv = '';
            $(document).keydown( function(kc) {
              var cd = (kc.keyCode ? kc.keyCode : kc.which);
              if(cd == 27){
                if($("body").hasClass("svfullscreen-body-" + key)){
                  toggleFullScreen();
                }
              }
            });

            var fsdoc = document.createElement("DIV");
            var fs = new FullScreenControl(fsdoc);
            fsdoc.index = 0;
            getlocations_pano[key].controls[google.maps.ControlPosition.TOP_RIGHT].setAt(0, fsdoc);
          }

        } // end is div

      }); // end each

    }
  };
}(jQuery));
