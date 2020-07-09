let startRoulette = 1

function checkNumber(str) {
    if (str == "") return false
    let reg = /^\d*$/g
    if (reg.test(str)) {
        return true
    }  
    return false
}

function addElement(parent, tag, text, classElement) {
    let elem = document.createElement(tag)
    let elemText = document.createTextNode(text)
    elem.appendChild(elemText)
    elem.classList.add(classElement)
    parent.appendChild(elem)
}

function createRoullete(startNum) {
    let listRoullete = document.getElementById('roulette-list')

    for(let i = 90; i <= 100; i++) {
        addElement(listRoullete, 'li', i, 'roulette-number')
    }
    for(let i = 1; i < 101; i++) {
        addElement(listRoullete, 'li', i, 'roulette-number')
    }
    for(let i = 1; i < 5; i++) {
        addElement(listRoullete, 'li', i, 'roulette-number')
    }

    let startPos = calculatePos(startNum)
    listRoullete.style.left = `${startPos}px`
}

function calculatePos(num) {
    let el = document.getElementsByClassName('roulette-number')
    let elWidth = el[0].clientWidth + 10
    let indexOne = findOneIndex()
    return -(elWidth * (num + indexOne - 1)) - elWidth/2
}

function deleteRoullete() {
    let listRoullete = document.getElementById('roulette-list')
    while (listRoullete.firstChild) listRoullete.removeChild(listRoullete.firstChild)
}

function spinRoullete(stopNum) {
    let listRoullete = document.getElementById('roulette-list')
    let stopPos = calculatePos(stopNum)
    listRoullete.style.left = `${stopPos}px`
}

function findOneIndex() {
    let lis = document.getElementsByClassName('roulette-number')
    for(let i = 0; i < lis.length; i++) {
        if (lis[i].textContent == '1') return i
    }
}

function showResult(data) {
        let result = document.getElementById('result')
        let gamer = document.getElementById('balance-gamer')
        let casino = document.getElementById('balance-casino')
        
        if (data.result === "Выйгрыш х2") {
            result.classList.add('res-win')
        } else if (data.result === "Ничья") {
            result.classList.add('res-standoff')
        } else if (data.result === "Проигрыш") {
            result.classList.add('res-lose')
        }
        result.textContent = data.result
        gamer.innerText = data.gamer
        casino.innerText = data.casino
}

function showHistory(data) {
    let list = document.getElementById('history-list')
    let tr = document.createElement('tr')
    let result
    let bet = data.bet
    
    if (data.result === "Выйгрыш х2") {
        result = 'win'
        bet *= 2
    } else if (data.result === "Ничья") {
        result = 'standoff'
    } else if (data.result === "Проигрыш") {
        result = 'lose'
    }

    addElement(tr, 'td', `${bet}$`, result)
    addElement(tr, 'td', `${data.number}`, result)
    addElement(tr, 'td', `${data.roulette}`, result)
    list.appendChild(tr)
}

function sendData() {
    return new Promise((resolve, reject) => {
        let bet = document.getElementById('bet').value
        let num = document.getElementById('num').value
        let dataServer

        if (checkNumber(bet) && checkNumber(num)) {
            let data = `bet=${bet}&num=${num}`
            let xhr = new XMLHttpRequest()
            xhr.open('POST', '../../pphh.php', true)
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
            xhr.send(data)
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let returnData = xhr.responseText
                    dataServer = JSON.parse(returnData)
                    //document.getElementById("status").innerHTML = returnData
                    startRoulette = dataServer.roulette
                    resolve(dataServer)
                }
            }
            //document.getElementById("status").innerHTML = "загрузка..."
            //setTimeout(() => , 100)
        } else {
            reject(new Error('Введите число'))
        }
    }).catch(err => {
        let result = document.getElementById('result')
        result.classList.add('err')
        result.innerText = err.message
    })
}

function getBalance() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        let balance = 'balance='+'{"balance-gamer":10000,"balance-casino":20000}'
        let returnData
        xhr.open('POST', '../../balance.php', true)
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xhr.send(balance)
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                returnData = xhr.responseText
                resolve(returnData)
            }
        }
    })
}

function gameover(gamer, casino) {
    if (gamer <= 0) document.getElementById('end-lose').style.display = 'block'
    if (casino <= 0)  document.getElementById('end-win').style.display = "block"
}

async function roulette() {
    document.getElementById('result').textContent = "Результат..."
    if (result.className) result.classList.remove(result.className)
    let answerServer = await sendData()
    console.log(answerServer)
    if ( (typeof answerServer == "object") && (answerServer.hasOwnProperty('result')) ) {
        spinRoullete(answerServer.roulette)
        setTimeout(() => {
            showResult(answerServer)
            showHistory(answerServer)
            gameover(answerServer.gamer, answerServer.casino)
        }, 5000)
    } else if ((typeof answerServer == "object") && (answerServer.hasOwnProperty('err')) ) {
        let result = document.getElementById('result')
        result.classList.add('err')
        result.innerText = answerServer.err
    }
}

document.getElementById('buttonSpin').addEventListener('click', roulette)
document.addEventListener("DOMContentLoaded", ready)

async function ready () {
    let gamer = document.getElementById('balance-gamer')
    let casino = document.getElementById('balance-casino')
    createRoullete(startRoulette)
    let balance = await getBalance()
    let balanceJSON = JSON.parse(balance)
    setTimeout( () => {
        document.getElementById('roulette-list').classList.add('animation')
    }, 100)
    gamer.innerText = balanceJSON["balance-gamer"]
    casino.innerText = balanceJSON["balance-casino"]
}