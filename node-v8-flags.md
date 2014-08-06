# Flags:

`--nouse-idle-notification`: 
does not disable automatic GC in V8. 
What it does is tells V8 not to perform GC actions (be it advance the sweeper, 
incremental marker or do a full GC) 
in response to IdleNotifications that embedder (node.js in this 
case) sends to V8. If V8 sees fit (e.g. on allocation failure) it 
_will_ perform it and you can't disable that. Calling gc() force a 
full non-incremental collection which is much more expensive than (and 
is quite different from) from incremental collections that V8 tries to 
use during the normal run of your program. 
[link](https://groups.google.com/forum/#!topic/nodejs/BO6JdYi4n2k%5B1-25%5D)

"In our experience, disabling idle notification is all good and no bad.  This seems like something that would make a reasonable default change."