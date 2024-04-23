<h1 align="center">Extended RPS Game</h1>

<h3 align="center"> Sepolia based application to play the extended Rock, Paper, Scissors game (RPSLS)</h3>

[Preview](https://advanced-rps.netlify.app/)

## Game Rules

Winning in the RPSLS follows this rule:

> Scissors cuts paper.\
> Paper covers rock.\
> Rock crushes lizard.\
> Lizard poisons Spock.\
> Spock smashes scissors.\
> Scissors decapitates lizard.\
> Lizard eats paper.\
> Paper disproves Spock.\
> Spock vaporizes rock.\
> Rock crushes scissors.

<p><a href="https://commons.wikimedia.org/wiki/File:Rock_Paper_Scissors_Lizard_Spock_en.svg#/media/File:Rock_Paper_Scissors_Lizard_Spock_en.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Rock_Paper_Scissors_Lizard_Spock_en.svg" alt="Rock Paper Scissors Lizard Spock en.svg" height="380" width="450"></a>

## How to run

```bash
git clone https://github.com/nano235/rpsls.git

cd /path/to/folder/rpsls

npm install # or yarn

npm run dev # or yarn dev
```

This project is dependent on metamask wallet so enusre you have setup metamask and created a wallet. To simulate two user's playing the game, simply open the app in two browser tabs or windows

## About the project

This is a basic implementation of the extended RPS game. Game logic is entirely on the smart contract [Rps.sol](https://github.com/clesaege/RPS/blob/master/RPS.sol).

## How to play

For Player 1.

1. Connect metamask wallet
2. Click on 'Start New Game'
3. Enter amount to stake, paste player 2 wallet address then click on 'Start Gamee'

For player 2.

1. Connect metamask wallet
2. Click on 'Join A Game'. This navigates to the /join-game page.
3. To actually join a game, click on the 'Join Game' button, paste the game contract address sent by player 1. Player 2 must have the same amount of ETH for staking.

## Challenges / Improvements

The project is entirely based on smart contract and FE. To better implement the task, either of the following can be implemented

1. The smart contract is modified to include events for when player1 reveals (`event Revealed(address indexed player, uint256 move)`) his move (game over) and when player2 has submitted a move (`event Played(address indexed player, uint256 move)`). This is required to control the game state in FE. So basically, FE listens to this events to construct game state and properly show individual moves after game is over.

Also, rather than Player 1 needing to deploy the game contract, a solidity factory-pattern should be used for the game contract. This means, there will be a factory contract that will deploy each game contract.

OR.

2. A backend layer is introduced. This will proxy all shared communication/data between game players.
    - Ideally, a peer network is established using websockets. So, when player1 initiates a game, a gameId can be generated and broadcasted to the server (private or public game).
    - Player two can then establish a connection which will expose player 2's wallet address to player 1.
    - Now, FE shows player 2 address in list of players for player 1 to select. Player 1 can select the address and start the game (deploys the contract and submit hashed move).
    - Using socket, player 1 emits a 'PLAY' event to player 2.
    - The app listens to this event and starts the timer, if the play time elapses and player 2 is yet to respond, a TIMEOUT event is emitted. Player 1 listens to this event and is able to call "j2Timeout" function on smart contract to win and claim stake
    - If player 2 plays within allocated time, "PLAY" event is also emitted and player 1 timer is triggered. Player 1 must reveal his move within the time otherwise "TIMEOUT" event is also emitted and player 2 calls "j1Timeout" function on contract
    - Finally, backend must store the player moves in a safe way preferrably only after the player 2's PLAY event has been emitted. A game history can also be kept.

Some of the challenges with the current implementation of this project is the fact that game state is not completely shared. Why some data can be polled from the smart contract, not all required data are available. Currently, the game can be played across different browsers without issue. The only blocker, is that player 2 will be unable to see the winning move from player 1. There's however a notification that game player 1 has revealed move. In this case, to know the result will be to check wallet balance.

# Mixed Strategy Nash Equilibria

In this game, the mixed strategy Nash equilibria involves choosing each move with equal probability.

So, if two friends play this game over and over again, the best strategy is to pick each move (rock, paper, scissors, lizard, and Spock) with a probability of 20% (1/5) each. This means they're equally likely to choose any move every time they play.
