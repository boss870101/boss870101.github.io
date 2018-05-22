const sinusoidal = (index, offset, target, framesNum) =>
  target * Math.sin(index / framesNum * (Math.PI / 2)) + offset;
export default sinusoidal;