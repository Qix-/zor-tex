/**
 * Zor-Tex.js
 *
 *  A powerline-esqe bash prompt
 */

(function() {
  'use strict';

  // Get console width (can be modified by a cmd-arg)
  var consoleWidth = process.stdout.columns;

  // Setup our theme.
  var theme = {
      'rootBG': '48;5;214'
    , 'rootFG': '1;38;5;130'
    , 'pathBG': '48;5;235'
    , 'pathFG': '38;5;249'
    , 'restBG': '48;5;233'
    , 'restFG': '38;5;238'
    , 'connectorLeft': '\u25b6'
    , 'connectorLeftRest': '\u3009'
  };

  // Setup segmentation function
  function genLeftSegment(segments) {
    var result = '\n';
    for (var i = 0, len = segments.length; i < len; i++) {
      var last = i+1 == len;
      var segment = ' ' + segments[i] + ' ';
      var codes = getSegmentCodes(i);

      // Set codes
      result += makeCode(codes.fg, codes.bg);
      result += segment;

      // Last?
      if (last) {
        result += invert(makeCode(codes.bg));
        result += theme.connectorLeft;
      } else {
        // Get next
        var nextCodes = getSegmentCodes(i + 1);

        result += makeCode(
            nextCodes.bg,
            codes.connectorFG
              ? codes.fg
              : invert(codes.bg));
        result += codes.connectorLeft;
      }
    }

    // Kill color and return
    result += makeCode();
    return result;
  }

  // Gets the segment codes based on the index
  //  Starts at 0
  function getSegmentCodes(index) {
    switch (index) {
      case 0:
        return {
            'bg': theme['rootBG']
          , 'fg': theme['rootFG']
          , 'connectorLeft' : theme['connectorLeft']
          , 'connectorFG': false
        }
      case 1:
        return {
            'bg': theme['pathBG']
          , 'fg': theme['pathFG']
          , 'connectorLeft' : theme['connectorLeft']
          , 'connectorFG': false
        }
      default:
        return {
            'bg': theme['restBG']
          , 'fg': theme['restFG']
          , 'connectorLeft' : theme['connectorLeftRest']
          , 'connectorFG': true
        }
    }
  }

  // Hard invert
  function invert(code) {
    return code.replace(/(^|;)(3|4)(\d)($|;)/g, function(m, l, w, d, r) {
      var w = w == 3
        ? 4
        : 3;

      return l + w + d + r;
    });
  }

  // Makes a code (vararg)
  function makeCode() {
    var result = '\x1b[0'
    for (var i = 0, len = arguments.length; i < len; i++) {
      var code = arguments[i];
      var codes = code.split(/\;+/g);
      for (var j = 0, jlen = codes.length; j < jlen; j++) {
        result += ';' + codes[j];
      }
    }

    result += 'm';
    return result;
  }

  // Clips segments given the console width
  function clipSegments(segments) {
    segments.reverse();

    var approved = [];
    var totalWidth = 0;
    do {
      var segment;
      do {
       segment = segments.pop();
      } while((segment = segment.trim()).length === 0);

      // Is it a width specifier?
      var matches;
      if ((matches = /^\+(\d+)$/.exec(segment)) !== null) {
        consoleWidth = parseInt(matches[1]);
        continue;
      }

      totalWidth += segment.length + 3;
      if (totalWidth > consoleWidth) {
        break;
      } else {
        approved.push(segment);
      }
    } while(segments.length);

    return approved;
  }

  // Echo out segments
  var segments = clipSegments(process.argv.slice(2));
  var line = genLeftSegment(segments);
  console.log(line);
})();
