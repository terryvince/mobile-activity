import './style.scss';
import './libs/js/suit';
import {RandomNum} from './libs/js/utils';
import jQuery from 'jquery';

(function ({console}) {
  let $ = jQuery;
  let redpacket = $('.dm-redpackt-main').find('.redpacket');
  let shadow=$('.dm-shadow');
  let dialogTile=$('.dm-shadow').find('.top');
  let dialogWordOne=$('.dm-shadow').find('.word-one');
  let dialogWordTwo=$('.dm-shadow').find('.word-two');
  let bgTitle={none:'top-gray',prize:'top-red'};
  let prizeData = [
    {name: '未中奖', key: 'none', odds: [1, 500]},
    {name: '1等奖', key: 'first', odds: [501, 600]},
    {name: '2等奖', key: 'second', odds: [601, 700]},
    {name: '3等奖', key: 'third', odds: [701, 800]},
    {name: '4等奖', key: 'fourth', odds: [801, 900]},
    {name: '5等奖', key: 'fifth', odds: [901, 1000]},
  ];

  //计算奖励
  function calcPrice(data) {
    let ran=RandomNum(1,1001);
    for (const prize of data) {
      if(ran>prize.odds[0]-1 && ran<prize.odds[1])
      {
        return prize;
      }
    }
  }

  redpacket.click(() => {
    let result = calcPrice(prizeData);
    shadow.css({display:'block'});
    if(result.key==='none')
    {
      dialogTile.html('很遗憾！').addClass(bgTitle.none).removeClass(bgTitle.prize);
      dialogWordOne.show();
      dialogWordTwo.hide();
    }
    else{
      dialogTile.html('恭喜中奖！').addClass(bgTitle.prize).removeClass(bgTitle.none);
      $(dialogWordTwo.children('p')[0]).html('恭喜获得'+result.name);
      dialogWordTwo.show();
      dialogWordOne.hide();
    }
    result;
  });
  shadow.click(function(){
    $(this).attr('style','');
  });
  $(window).bind( 'orientationchange', function(e){
    console.log(e);
  });
})(window);
