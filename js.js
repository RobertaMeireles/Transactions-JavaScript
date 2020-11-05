const totalBalance = document.querySelector('#balance')
const totalIncome = document.querySelector('#income')
const totalExpence = document.querySelector('#expense')
const historyList = document.querySelector('#list');
const text = document.querySelector('#text')
const amount = document.querySelector('#amount')
const mybutton = document.querySelector('.btn')
const error = document.querySelector('.erro')
const searchShow = document.querySelector('#searchShow')
const transactionShow = document.querySelector('#transactionShow')
const search = document.querySelector('#search')
const form = document.querySelector('#form')
const btnSearch = document.querySelector('.btnSearch')
const searchInput = document.querySelector('#searchInput')
const infoSearch = document.querySelector('#infoSearch')

let transactions = []
let arrayAux = []

let income = 0
let expense = 0

let addToHistory
let buttonDelete

let showInfo
let searchText
let searchAmount

let firstTime = true
let buttonSearchIsClicked = false
let buttonFormIsClicked = false
let newSearch = false


// Função onload
window.onload = function() {
    transactions=bd.showTransactionsOnView()

    if(transactions.length != 0){
        firstTime = false
    }

    functionsChangeDisplay(historyList,"block")

    transactions.forEach(e => {
        addToHistory = document.createElement('li')
        buttonDelete = document.createElement('button')
        buttonDelete.innerHTML = 'x'
        buttonDelete.id = `${e.id}`
        buttonDelete.classList.add('delete-btn')
        buttonDelete.addEventListener('click', deleteXButton );
        
        if(e.amount < 0){
            addToHistory.classList.add('borderNegative')
        }else{
            addToHistory.classList.add('borderPositive')
        }
    
        addToHistory.innerHTML = `${e.text} <span> ${e.amount}`
    
        historyList.appendChild(addToHistory)
        addToHistory.appendChild(buttonDelete)
            
    });
    updateValueInView()

};

// Class para salvar as informações no localStorage
class Bd {

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }
    
    generateId(){
        let id = localStorage.getItem('id')
        let intId = parseInt(id)
        
        if(intId === 0 && firstTime){
            firstTime = false
            return parseInt(intId)

        }else{
            return parseInt(intId) + 1 
        }
    }
        
    recordLocalStorage(e) {
        let id = this.generateId()
        localStorage.setItem(id, JSON.stringify(e))
        localStorage.setItem('id',id)
    }

    showTransactionsOnView() {
        // Criar uma variavel com o conteudo do id que sera o priximo
        let transactions = localStorage.getItem('id')

        for (let i = 0; i <= transactions; i++){
            let transaction = JSON.parse(localStorage.getItem(i))
            if( transaction != null ){
                transaction.id = i
                arrayAux.push(transaction)
            }
        }
        return arrayAux
    }

    search(){
        let info = searchInput.value
        let y = false
        transactions.forEach(e => {
            if(e.text == info){
                y = true
                searchText = e.text
                searchAmount = e.amount
            }
        });
        if(y){
            createLi()
            functionsChangeDisplay (error,'none')
            y = false
        }else{
            noRegistrer('The value dosent exist!')
        }
    }

    deleteTransactions(id){
        localStorage.removeItem(id)
    }
}


let bd = new Bd()


// Função para validar se os campos do formulário estão preenchidos
const validationForm = () => {
    if(text.value.trim() == ""  || !isNaN(text.value) || amount.value.trim() == ""){
            noRegistrer("The fields need to be filled correctly!")
            return false
    }else{
            functionsChangeDisplay(error,'none')
            return true
    }
    
}

// Funçao principal da aplicação para cadastro das trasactions
const transition = () => {
    event.preventDefault();
    
    if(validationForm()) {

        let transaction = {
            text : text.value,
            amount : +amount.value
        }

        if(!firstTime){
            let x = false
            transactions.forEach(e => {
                if(transaction.text == e.text){
                    x = true
                }
            })

            if(x){
                noRegistrer("This item already exists!")
            }else{
                registerNewAmount(transaction)
            }

        }else{
            registerNewAmount(transaction)
        }
    }
}


/* Função para enviar a transaction para cadastro no localstorage, escrever na tela e 
fazer update dos valores*/
const registerNewAmount = (transaction) =>{
    transactions.push(transaction)
    bd.recordLocalStorage(transaction)
    historyItems()
    updateValueInView()
    functionsChangeDisplay(error,'none')
    text.value = "" 
    amount.value = ""  
}


// Função para não autorizar o cadastro de um item
const noRegistrer = (info) =>{
    functionsChangeDisplay(error,'block')
    error.innerHTML = info
    error.style.color = "red"
}


// Update do resumo do valor na tela
const updateValueInView = () => {
    let incomeAux  = 0
    let expenseAux = 0

    transactions.forEach(e => {
        if(e.amount < 0){
            expenseAux += e.amount
            totalExpence.innerHTML = `${expenseAux} €`
        }else{
            incomeAux += e.amount
            totalIncome.innerHTML = `${incomeAux} €`
        }
        let balance = incomeAux - (-expenseAux)
        income = incomeAux
        expense = expenseAux
        totalBalance.innerHTML = `${balance} €`
        
    });
}


// Função para apresentar na tela a transaction criada na função registerNewAmount
const historyItems = () => {
    functionsChangeDisplay (historyList,'block')
    addToHistory = document.createElement('li')

    for(let i = 0; i < transactions.length; i++) {
        buttonDelete = document.createElement('button')
        buttonDelete.innerHTML = 'x'
        buttonDelete.id = `${i}`
        buttonDelete.classList.add('delete-btn')
        buttonDelete.addEventListener('click', deleteXButton );
    
        if(transactions[i].amount < 0){
            addToHistory.classList.add('borderNegative')
        }else{
            addToHistory.classList.add('borderPositive')
        }

        addToHistory.innerHTML = `${transactions[i].text} <span> ${transactions[i].amount}`

        historyList.appendChild(addToHistory)
        addToHistory.appendChild(buttonDelete)
    }
}


// Função para criar LI para aparecer o conteúdo do método seach da classe bd
const createLi = () =>{

    if(!newSearch){
        newSearch = true
        functionsChangeDisplay (infoSearch,'block')
        showInfo = document.createElement('li')
    
        if(searchAmount < 0){
            showInfo.classList.add('borderNegative')
        }else{
            showInfo.classList.add('borderPositive')
        }
        
        showInfo.innerHTML = `${searchText} <span> ${searchAmount}`
        searchInput.value = ''
    
        infoSearch.appendChild(showInfo)
        console.log(newSearch)

    }else{
        functionsChangeDisplay (showInfo,'none')
        newSearch = false
        createLi()
    }
}


// Fução para iniciar o método search da class bd
const searchTransaction = () => {
    event.preventDefault();
    bd.search()
}


// Função para modificar o display da tag
const functionsChangeDisplay = (tag,change) =>{
    tag.style.display = change;
}


// Função para deletar o item (X button)
function deleteXButton(e) {
    //e.target.parentNode.parentNode.removeChild(e.target.parentNode); // excluir o target sem atualizar a tela
    bd.deleteTransactions(e.target.id)
    window.location.reload()
};


// Função para ocutar e aparecer os campos do search. Acionado ao clicar na tela na palavra search
searchShow.addEventListener("click", function() {
    if(!buttonSearchIsClicked){
        functionsChangeDisplay (search,'block')
        buttonSearchIsClicked = true
    }else{
        functionsChangeDisplay (search,'none')
        buttonSearchIsClicked = false
    }
});


/* Função para ocutar e aparecer os campos do formulário para cadastrar nova transaction. 
Acionado ao clicar na tela na palavra Add new transaction*/
transactionShow.addEventListener("click", function() {
    if(!buttonFormIsClicked){
        functionsChangeDisplay (form,'block')
        buttonFormIsClicked = true
    }else{
        functionsChangeDisplay (form,'none')
        buttonFormIsClicked = false
    }
});


// Start search
btnSearch.addEventListener('click', searchTransaction)


// Start program
mybutton.addEventListener('click', transition)


//DICAS APREENDIDAS. COMO CRIAR UMA TAG PELO JS
//errorMessage = document.createElement('p')
//errorMessage.innerHTML = "The fields need to be filled!"
//form.appendChild(errorMessage)
//errorMessage.style.color = "red"
//errorMessage.setAttribute('id','erromessage')
