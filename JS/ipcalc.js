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
let totalIP = 2 ** (32 - prefix);
let totalNetwork = maxIP_perClass(IPClass(prefix)) / totalIP // total network  =  maximum ip devided by total ip per network

console.log("{0}: {1}".format("IP Biner".padEnd(12),ipbiner.join(".").substring(0,39)));
console.log("{0}: {1}".format("IP Decimal".padEnd(12),"{0}.{1}.{2}.{3}".format(iparr[0].padEnd(8),iparr[1].padEnd(8),iparr[2].padEnd(8),iparr[3].padEnd(8))));
console.log("{0}: {1}".format("IP Class".padEnd(12),IPClass(prefix))); // ip classification based on netmask or prefix
console.log("{0}: {1}".format("Subnet Mask".padEnd(12),DecimaltoSubnetBiner(prefix).join(".").substring(0,39)));
console.log("{0}: {1}".format("Subnet Biner".padEnd(12),"{0}.{1}.{2}.{3}".format(subnetbin[0].padEnd(8),subnetbin[1].padEnd(8),subnetbin[2].padEnd(8),subnetbin[3].padEnd(8))));

console.log("Total Network : {0}".format(totalNetwork));
console.log("Total IP per Network: {0}".format(totalIP));
console.log("Hosts per Network: {0}".format(totalIP - 2));

console.log("Network Range:");
console.log("| {0} | {1} | {2}|".format("Network".padEnd(16), "Usable Host Range".padEnd(35), "Broadcast".padEnd(16)));
for (a of RangeNetworkClass(prefix, IPClass(prefix), iparr, totalNetwork)) {
	console.log("| {0} | {1} - {2} | {3}|".format(a[0].padEnd(16), a[1].padEnd(16), a[2].padEnd(16), a[3].padEnd(16)))
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

// use netmask for ip classification instead of first octet block
function IPClass(prefixNetmask) {
	if (parseInt(prefixNetmask) >= 24) {
		return 'C'
	} else if (parseInt(prefixNetmask) >= 16) {
		return 'B'
	} else if (parseInt(prefixNetmask) >= 8) {
		return 'A'
	} else if (parseInt(prefixNetmask) >= 1) {
		return 'a'
	}
}

// return maximum total ip per class (based on the cidr 1, 8, 16, 24)
// source https://www.freecodecamp.org/news/subnet-cheat-sheet-24-subnet-mask-30-26-27-29-and-other-ip-address-cidr-network-references/
function maxIP_perClass(classIP) {

	// prefix 1 is still classified as class a
	// but to distinguish prefixes 8 and 1
	// prefixes 1 - 7 will be written using a lowercase a
	if (classIP === 'a') {
		return 4294967296
	} else if (classIP === 'A') {
		return 16777216
	} else if (classIP === 'B') {
		return 65536
	} else if (classIP === 'C') {
		return 256
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

// thanks to Joshua K answer on https://stackoverflow.com/questions/32978982/calculate-ip-range-from-ip-string-equal-to-x-x-x-x-x
function baseIPandBroadcastIP(prefix, ip) {
	// get netmask from prefix
	let netmaskblocks = ["0", "0", "0", "0"];
	netmaskblocks = ("1".repeat(parseInt(prefix, 10)) + "0".repeat(32 - parseInt(prefix, 10))).match(/.{1,8}/g);
	netmaskblocks = netmaskblocks.map(function (el) { return parseInt(el, 2); });

	let baseAddress = ip.map(function (block, idx) { return block & netmaskblocks[idx]; });

	// highest ip adress in network (broadcast)
	let invertedNetmaskBlocks = netmaskblocks.map(function (el) { return el ^ 255; });
	let broadcastaddress = baseAddress.map(function (block, idx) { return block | invertedNetmaskBlocks[idx]; });

	return [baseAddress.join('.'), broadcastaddress.join('.')];
}

function RangeNetworkClass(prefix, classip, ip, totalnetwork) {
	let rangeIP = [];
	let indexOctet;
	let temp_address = ip;

	if (classip === 'C') {
		indexOctet = 3
	} else if (classip === 'B') {
		indexOctet = 2
	} else if (classip === 'A') {
		indexOctet = 1
	} else if (classip === 'a') {
		indexOctet = 0
	}

	// make the first ip to be 0.0.0.0 based on class ip for sorted results
	for (let index = 0; index < temp_address.length; index++) {
		if (index >= indexOctet) {
			temp_address[index] = 0
		}
	}
	
	for (let i = 0; i < totalnetwork; i++) {
		let address = baseIPandBroadcastIP(prefix, temp_address) // address[0] = base IP, address[1] = broadcast IP
		let fisrtIP = address[0].split(".");
		let lastIP = address[1].split(".");

		// switch temp_address to broadcast address + 1
		let broadcast = address[1].split(".");
		broadcast[indexOctet] = parseInt(broadcast[indexOctet]) + 1; // adapt to ip class
		temp_address = broadcast;

		// change last block of ip address
		fisrtIP[3] = parseInt(fisrtIP[3]) + 1;
		lastIP[3] = parseInt(lastIP[3]) - 1;

		rangeIP.push([address[0], fisrtIP.join('.'), lastIP.join('.'), address[1]]);
	}

	return rangeIP;
}