var web3 = new Web3(Web3.givenProvider);
var contractInstance;

//0 = heads, 1 = tails, 2 = unselected
var coinside = 2;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0xC44b329288B425deDF8D0aE42283A97a4E599FB4", {from: accounts[0]});
      //console.log(contractInstance);
    });

    //reset notifications
    $('#result').text("");
    $('#errorText').text("");

    //User selects heads side
    $("#heads_sw").click(function() {
      coinside = 0; // = heads
      $("#selectedSide").text("Heads");
      $('#heads').css('display', 'inline');
      $('#heads_sw').css('display', 'none');
      $('#tails').css('display', 'none');
      $('#tails_sw').css('display', 'inline');
    });

    //User selects tails side
    $("#tails_sw").click(function() {
      coinside = 1; // = tails
      $("#selectedSide").text("Tails");
      $('#tails').css('display', 'inline');
      $('#tails_sw').css('display', 'none');
      $('#heads').css('display', 'none');
      $('#heads_sw').css('display', 'inline');
    });

    //User sends ETH and starts flippig process
    $("#startButton").click(function() {
      var value = $("#valueInput").val();

      //Check if input is valid
      var valueOk = false;

      //check if input is integer or float
      if(value.match(/^-?\d+$/)){ // = integer
        valueOk = true;
      } else if(value.match(/^\d+\.\d+$/)){ // = float
        valueOk = true;
      }
      else{
        console.log("Error: Invalid input");
        $("#valueInput").css("border-color", "red");
        $('#errorText').text("Invalid input");
      }
      //check if input is in allowed range
      if (valueOk){
        //input not ok
        if (value < 0.001 || value > 1){
          console.error("Error: Input not in allowed range");
          $("#valueInput").css("border-color", "red");
          $('#errorText').text("Bid must be between 0.001 and 1 ether");
        }
        //input ok
        else{
            $('#errorText').text("");
            $("#valueInput").css("border-color", "#ced4da");

            //User has selected a coin side
            if ((coinside == 0) || (coinside == 1)){
                $('#errorText').text("");
                $('#flippingText').css('display', 'inline-block');

                value = value * 1000000000000000000;
                var config = {
                  value: value
                }
                console.log("Selected side: " + coinside);
                console.log("Bid: " + value + " Wei");

                contractInstance.methods.flip(coinside).send(config).
                then(function(res){
                  let result = res.events.flipResult.returnValues[1];
                  console.log(result);

                  if (result == true){
                    $('#result').text("You won!");
                  }else{
                    $('#result').text("Sorry, you lost!");
                  }
                })
            }
            //User has not selected a side
            else{
                $('#errorText').text("Please select a coin side");
                console.error("Error: No side selected");
            }
        }
      }
    });

})
