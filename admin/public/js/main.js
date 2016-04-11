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