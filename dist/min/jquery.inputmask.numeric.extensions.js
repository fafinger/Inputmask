(function(h){h.extend(h.inputmask.defaults.aliases,{decimal:{mask:"~",placeholder:"",repeat:10,greedy:!1,numericInput:!0,digits:"*",groupSeparator:"",radixPoint:".",groupSize:3,autoGroup:!1,allowPlus:!0,allowMinus:!0,getMaskLength:function(d,f,e,b,a){var c=d.length;!f&&1<e&&(c+=d.length*(e-1));d=h.inputmask.escapeRegex.call(this,a.groupSeparator);a=h.inputmask.escapeRegex.call(this,a.radixPoint);b=b.join("");a=b.replace(RegExp(d,"g"),"").replace(RegExp(a),"");return c+(b.length-a.length)},postFormat:function(d,
f,e,b){if(""==b.groupSeparator)return f-1;var a=d.slice();e||a.splice(f,0,"?");a=a.join("");if(b.autoGroup||e&&-1!=a.indexOf(b.groupSeparator)){for(var c=h.inputmask.escapeRegex.call(this,b.groupSeparator),a=a.replace(RegExp(c,"g"),""),c=a.split(b.radixPoint),a=c[0],g=RegExp("([-+]?[\\d?]+)([\\d?]{"+b.groupSize+"})");g.test(a);)a=a.replace(g,"$1"+b.groupSeparator+"$2"),a=a.replace(b.groupSeparator+b.groupSeparator,b.groupSeparator);1<c.length&&(a+=b.radixPoint+c[1])}d.length=a.length;b=0;for(c=a.length;b<
c;b++)d[b]=a.charAt(b);f=e?f:h.inArray("?",d);e||d.splice(f,1);return f},regex:{number:function(d,f,e,b,a,c){d=h.inputmask.escapeRegex.call(this,d);e=h.inputmask.escapeRegex.call(this,e);b=isNaN(b)?b:"{0,"+b+"}";return RegExp("^"+("["+(a?"+":"")+(c?"-":"")+"]?")+"(\\d+|\\d{1,"+f+"}(("+d+"\\d{"+f+"})?)+)("+e+"\\d"+b+")?$")}},onKeyDown:function(d,f,e){var b=h(this);if(d.keyCode==e.keyCode.TAB){if(d=h.inArray(e.radixPoint,f),-1!=d){for(var a=b.data("inputmask").masksets,b=b.data("inputmask").activeMasksetIndex,
c=1;c<=e.digits&&c<e.getMaskLength(a[b]._buffer,a[b].greedy,a[b].repeat,f,e);c++)void 0==f[d+c]&&(f[d+c]="0");this._valueSet(f.join(""))}}else if(d.keyCode==e.keyCode.DELETE||d.keyCode==e.keyCode.BACKSPACE)e.postFormat(f,0,!0,e),this._valueSet(f.join(""))},definitions:{"~":{validator:function(d,f,e,b,a){if(""==d)return!1;if(1>=e&&"0"===f[0]&&/[\d-]/.test(d))return f[0]="",{pos:0};var c=b?f.slice(0,e):f.slice();c.splice(e+1,0,d);c=c.join("");if(a.autoGroup&&!b)var g=h.inputmask.escapeRegex.call(this,
a.groupSeparator),c=c.replace(RegExp(g,"g"),"");g=a.regex.number(a.groupSeparator,a.groupSize,a.radixPoint,a.digits,a.allowPlus,a.allowMinus).test(c);if(!g&&(c+="0",g=a.regex.number(a.groupSeparator,a.groupSize,a.radixPoint,a.digits,a.allowPlus,a.allowMinus).test(c),!g)){g=c.lastIndexOf(a.groupSeparator);for(i=c.length-g;3>=i;i++)c+="0";g=a.regex.number(a.groupSeparator,a.groupSize,a.radixPoint,a.digits,a.allowPlus,a.allowMinus).test(c);if(!g&&!b&&d==a.radixPoint&&(g=a.regex.number(a.groupSeparator,
a.groupSize,a.radixPoint,a.digits,a.allowPlus,a.allowMinus).test("0"+c+"0")))return f[e]="0",e++,{pos:e}}return!1!=g&&!b&&d!=a.radixPoint?{pos:a.postFormat(f,e+1,!1,a)}:g},cardinality:1,prevalidator:null}},insertMode:!0,autoUnmask:!1},integer:{regex:{number:function(d,f,e,b,a,c){d=h.inputmask.escapeRegex.call(this,d);return RegExp("^"+("["+(a?"+":"")+(c?"-":"")+"]?")+"(\\d+|\\d{1,"+f+"}(("+d+"\\d{"+f+"})?)+)$")}},alias:"decimal"}})})(jQuery);