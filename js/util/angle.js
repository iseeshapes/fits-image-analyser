"use strict";

class Angle {
  static toRadians(degrees) {
    return degrees * Math.PI / 180.0;
  }

  static toDegrees(radians) {
    return radians * 180.0 / Math.PI;
  }

  static printHours(radians) {
    let negitive = false;
    if (radians < 0) {
      negitive = true;
      radians = radians * -1
    }

    let tenths = Angle.toDegrees(radians) / 15.0;
    let hours = Math.floor(tenths);
    tenths = (tenths - hours) * 60.0;
    let minutes = Math.floor(tenths);
    tenths = (tenths - minutes) * 60.0;
    let seconds = Math.floor(tenths);
    tenths = (tenths - seconds) * 10;
    tenths = Math.round(tenths);

    if (tenths > 9) {
      tenths = 0;
      minutes += 1;
    }

    if (minutes > 59) {
      minutes = 0;
      hours += 1;
    }

    let result = "";
    if (hours < 10) {
      result += " ";
    }
    if (negitive) {
      result += "-";
    }
    result += hours + "h";
    if (minutes < 10) {
      result += "0";
    }
    result += minutes + "m";
    if (seconds < 10) {
      result += "0";
    }
    result += seconds + '.' + tenths + 's';

    return result;
  }

  static printDegrees(radians) {
    let negitive = false;
    if (radians < 0) {
      negitive = true;
      radians = radians * -1
    }
    let tenths = Angle.toDegrees(radians);
    let degrees = Math.floor(tenths);
    tenths = (tenths - degrees) * 60.0;
    let minutes = Math.floor(tenths);
    tenths = (tenths - minutes) * 60.0;
    let seconds = Math.floor(tenths);
    tenths = (tenths - seconds) * 10;
    tenths = Math.round(tenths);

    if (tenths > 9) {
      tenths = 0;
      minutes += 1;
    }

    if (minutes > 59) {
      minutes = 0;
      degrees += 1;
    }

    let result = "";
    if (degrees < 10) {
      result += "  ";
    } else if (degrees < 100) {
      result += " ";
    }
    result = negitive ? "-" : "+";
    result += degrees + "&deg;";
    if (minutes < 10) {
      result += "0";
    }
    result += minutes + "'";
    if (seconds < 10) {
      result += "0";
    }
    result += seconds + '.' + tenths + '"';

    return result;
  }
}
