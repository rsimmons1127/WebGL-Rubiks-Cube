function XRot(cubies) {
    var temp = cubies[3];
    cubies[3] = cubies[9];
    cubies[9] = cubies[27];
    cubies[27] = cubies[21];
    cubies[21] = temp;

    temp = cubies[6];
    cubies[6] = cubies[18];
    cubies[18] = cubies[24];
    cubies[24] = cubies[12];
    cubies[12] = temp;

    var temp = cubies[1];
    cubies[1] = cubies[7];
    cubies[7] = cubies[25];
    cubies[25] = cubies[19];
    cubies[19] = temp;

    var temp = cubies[4];
    cubies[4] = cubies[16];
    cubies[16] = cubies[22];
    cubies[22] = cubies[10];
    cubies[10] = temp;

    var temp = cubies[2];
    cubies[2] = cubies[8];
    cubies[8] = cubies[26];
    cubies[26] = cubies[20];
    cubies[20] = temp;

    var temp = cubies[5];
    cubies[5] = cubies[17];
    cubies[17] = cubies[23];
    cubies[23] = cubies[11];
    cubies[11] = temp;   
}

function XPRot(cubies) {
    XRot(cubies);
    XRot(cubies);
    XRot(cubies);
}

function YRot(cubies) {
    var temp = cubies[1];
    cubies[1] = cubies[7];
    cubies[7] = cubies[9];
    cubies[9] = cubies[3];
    cubies[3] = temp;

    var temp = cubies[2];
    cubies[2] = cubies[4];
    cubies[4] = cubies[8];
    cubies[8] = cubies[6];
    cubies[6] = temp;

    var temp = cubies[19];
    cubies[19] = cubies[25];
    cubies[25] = cubies[27];
    cubies[27] = cubies[21];
    cubies[21] = temp;

    var temp = cubies[20];
    cubies[20] = cubies[22];
    cubies[22] = cubies[26];
    cubies[26] = cubies[24];
    cubies[24] = temp;

    var temp = cubies[10];
    cubies[10] = cubies[16];
    cubies[16] = cubies[18];
    cubies[18] = cubies[12];
    cubies[12] = temp;

    var temp = cubies[11];
    cubies[11] = cubies[13];
    cubies[13] = cubies[17];
    cubies[17] = cubies[15];
    cubies[15] = temp;
}

function YPRot(cubies) {
    YRot(cubies);
    YRot(cubies);
    YRot(cubies);
}

function ZRot(cubies) {
    XRot(cubies);
    YRot(cubies);
    XPRot(cubies);
}

function ZPRot(cubies) {
    ZRot(cubies);
    ZRot(cubies);
    ZRot(cubies);
}

function RTurn(cubies) {
	var temp = cubies[3];
    cubies[3] = cubies[9];
    cubies[9] = cubies[27];
    cubies[27] = cubies[21];
    cubies[21] = temp;

    temp = cubies[6];
    cubies[6] = cubies[18];
    cubies[18] = cubies[24];
    cubies[24] = cubies[12];
    cubies[12] = temp;
}

function RPTurn(cubies) {
	RTurn(cubies);
	RTurn(cubies);
    RTurn(cubies);	
}

function LTurn(cubies) {
    YRot(cubies);
    YRot(cubies);
    RTurn(cubies);
    YRot(cubies);
    YRot(cubies);
}

function LPTurn(cubies) {
    LTurn(cubies);
    LTurn(cubies);
    LTurn(cubies);  
}

function FTurn(cubies) {
    YPRot(cubies);
    RTurn(cubies);
    YRot(cubies);
}

function FPTurn(cubies) {
    FTurn(cubies);
    FTurn(cubies);
    FTurn(cubies);  
}

function BTurn(cubies) {
    YRot(cubies);
    RTurn(cubies);
    YPRot(cubies);
}

function BPTurn(cubies) {
    BTurn(cubies);
    BTurn(cubies);
    BTurn(cubies);  
}

function UTurn(cubies) {
    ZRot(cubies);
    RTurn(cubies);
    ZPRot(cubies);
}

function UPTurn(cubies) {
    UTurn(cubies);
    UTurn(cubies);
    UTurn(cubies);  
}

function DTurn(cubies) {
    ZPRot(cubies);
    RTurn(cubies);
    ZRot(cubies);
}

function DPTurn(cubies) {
    DTurn(cubies);
    DTurn(cubies);
    DTurn(cubies);  
}

