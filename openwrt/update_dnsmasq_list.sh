echo "running gfwlist2dnsmasq.py..."
python gfwlist2dnsmasq.py > gfwlist2dnsmasq.log
mkdir -p /etc/dnsmasq.d
ls -al /etc/dnsmasq.d/dnsmasq_list.conf
mv dnsmasq_list.conf /etc/dnsmasq.d/dnsmasq_list.conf
ls -al /etc/dnsmasq.d/dnsmasq_list.conf
echo "dnsmasq restart..."
/etc/init.d/dnsmasq restart
echo "all done"

