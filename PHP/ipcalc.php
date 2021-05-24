<?php
    $ip = "192.168.1.1";
    $iparr = explode(".",$ip);
    $prefix = 26;
    $ipbiner =[];
    foreach($iparr as $val){
        $ipbiner[]= IPtoBiner($val);
    }
    $ds = DecimaltoSubnet($prefix);
    $dsb = DecimaltoSubnetBiner($prefix);
    echo sprintf("%s: %s.%s.%s.%s\n", str_pad("IP Biner",12," "), $ipbiner[0],$ipbiner[1],$ipbiner[2],$ipbiner[3]);
    echo sprintf("%s: %s.%s.%s.%s\n", str_pad("IP Decimal",12," "),  str_pad($iparr[0],8), str_pad($iparr[1],8), str_pad($iparr[2],8), str_pad($iparr[3],8));
    echo sprintf("%s: %s\n", str_pad("IP Class",12," "), IPClass($iparr[0]));
    echo sprintf("%s: %s.%s.%s.%s\n", str_pad("Subnet Biner",12," "), $dsb[0],$dsb[1],$dsb[2],$dsb[3]);
    echo sprintf("%s: %s.%s.%s.%s\n", str_pad("Subnet Mask",12," "),  str_pad($ds[0],8), str_pad($ds[1],8), str_pad($ds[2],8), str_pad($ds[3],8));
    echo "Subnet Range:\n".sprintf("| %s | %s | %s |\n", str_pad("Network",16), str_pad("Usable Host Range",35),str_pad("Broadcast",16));
    foreach(SubnetAll($prefix,$iparr) as $val){
        echo sprintf("| %s | %s - %s | %s |\n", str_pad($val[0],16),str_pad($val[1],16),str_pad($val[2],16),str_pad($val[3],16));
    }
    function IPtoBiner($octet){
        $data = [];
        while ($octet!=0){
            $hasil = $octet % 2;
            $octet = intval($octet / 2);
            $data[]=$hasil;
        }
        return str_pad(implode("", array_reverse($data)),8,"0",STR_PAD_LEFT);
    }
    function IPClass($firstoctet){
        if(intval($firstoctet)<=126){
            return 'A';
        }else if(intval($firstoctet)<=191){
            return 'B';
        }else if(intval($firstoctet)<=223){
            return 'C';
        }else if(intval($firstoctet)<=239){
            return 'D';
        }else if(intval($firstoctet)<=254){
            return 'E';
        }
    }
    function BinertoIP($a){
        $total = 0;
        $a = implode("",array_reverse(str_split($a)));
        for ($i = 0; $i < strlen($a); $i++) {	
            if($a[$i] == "1") $total += 2**$i;
        }
        return $total;
    }
    function DecimaltoSubnet($a){
        $subnet = [];
        for ($x = 0; $x < 4; $x++) {
            $data = "";
            for ($i = 0; $i < 8; $i++) {
                $data=$data.(($a>0)?'1':'0');
                $a-=1;
            }
            $subnet[]=BinertoIP($data);
        }
        return $subnet;
    }
    function DecimaltoSubnetBiner($a){
        $subnet = [];
        for ($x = 0; $x < 4; $x++) {
            $data = "";
            for ($i = 0; $i < 8; $i++) {
                $data=$data.(($a>0)?'1':'0');
                $a-=1;
            }
            $subnet[] = $data;
        }
        return $subnet;
    }
    function SubnetAll($prefix,$ip){
        $all = [];
        $subnet = DecimaltoSubnet($prefix);
        $to = (256-intval($subnet[3]));
        $ip1to3 = $ip[0].".".$ip[1].".".$ip[2].".";
        for ($i = 0; $i < 255; $i+=$to) {
            $all[]=[$ip1to3."$i",$ip1to3.strval($i+1),$ip1to3.strval($i+$to-2),$ip1to3.strval($i+$to-1)];
        }
        return $all;
    }
?>