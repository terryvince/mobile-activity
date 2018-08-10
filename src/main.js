import './style.scss';
import './libs/js/suit';
import {RandomNum} from './libs/js/utils';
import jQuery from 'jquery';

(function ({console}) {
  var $ = jQuery;
  /*确定奖项-确定范围-确定度数*/
  var circle = $('.pd-circle');	//操作的转盘
  var pointer = $('.pd-pointer');	//指针
  var leaveCountDiv=$('.pd-head-down');
  var curDeg = 1;				//当前度数
  // var curTime = 0;				//当前运行时长
  var step = 1;					//匀速步长，匀速时每次走的步长
  var speed = 1;				//速度，每次的间隔时间
  var stopDeg = 3 * 360;			//基础停止总圈数
  var leaveCount=3;
  var prizeData = [/*设立的奖项 		odds 中奖几率区间  num奖项占有数目 angles奖项分布范围*/
    {
      name: '一等奖', key: 'first', odds: [1, 100], num: 1, angles: [
        {min: 342, max: 360},
        {min: 1, max: 18}
      ]
    },
    {
      name: '二等奖', key: 'second', odds: [101, 200], num: 1, angles: [
        {min: 54, max: 90}
      ]
    },
    {
      name: '三等奖', key: 'third', odds: [201, 300], num: 1, angles: [
        {min: 126, max: 162}
      ]
    },
    {
      name: '四等奖', key: 'fourth', odds: [301, 400], num: 1, angles: [
        {min: 198, max: 234}
      ]
    },
    {
      name: '五等奖', key: 'fifth', odds: [401, 500], num: 1, angles: [
        {min: 270, max: 306}
      ]
    },
    {
      name: '谢谢参与', key: 'none', odds: [501, 1000], num: 5, angles: [
        {min: 18, max: 54},
        {min: 90, max: 126},
        {min: 162, max: 198},
        {min: 234, max: 270},
        {min: 306, max: 342}]
    }];
  var prizeLen = prizeData.length;			//奖项总数
  // var onePart = parseInt(360 / prizeLen);		//每一项占的度数
  var timerStart = null;

  //启动转盘
  function start() {
    if(leaveCount<1)
    {
      return;
    }
    leaveCount--;
    leaveCountDiv.html('您有'+leaveCount+'次抽奖机会');

    pointer.off('click', start);
    if (curDeg) {
      curDeg = 0;
    }
    var info = calcPrize();
    var endDeg = stopDeg + info.selectDeg;
    var startStep = 0;
    var endStep = 1;
    // var a = 360 / (1 / 2 * Math.pow(1 * 1000, 2));
    var b = ((2 * step * 1 * 1000) - (2 * 360)) / Math.pow(1 * 1000, 2);
    // console.log(info.name);
    timerStart = setInterval(function () {
      if (parseInt(Math.abs(curDeg)) >= endDeg) {
        stop(info);
        return;
      }
      if (Math.abs(curDeg) < 360) {
        startStep += 0.001;				//起步匀加速
        curDeg += (-startStep);
      }
      if (Math.abs(curDeg) > 360 && Math.abs(curDeg) < endDeg - 360) {
        curDeg -= step;					//匀速
      }
      if (Math.abs(curDeg) > endDeg - 360) {
        endStep -= b;						//终止减速
        curDeg += (-endStep);
      }
      circle.css({transform: 'rotateZ(' + curDeg + 'deg)'});
      // curTime += speed;
    }, speed);
  }

  //计算奖项
  function calcPrize() {
    var ran = RandomNum(1, 1001);
    for (var i = 0; i < prizeLen; i++) {
      if (ran > prizeData[i].odds[0] - 1 && ran < prizeData[i].odds[1] + 1) {
        var anglesLen = prizeData[i].angles.length;
        var min, max;
        if (anglesLen == 1) {
          min = prizeData[i].angles[0].min + 5;
          max = prizeData[i].angles[0].max - 5;
          prizeData[i].selectDeg = RandomNum(min, max);
        }
        else {
          var ran1 = RandomNum(0, anglesLen);
          min = prizeData[i].angles[ran1].min + 5;		//避免落点在边界造成混淆
          max = prizeData[i].angles[ran1].max - 5;
          prizeData[i].selectDeg = RandomNum(min, max);
        }
        return prizeData[i];
      }
    }
  }

  //停止转动
  function stop(curInfo) {
    clearInterval(timerStart);
    pointer.on('click', start);
    console.log(curInfo);
    alert(curInfo.name);
  }

  pointer.on('click', start);
})(window);
