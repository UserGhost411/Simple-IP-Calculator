//Thanks to biesiad https://gist.github.com/biesiad/889139
String.prototype.rjust = function( length, char ) {
	var fill = [];
	while ( fill.length + this.length < length ) {
		fill[fill.length] = char;
	}
	return  fill.join('')+this ;
}
//Thanks to fearphage https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) { 
	return typeof args[number] != 'undefined'
		? args[number]
		: match
	;
	});
};
console.log('%cIP Calculator by '+'%cUserGhost411', 'font-size:20px;color: #bada55', 'font-size:20px;color: blue;background:white;');
console.log('%chttps://github.com/UserGhost411/Simple-IP-Calculator\n', 'color:#bada55;background:black;');
var ip = prompt("masukan alamat ip","192.168.1.1")
var iparr = ip.split(".");
var ipbiner=[];
var prefix = prompt("masukan prefix",24)
var subnetbin = DecimaltoSubnet(prefix);
for(octet of iparr){
	ipbiner.push(iptobiner(parseInt(octet)))
}
console.log("{0}: {1}".format("IP Biner".padEnd(12),ipbiner.join(".").substring(0,39)));
console.log("{0}: {1}".format("IP Decimal".padEnd(12),"{0}.{1}.{2}.{3}".format(iparr[0].padEnd(8),iparr[1].padEnd(8),iparr[2].padEnd(8),iparr[3].padEnd(8))));
console.log("{0}: {1}".format("IP Class".padEnd(12),IPClass(iparr[0])));
console.log("{0}: {1}".format("Subnet Mask".padEnd(12),DecimaltoSubnetBiner(prefix).join(".").substring(0,39)));
console.log("{0}: {1}".format("Subnet Biner".padEnd(12),"{0}.{1}.{2}.{3}".format(subnetbin[0].padEnd(8),subnetbin[1].padEnd(8),subnetbin[2].padEnd(8),subnetbin[3].padEnd(8))));
console.log("Subnet Range:"); 
console.log("| {0} | {1} | {2}|".format("Network".padEnd(16),"Usable Host Range".padEnd(35),"Broadcast".padEnd(16)));
for(a of SubnetAll(prefix,iparr)){
	console.log("| {0} | {1} - {2} | {3}|".format(a[0].padEnd(16),a[1].padEnd(16),a[2].padEnd(16),a[3].padEnd(16)))
}
function iptobiner(ip){
	var data = []
	while (ip!=0){
		hasil = (ip % 2);
		ip = parseInt(ip / 2);
		data.push(hasil);
	}
	data.reverse()
	return (data.join("")).rjust(8,'0');
}
function IPClass(firstoctet){
	if(parseInt(firstoctet)<=126){
		return 'A'
	}else if(parseInt(firstoctet)<=191){
		return 'B'
	}else if(parseInt(firstoctet)<=223){
		return 'C'
	}else if(parseInt(firstoctet)<=239){
		return 'D'
	}else if(parseInt(firstoctet)<=254){
		return 'E'
	}
}
function BinertoIP(a){
	var total = 0
	a = a.split("").reverse().join("");
	for (var i = 0; i < a.length; i++) {	
		if(a[i] == "1") total += 2**i
	}
	return total;
}
function DecimaltoSubnet(a){
	var subnet = []
	for (var x = 0; x < 4; x++) {
		var data = ""
		for (var i = 0; i < 8; i++) {
			data+=((a>0)?'1':'0')
			a-=1
		}
		subnet.push(BinertoIP(data).toString())
	}
	return subnet
}
function DecimaltoSubnetBiner(a){
	var subnet = []
	for (var x = 0; x < 4; x++) {
		var data = ""
		for (var i = 0; i < 8; i++) {
			data+=((a>0)?'1':'0')
			a-=1
		}
		subnet.push(data)
	}
	return subnet
}
function SubnetAll(prefix,ip){
	var all = []
	var subnet = DecimaltoSubnet(prefix)
	var to = (256-parseInt(subnet[3]))
	var ip1to3 = ip[0]+"."+ip[1]+"."+ip[2]+".";
	for (var i = 0; i < 255; i+=to) {
		all.push([ip1to3+i.toString() ,ip1to3+(i+1).toString() , ip1to3+(i+to-2).toString() ,ip1to3+(i+to-1).toString()])
	}
	return all;
}