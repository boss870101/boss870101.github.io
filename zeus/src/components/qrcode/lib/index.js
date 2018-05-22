import QRCode from "./QRCode";
import ErrorCorrectLevel from "./ErrorCorrectLevel";

const qrcode = function(data, opt) {
  opt = opt || {};
  const qr = new QRCode(opt.typeNumber || -1,
            ErrorCorrectLevel[opt.errorCorrectLevel] || ErrorCorrectLevel.H);
  qr.addData(data);
  qr.make();
  return qr;
};

export default qrcode;

