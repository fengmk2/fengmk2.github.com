# vi Learn on the road

## vim config file

    # .vimrc config by me
    set expandtab 
    set tabstop=4
    set shiftwidth=4
    set nonumber
    set smarttab

k up l right j down h right;
space right;
G move cursor to header of end line of file; 

    function foo(abc){
    	console.log('hello world');
    };

u undo last change; U undo all changes to entire line;

dd delete current cursor line.
3dd delete next 3 lines;
D delete contents of line after cursor;
C delete contents of line after cursor and insert;

dw delete word
cw change word
x delete char at curosr. 

R Overwrite char form cursor onward;
s Substitute entire line
abc on right

    function a(){
    	function() {
    		console.log('hello world');
    	}
    }

    :r !date
    2011年 04月 01日 星期五 20:52:55 CST

查找当前单词

    :s/\t/    /g
    
replace tab to 4 space in current line.(how to replace all?)
