/* =====================================
   GAMBA V2
   Google Sheets Loot System
===================================== */


/* =====================================
   GOOGLE SHEET SETTINGS
===================================== */


const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSOjnDkM13VMbSWrlvAxmf6vPdQMN5IyTbYDVXuiBrAHS53LrqfGEuoCrY9AlxcgEw8RnYab2VHTDju/pub?output=csv";



let lootTable = [];



/* =====================================
   PLAYER DATA
===================================== */


const defaultPlayer = {

    credits:1000,

    totalValue:0,

    boxes:1,

    inventory:{},

    history:[]

};



let game = loadGame();



/* =====================================
   HTML ELEMENTS
===================================== */


const creditsText =
document.getElementById("credits");


const valueText =
document.getElementById("totalValue");


const boxesText =
document.getElementById("boxes");


const inventoryDiv =
document.getElementById("inventory");


const historyDiv =
document.getElementById("history");


const resultText =
document.getElementById("result");


const lootbox =
document.getElementById("lootbox");


const openButton =
document.getElementById("openButton");


const saveButton =
document.getElementById("saveButton");


const resetButton =
document.getElementById("resetButton");




/* =====================================
   LOAD GOOGLE SHEET
===================================== */


async function loadLootData(){


    try{


        const response =
        await fetch(SHEET_URL);



        const csv =
        await response.text();



        lootTable =
        parseCSV(csv);



        console.log(
            "Loot loaded:",
            lootTable
        );


    }


    catch(error){


        console.error(
            "Failed loading loot",
            error
        );


    }


}





/* =====================================
   CSV PARSER
===================================== */


function parseCSV(csv){


    const rows =
    csv.split("\n");


    const headers =
    rows.shift()
    .split(",");



    return rows.map(row=>{


        const values =
        row.split(",");



        let item={};



        headers.forEach(
            (header,index)=>{


                item[
                    header.trim()
                ] =
                values[index]
                ?.trim();



            }
        );



        item.chance =
        Number(item.chance);



        item.value =
        Number(item.value);



        return item;


    });


}





/* =====================================
   SAVE SYSTEM
===================================== */


function saveGame(){


    localStorage.setItem(

        "gambaSave",

        JSON.stringify(game)

    );


}





function loadGame(){


    const saved =
    localStorage.getItem(
        "gambaSave"
    );



    if(saved){


        return Object.assign(

            {},

            defaultPlayer,

            JSON.parse(saved)

        );


    }



    return structuredClone(
        defaultPlayer
    );


}





/* =====================================
   UI UPDATE
===================================== */


function updateUI(){


    creditsText.textContent =
    game.credits;



    valueText.textContent =
    game.totalValue;



    boxesText.textContent =
    game.boxes;



    drawInventory();


    drawHistory();


}





/* =====================================
   RANDOM ITEM
===================================== */


function getRandomItem(){


    const total =
    lootTable.reduce(

        (sum,item)=>
        sum + item.chance,

        0

    );



    let roll =
    Math.random()*total;



    for(const item of lootTable){


        roll -= item.chance;



        if(roll <=0){


            return item;


        }


    }


}





/* =====================================
   ADD ITEM
===================================== */


function addItem(item){


    if(
        game.inventory[item.name]
    ){


        game.inventory[item.name]
        .count++;


    }

    else{


        game.inventory[item.name]={


            id:item.id,

            name:item.name,

            rarity:item.rarity,

            image:item.image,

            description:item.description,

            value:item.value,

            count:1


        };


    }



    game.totalValue +=
    Number(item.value);



}





/* =====================================
   OPEN LOOTBOX
===================================== */


function openLootbox(){


    if(game.boxes<=0){


        resultText.textContent =
        "No lootboxes available";


        return;


    }



    if(lootTable.length===0){


        resultText.textContent =
        "Loot is still loading...";


        return;


    }



    game.boxes--;



    lootbox.classList.remove(
        "opening"
    );


    void lootbox.offsetWidth;


    lootbox.classList.add(
        "opening"
    );



    const reward =
    getRandomItem();



    addItem(
        reward
    );



    resultText.innerHTML = `


    🎉 You found:

    <br><br>


    <strong>

    ${reward.name}

    </strong>


    <br>


    ${reward.rarity}


    <br>


    Value: ${reward.value}



    `;



    addHistory(

    `${reward.name}
    (${reward.rarity})`

    );



    saveGame();



    updateUI();


}





/* =====================================
   INVENTORY DISPLAY
===================================== */


function drawInventory(){


    inventoryDiv.innerHTML="";



    Object.values(
        game.inventory
    )
    .forEach(item=>{


        const card =
        document.createElement(
            "div"
        );



        card.className =
        "item " +
        item.rarity
        .toLowerCase();



        card.innerHTML=`


        <img src="${item.image}">


        <div class="item-name">

        ${item.name}

        </div>


        <div class="item-rarity">

        ${item.rarity}

        </div>


        <div class="item-value">

        💎 ${item.value}

        </div>


        <div>

        x${item.count}

        </div>


        `;



        inventoryDiv.appendChild(
            card
        );



    });


}





/* =====================================
   HISTORY
===================================== */


function addHistory(text){


    game.history.unshift(
        text
    );


    if(
        game.history.length>15
    ){

        game.history.pop();

    }


}




function drawHistory(){


    historyDiv.innerHTML="";



    game.history.forEach(entry=>{


        const div =
        document.createElement(
            "div"
        );


        div.className =
        "history-entry";


        div.textContent =
        entry;


        historyDiv.appendChild(
            div
        );


    });


}





/* =====================================
   BUTTONS
===================================== */


openButton.onclick =
openLootbox;



saveButton.onclick =
()=>{

saveGame();

resultText.textContent =
"Game Saved";

};



resetButton.onclick =
()=>{


if(confirm("Delete all progress?")){


localStorage.removeItem("gambaSave");

location.reload();

}


};

/* =====================================
   START
===================================== */


async function startGame(){
    await loadLootData();
    updateUI();
}

startGame();
