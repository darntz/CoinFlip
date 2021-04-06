pragma solidity 0.5.16;

contract CoinFlip{

   address public manager;

   constructor() public{
        manager = msg.sender;
    }

   event flipResult(address player, bool result);

   // 0 = heads, 1 = tails, 2 = unselected
   function flip (uint _selectedSide) payable public returns(bool){
        require(msg.value >= 0.001 ether,"Minimum bid = 0.001 ETH");
        require(msg.value <= 1 ether, "Maximun bid = 1 ETH");
        require(address(this).balance >= msg.value, "Insufficient contract balance");

        address payable player;
        player = msg.sender;

        uint coinSide = now % 2;

        if (_selectedSide == coinSide){
            player.transfer(msg.value * 2);
            emit flipResult(msg.sender, true);
        }
        else{
            emit flipResult(msg.sender, false);
        }
        return true;
    }

    function getBalance() public view returns(uint){
        return address(this).balance; //return contract balance
    }
}
