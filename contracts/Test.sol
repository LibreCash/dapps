contract Test {
    uint public number = 10;
    
    function destruct() public {
        selfdestruct(0x0);
    }
    
    function getNumber() public returns(uint){
        return number + 10;
    }
    
    function geNumberView() public view returns(uint) {
        return number + 11;
    }
    
    function add() public {
        number++;
    }
}