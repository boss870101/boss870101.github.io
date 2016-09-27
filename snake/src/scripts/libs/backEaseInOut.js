export var backEaseInOut = function(index, offset, target, framesNum, s){
      if(s == undefined)
        s = 1.70158;
      if((index /= framesNum / 2) < 1)
        return target / 2 * (index * index * (((s *= (1.525)) + 1) * index - s)) + offset;
      else
        return target / 2 * ((index -= 2) * index * (((s *= (1.525)) + 1) * index + s) + 2) + offset;
  };
