        // window height for slide right content
              var windowHeight = $(window).height();
                   $(window).on("resize", function () {
                 $('#scrolling-content').css('height', windowHeight - 174);
                }).resize();
        
       // slim scrolling
        $('#scrolling-content').slimScroll({
            color: '#23b4a5',
            height:  windowHeight - 174
        });
        
        // slide content from right to left - FOR PREDICATION
        $(function() {            
             // $('#content-slide').hide();
               $(".expert-predic-btn").click(function() {
                   $('body').prepend('<div id="overlay-shade" onclick="funcClose(this);"></div>');
                   $('body').addClass('overflowAdd');
                $('#content-slide').toggle('slide', { direction: 'right' }, 700);
              });
              $("#ClosePanel").click(function() {
                  $('#overlay-shade').fadeOut();
                   $('body').removeClass('overflowAdd');
                 $('#content-slide').toggle('slide', { direction: 'right' }, 700);
            });
        });
        
        
        // slide content from right to left - FOR PROFILE
        $(function() {            
             // $('#content-slide').hide();
               $(".profile-view").click(function() {
                   $('body').addClass('overflowAdd');
                   $('body').prepend('<div id="overlay-shade" onclick="funcClose(this);"></div>');
                  $('#profile-slide').toggle('slide', { direction: 'right' }, 700);
              });
              $("#CloseProfile").click(function() {
                  $('#overlay-shade').fadeOut();
                   $('body').removeClass('overflowAdd');
              $('#profile-slide').toggle('slide', { direction: 'right' }, 700);
            });
        });
        
        function funcClose() {
               $("#overlay-shade").hide();
                $('body').removeClass('overflowAdd');
                 $('#content-slide').hide('slide', { direction: 'right' }, 700);
                  $('#profile-slide').hide('slide', { direction: 'right' }, 700);
            }