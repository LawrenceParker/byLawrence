/*=====================================
    G A M B A
======================================*/

const game = {
    coins: 0,
    gems: 0,
    boxes: 1,
    inventory: {},
    history: []
};

/*=====================================
    ITEM DATABASE
======================================*/

const lootTable = [

    {
        name:"Rusty Sword",
        rarity:"common",
        chance:40,
        coins:5
    },

    {
        name:"Wooden Shield",
        rarity:"common",
        chance:30,
        coins:5
    },

    {
        name:"Iron Helmet",
        rarity:"rare",
        chance:15,
        coins:15
    },

    {
        name:"Magic Wand",
        rarity:"epic",
        chance:8,
        coins:40
    },

    {
        name:"Dragon Egg",
        rarity:"legendary",
        chance:5,
        coins:120
    },

    {
        name:"Phoenix Feather",
        rarity:"mythic",
        chance:2,
        coins:500,
        gems:5
    }

];

/*=====================================
    HTML REFERENCES
======================================*/

const coinsText = document.getElementById("coins");
const gemsText = document.getElementById("gems");
const boxesText = document.getElementById("boxes");

const inventoryDiv = document.getElementById("inventory");
const historyDiv = document.getElementById("history");

const resultText = document.getElementById("result");

const lootbox = document.getElementById("lootbox");

const openButton = document.getElementById("openButton");

const saveButton = document.getElementById("saveButton");

const resetButton = document.getElementById("resetButton");

/*=====================================
    SAVE / LOAD
======================================*/

function saveGame(){

    localStorage.setItem(
        "gambaSave",
        JSON.stringify(game)
    );

}

function loadGame(){

    const save =
        localStorage.getItem("gambaSave");

    if(save){

        Object.assign(
            game,
            JSON.parse(save)
        );

    }

}

loadGame();

/*=====================================
    UPDATE UI
======================================*/

function updateUI(){

    coinsText.textContent = game.coins;

    gemsText.textContent = game.gems;

    boxesText.textContent = game.boxes;

    drawInventory();

    drawHistory();

}

/*=====================================
    INVENTORY
======================================*/

function addItem(item){

    if(game.inventory[item.name]){

        game.inventory[item.name].count++;

    }else{

        game.inventory[item.name]={
            rarity:item.rarity,
            count:1
        };

    }

}

/*=====================================
    DRAW INVENTORY
======================================*/

function drawInventory(){

    inventoryDiv.innerHTML="";

    const keys =
        Object.keys(game.inventory);

    if(keys.length===0){

        inventoryDiv.innerHTML=
        "<p class='empty'>Inventory Empty</p>";

        return;

    }

    keys.forEach(name=>{

        const item =
            game.inventory[name];

        const card =
            document.createElement("div");

        card.className=
            "item "+item.rarity;

        card.innerHTML=`

            <div class="item-name">
                ${name}
            </div>

            <div class="item-count">
                x${item.count}
            </div>

        `;

        inventoryDiv.appendChild(card);

    });

}

/*=====================================
    HISTORY
======================================*/

function addHistory(text){

    game.history.unshift(text);

    if(game.history.length>15){

        game.history.pop();

    }

}

function drawHistory(){

    historyDiv.innerHTML="";

    game.history.forEach(entry=>{

        const div =
            document.createElement("div");

        div.className="history-entry";

        div.textContent=entry;

        historyDiv.appendChild(div);

    });

}

/*=====================================
    RANDOM DROP
======================================*/

function getRandomItem(){

    const total =
        lootTable.reduce(
            (sum,item)=>sum+item.chance,
            0
        );

    let roll =
        Math.random()*total;

    for(const item of lootTable){

        if(roll<item.chance){

            return item;

        }

        roll-=item.chance;

    }

}

/*=====================================
    OPEN LOOTBOX
======================================*/

function openLootbox(){

    if(game.boxes <= 0){

        resultText.textContent =
        "❌ You have no lootboxes left!";

        return;

    }


    // Remove box

    game.boxes--;


    // Animation

    lootbox.classList.remove("opening");

    void lootbox.offsetWidth;

    lootbox.classList.add("opening");


    // Get reward

    const reward = getRandomItem();


    // Add item

    addItem(reward);


    // Give currency

    let rewardText = 
    `🎁 You found ${reward.name}!`;


    if(reward.coins){

        game.coins += reward.coins;

        rewardText +=
        ` +${reward.coins} coins`;

    }


    if(reward.gems){

        game.gems += reward.gems;

        rewardText +=
        ` +${reward.gems} gems`;

    }


    // History

    addHistory(
        `${getTime()} - ${reward.name} (${reward.rarity})`
    );


    // Show result

    resultText.textContent =
        rewardText;


    // Save

    saveGame();


    // Update screen

    updateUI();

}


/*=====================================
    BUTTON EVENTS
======================================*/


openButton.addEventListener(
    "click",
    openLootbox
);


saveButton.addEventListener(
    "click",
    ()=>{

        saveGame();

        resultText.textContent =
        "💾 Game saved!";

    }
);



resetButton.addEventListener(
    "click",
    ()=>{


        const confirmReset =
        confirm(
            "Delete all progress?"
        );


        if(confirmReset){

            localStorage.removeItem(
                "gambaSave"
            );


            location.reload();

        }


    }
);



/*=====================================
    UTILITIES
======================================*/


function getTime(){

    const now =
        new Date();

    return now.toLocaleTimeString();

}


/*=====================================
    START GAME
======================================*/


updateUI();