"use strict";

class Angle {
    static parseRA (rawRA) {
        let value = rawRA.trim();
        if (value === "") {
            return undefined;
        }
        let group = null;
        group = /(\d+)h\s?(\d+)m\s?(\d+(\.\d+)?)s/.exec(value); //ra wiki pattern
        if (group == null) {
            group = /(\d+) (\d+) (\d+(\.\d+)?)/.exec(value); //ra wiki pattern
        }
        if (group != null) {
            let hours = Number(group[1]);
            let minutes = Number(group[2]);
            let seconds = Number(group[3]);
            return (hours + minutes / 60 + seconds / 3600) * 15;
        }
        if (group == null) {
            group = /^[+-]?\d+(\.\d+)?$/.exec(value); // degrees pattern
        }
        if (group != null) {
            return Number(group[0]);
        }
        return undefined;
    }

    static parseDec (rawDec) {
        let value = rawDec.trim();
        if (value === "") {
            return undefined;
        }
        let group = null;
        group = /([+-]?\d+)d\s?(\d+)m\s?(\d+(\.\d+)?)s/.exec(value); //dec letter pattern
        if (group == null) {
            group = /([+-]?\d+)˚\s?(\d+)'\s?(\d+(\.\d+)?)"/.exec(value); //dec wiki pattern
        }
        if (group == null) {
            group = /(\d+) (\d+) (\d+(\.\d+)?)/.exec(value); //dec space pattern
        }
        if (group != null) {
            let degrees = Number(group[1]);
            let minutes = Number(group[2]);
            let seconds = Number(group[3]);
            return degrees + minutes / 60 + seconds / 3600;
        }
        if (group == null) {
            group = /^[+-]?\d+(\.\d+)?$/.exec(value); // degrees pattern
        }
        if (group != null) {
            return Number(group[0]);
        }
        return undefined;
    }

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
