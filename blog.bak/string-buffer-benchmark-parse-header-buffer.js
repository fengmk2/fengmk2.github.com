var SPACE = 0x20, // ' '
    COLON = 0x3a, // 58, :
    NEWLINE = 0x0a, // \n
    ENTER = 0x0d; // \r

exports.parse = function parse(data) {
    var line_start = 0, len = data.length;
    for(var i = 0 ; i < len; i++) {
        // Host: xxx.abc.com
        if(data[i] === COLON) {
            var key = data.toString('ascii', line_start, i).toLowerCase();
            i++; // skip ':'
            if(key === 'host') {
                var value_start = i;
                while(i < len) {
                    if(data[i] === ENTER) {
                        return data.toString('ascii', value_start, i).trim().toLowerCase();
                    }
                    i++;
                }
            }
        } else if(data[i] ===  ENTER && data[i+1] === NEWLINE) {
            i += 2;
            line_start = i;
            if(data[i] ===  ENTER && data[i+1] === NEWLINE) {
                // \r\n\r\n
                return 'Host header not found';
            }
        }
    }
    return null;
};