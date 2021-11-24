const divTower = document.getElementById('divTower');
const btnBet = document.getElementById('btnBet');
const inputBet = document.getElementById('inputBet');
const txtBalance = document.getElementById('txtBalance');
const divPopUp = document.getElementById('divPopUp');
const divOutcome = document.getElementById('divOutcome');
working = false;

btnBet.addEventListener('click', start);
divPopUp.addEventListener('click', hidepopup);
divOutcome.addEventListener('click', function(){ divOutcome.style.display = 'none'; reset(); });

function restock() {
  curdate = new Date();
  curdate = '' + curdate.getDate() + curdate.getMonth() + curdate.getFullYear();
  olddate = localStorage.getItem('Date');
  if(olddate == null) {
    localStorage.setItem('Date', btoa(curdate));4
    localStorage.setItem('Balance',btoa(parseFloat(atob(localStorage.getItem('Balance'))) + 1000));
  }else if(atob(olddate) !== curdate) {
    localStorage.setItem('Balance',btoa(parseFloat(atob(localStorage.getItem('Balance'))) + 1000));
    localStorage.setItem('Date', btoa(curdate));
  }
  fetchBalance();
}
function fetchBalance() {
  bal = localStorage.getItem('Balance');
  if(bal == null) {
    localStorage.setItem('Balance', btoa(1000));
    bal = btoa(1000);
  }
  bal = atob(bal);
  txtBalance.innerHTML = '$' + bal;
}
function setBalance() {
  localStorage.setItem('Balance', btoa(txtBalance.innerHTML.split('$')[1]));
}
function start() {
  if(working !== true) {
    working = true;
    let numBet = inputBet.value;
    if(numBet == '') { 
      showpopup('Invalid Bet');
      working = false;
      return;
    }else if(parseFloat(numBet) == 0) {
      showpopup('Cannot Bet $0');
      working = false;
      return;
    }else if(parseFloat(numBet) > txtBalance.innerHTML.split('$')[1]) {
      showpopup('Cannot Bet More Than You Have');
      working = false;
      return;
    }
    txtBalance.innerHTML = '$' + (Math.floor((parseFloat(txtBalance.innerHTML.split('$')[1]) - Math.floor(parseFloat(numBet) * 100) / 100) * 100) / 100);
    decision();
  }
}
function showpopup(message) {
  divPopUp.style.display = 'block';
  divPopUp.innerHTML = message;
  clearTimeout('clearpopup');
  clearpopup = setTimeout(hidepopup, 3000);
}
function hidepopup() {
  clearTimeout('clearpopup');
  divPopUp.style.display = 'none';
}
function up() {
  let multipliers = divTower.childNodes;
  let unlitMulti = undefined;
  for(i = 1; i < multipliers.length; i += 2) {
    if(window.getComputedStyle(multipliers[i]).backgroundColor !== 'rgb(255, 255, 0)') {
      unlitMulti = multipliers[i];
      break;
    }
  }
  if(unlitMulti !== undefined) {
    unlitMulti.style.backgroundColor = 'yellow';
  } else {
    return 't';
  }
}
function reset() {
  for(i = 1; i < divTower.childNodes.length; i += 2) {
    divTower.childNodes[i].style.backgroundColor = 'rgba(44, 44, 44, 0.705)';
  }
}
function showoutcome(winnings) {
  divOutcome.style.display = 'block';
  divOutcome.childNodes[0].innerHTML = 'You Win: $' + winnings;
}
function decision() {
  let winnings = 0;
  if(Math.random() >= 0.4) {
    let top = up();
    if(top == 't') {
      winnings = Math.floor(inputBet.value*8*100)/100;
      showoutcome(winnings);
      txtBalance.innerHTML = '$' + (parseFloat(txtBalance.innerHTML.split('$')[1]) + winnings);
      setBalance();
      working = false;
    } else {
      setTimeout(decision, 400);
    }
  } else {
    let levels = divTower.childNodes;
    let thelevel = 5;
    for(i = 1; i < levels.length; i += 2) {
      if(window.getComputedStyle(levels[i]).backgroundColor == 'rgba(44, 44, 44, 0.706)') {
        thelevel = ((i - 1) / 2) - 1;
        break;
      }
    }
    if(thelevel == -1) {
      showoutcome(0);
    } else {
      winnings = Math.floor(parseFloat(inputBet.value) * 100 * (0.25 * Math.pow(2, thelevel))) / 100;
    }
    showoutcome(winnings);
    txtBalance.innerHTML = '$' + (parseFloat(txtBalance.innerHTML.split('$')[1]) + Math.floor(winnings * 100)/100);
    setBalance();
    working = false;
  }
}

fetchBalance();
restock();