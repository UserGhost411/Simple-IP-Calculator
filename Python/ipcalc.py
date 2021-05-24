def IPtoBiner(a):
    sisa = a
    data = []
    while (sisa!=0):
        hasil = sisa % 2
        sisa = int(sisa / 2)
        data.insert(0,str(hasil))
    return ("".join(data)).rjust(8,'0')
def BinertoIP(a):
    total = 0
    a = a[::-1]
    for i in range(0, len(a)):
        if(a[i] == "1"):total += 2**i
    return total
def DecimaltoSubnet(a):
    subnet = []
    for i in range(4):
        data = ""
        for i in range(8):
            data+='1' if a>0 else '0'
            a-=1
        subnet.append(str(BinertoIP(data)))
    return subnet
def SubnetAll(a,ip):
    all = []
    a = DecimaltoSubnet(a)
    to = (256-int(a[3]))
    ip1to3 = ip.split(".")[0]+"."+ip.split(".")[1]+"."+ip.split(".")[2]+".";
    for i in range(0,255,to):
        all.append([ip1to3+str(i) ,ip1to3+str(i+1) , ip1to3+str(i+to-2) ,ip1to3+str(i+to-1)])
    return all;
def IPClass(firstoctet):
    if(int(firstoctet)<=126):
        return 'A'
    elif(int(firstoctet)<=191):
        return 'B'
    elif(int(firstoctet)<=223):
        return 'C'
    elif(int(firstoctet)<=239):
        return 'D'
    elif(int(firstoctet)<=254):
        return 'E'
def DecimaltoSubnetBiner(a):
    subnet = []
    for i in range(4):
        for i in range(8):
            data='1' if a>0 else '0'
            a-=1
            subnet.append(str(data))
        subnet.append('.')
    return ("".join(subnet))[:-1]
print("{:=>38}{:=<38}\n{:>38}{:<38}\n".format("IP Cal","culator","By User","Ghost411"))
ip = str(input("masukan alamat IPV4:") or '192.168.1.1')
prefix = int(input("masukan Prefix ({}/x):".format(ip)) or 24)
ipbiner = ''
ipdeci = []
subnet = DecimaltoSubnet(prefix)
for x in ip.split("."):
    ipbiner+=IPtoBiner(int(x))+"."
for x in ipbiner[0:-1].split("."):
    ipdeci.append(str(BinertoIP(x)))
print("\n{:12}: {:35}".format("IP Biner",ipbiner[0:-1]))
print("{:12}: {:8}.{:8}.{:8}.{:8}".format("IP Decimal",ipdeci[0],ipdeci[1],ipdeci[2],ipdeci[3]))
print("{:12}: {:35}".format("IP Class",IPClass(ipdeci[0])))
print("{:12}: {:35}".format("Subnet Biner",DecimaltoSubnetBiner(prefix)))
print("{:12}: {:8}.{:8}.{:8}.{:8}".format("Subnet Mask",subnet[0],subnet[1],subnet[2],subnet[3]))
print("Subnet Range:")
print("| {:16} | {:35} | {:16}|".format("Network","Usable Host Range","Broadcast"))
for a in SubnetAll(prefix,"{}.{}.{}.{}".format(ipdeci[0],ipdeci[1],ipdeci[2],ipdeci[3])):
    print("| {:16} | {:16} - {:16} | {:16}|".format(a[0],a[1],a[2],a[3]))