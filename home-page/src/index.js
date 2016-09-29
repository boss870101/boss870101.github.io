setTimeout( function(){
  $('.photo').animate( { marginTop: 100 },1000,
    function(){ 
      $('p:nth-child(2)').animate( { opacity: 1 },1000,
        function(){ 
          $('p:nth-child(3)').animate({ width: '100%'},500,
            function(){
              $('p:nth-child(4)').animate({ opacity: 1 }, 200,
                function(){
                  $('p:nth-child(5)').animate({ opacity: 1 },200,
                    function(){
                      $('p:nth-child(6)').animate({ opacity: 1 }, 200);
                    }
                  );   
                }  
              );
            }
          );
        }
      );     
    }
  );
}, 10); 


