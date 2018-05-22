let bannerImg = document.querySelector( '.banner-img' );
const isMobile = /mobile/gi.test( navigator.userAgent );
if( isMobile ){
  bannerImg.src = 'http://ijsuc.com/images/banner-log-mobel.jpg';
}else{
  bannerImg.src = 'http://ijsuc.com/images/banner-log.jpg';
}