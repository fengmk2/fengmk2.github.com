# cnode 迁移

$ scp root@42.121.86.107:/home/admin/cnae/club_dump.tar ./

club_dump.tar                                                                                                               100%   22MB  87.7KB/s   04:20  

$ tar xvf club_dump.tar

$ mongorestore --dir club_dump
